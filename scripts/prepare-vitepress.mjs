import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const siteDir = path.join(rootDir, "site");

const managedEntries = [
  "index.md",
  "chapters",
  "original",
  "bilingual",
  "images",
  "public"
];

const chapterSectionIntro = `---
title: 中文版
---

# 中文版

这里收录《Agentic Design Patterns》中文翻译版本，按章节、附录和补充材料组织。

- 从侧边栏选择章节开始阅读
- 如需英文原文，请切换到顶部的 \`English\`
- 如需中英对照，请切换到顶部的 \`双语\`
`;

const originalSectionIntro = `---
title: English Edition
---

# English Edition

This section contains the original English source material for *Agentic Design Patterns*.

- Use the sidebar to jump between chapters and appendices
- Switch to \`中文版\` for the Chinese translation
- Switch to \`双语\` for paragraph-by-paragraph bilingual reading
`;

const homePage = `---
layout: home

hero:
  name: Agentic Design Patterns
  text: 中文翻译、英文原文与双语对照阅读站点
  tagline: 基于 VitePress 构建，面向 GitHub Pages 部署
  actions:
    - theme: brand
      text: 阅读中文版
      link: /chapters/
    - theme: alt
      text: Read in English
      link: /original/
    - theme: alt
      text: 双语对照
      link: /bilingual/

features:
  - title: 三种阅读模式
    details: 中文版、英文版、双语版共用一套内容源，便于翻译、校对和对照阅读。
  - title: Markdown 优先
    details: 保持 chapters、original、bilingual 作为主内容目录，降低迁移和维护成本。
  - title: GitHub Pages 部署
    details: 站点通过 VitePress 构建为静态资源，可直接发布到 GitHub Pages 或自定义域名。
---
`;

function resetManagedEntries() {
  mkdirSync(siteDir, { recursive: true });

  for (const entry of managedEntries) {
    const target = path.join(siteDir, entry);
    rmSync(target, { recursive: true, force: true });
  }
}

function copyDirectory(sourceDirName) {
  cpSync(path.join(rootDir, sourceDirName), path.join(siteDir, sourceDirName), {
    recursive: true
  });
}

function renameReadmeToIndex(dirName) {
  const targetDir = path.join(siteDir, dirName);
  const readmePath = path.join(targetDir, "README.md");
  const indexPath = path.join(targetDir, "index.md");

  if (existsSync(readmePath)) {
    rmSync(indexPath, { force: true });
    writeFileSync(indexPath, readFileSync(readmePath, "utf8"));
    rmSync(readmePath, { force: true });
  }
}

function writeSectionIndex(dirName, content) {
  writeFileSync(path.join(siteDir, dirName, "index.md"), content);
}

function writePublicFiles() {
  const publicDir = path.join(siteDir, "public");
  mkdirSync(publicDir, { recursive: true });

  const cnamePath = path.join(rootDir, "CNAME");
  if (existsSync(cnamePath)) {
    writeFileSync(path.join(publicDir, "CNAME"), readFileSync(cnamePath, "utf8"));
  }
}

function ensureManagedDirectories() {
  for (const dir of ["chapters", "original", "bilingual"]) {
    const targetDir = path.join(siteDir, dir);
    if (!existsSync(targetDir)) {
      throw new Error(`Missing source directory after copy: ${dir}`);
    }
  }
}

function removeJekyllFrontmatterFromBilingualIndex() {
  const indexPath = path.join(siteDir, "bilingual", "index.md");
  if (!existsSync(indexPath)) {
    return;
  }

  const original = readFileSync(indexPath, "utf8");
  const normalized = original.replace(/^---\n[\s\S]*?\n---\n+/, "");
  writeFileSync(indexPath, normalized);
}

function writeRootIndex() {
  writeFileSync(path.join(siteDir, "index.md"), homePage);
}

function escapeTemplateLikeTags(content) {
  const lines = content.split("\n");
  let inCodeFence = false;

  return lines
    .map((line) => {
      if (/^```/.test(line.trim())) {
        inCodeFence = !inCodeFence;
        return line;
      }

      if (inCodeFence) {
        return line;
      }

      return line.replace(/<[/A-Za-z\u4e00-\u9fff][^>\n]{0,80}>/g, (match) => {
        if (match.startsWith("\\<")) {
          return match;
        }

        return match.replace(/</g, "\\<").replace(/>/g, "\\>");
      });
    })
    .join("\n");
}

function rewriteLegacyLinks(content) {
  return content.replace(/\]\((?:\.\/)?README\.md\)/g, "](/)");
}

function normalizeMarkdownFiles(dirName) {
  const dirPath = path.join(siteDir, dirName);
  const files = readdirSync(dirPath).filter((file) => file.endsWith(".md"));

  for (const fileName of files) {
    const filePath = path.join(dirPath, fileName);
    const content = readFileSync(filePath, "utf8");
    const normalized = rewriteLegacyLinks(escapeTemplateLikeTags(content));
    writeFileSync(filePath, normalized);
  }
}

function listMarkdownFiles(dirName) {
  return readdirSync(path.join(rootDir, dirName)).filter((file) => file.endsWith(".md"));
}

function validateCopiedFiles() {
  const sourceCounts = ["chapters", "original", "bilingual"].map((dirName) => ({
    dirName,
    count: listMarkdownFiles(dirName).length
  }));

  const copiedCounts = ["chapters", "original", "bilingual"].map((dirName) => ({
    dirName,
    count: readdirSync(path.join(siteDir, dirName)).filter((file) => file.endsWith(".md")).length
  }));

  for (const source of sourceCounts) {
    const copied = copiedCounts.find((item) => item.dirName === source.dirName);
    if (!copied || copied.count !== source.count) {
      throw new Error(`Copied markdown count mismatch for ${source.dirName}: expected ${source.count}, got ${copied?.count ?? 0}`);
    }
  }
}

resetManagedEntries();
copyDirectory("chapters");
copyDirectory("original");
copyDirectory("bilingual");
copyDirectory("images");
ensureManagedDirectories();
renameReadmeToIndex("chapters");
renameReadmeToIndex("original");
removeJekyllFrontmatterFromBilingualIndex();
writeSectionIndex("chapters", chapterSectionIntro);
writeSectionIndex("original", originalSectionIntro);
writeRootIndex();
normalizeMarkdownFiles("chapters");
normalizeMarkdownFiles("original");
normalizeMarkdownFiles("bilingual");
writePublicFiles();
validateCopiedFiles();
