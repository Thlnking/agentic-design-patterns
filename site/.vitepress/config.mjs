import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitepress";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const siteRoot = path.resolve(__dirname, "..");

const MAIN_ORDER = [
  "Agentic Design Patterns.md",
  "Conclusion.md",
  "Glossary.md",
  "Index of Terms.md",
  "Frequently Asked Questions_ Agentic Design Patterns.md",
  "Online contribution - Frequently Asked Questions_ Agentic Design Patterns.md"
];

function routeFromFile(section, fileName) {
  const stem = fileName.replace(/\.md$/, "");
  return `/${section}/${encodeURIComponent(stem)}`;
}

function extractTitles(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const headings = [...content.matchAll(/^#\s+(.+)$/gm)].map((match) => match[1].trim());
  return headings;
}

function labelForFile(filePath, mode) {
  const headings = extractTitles(filePath);

  if (mode === "bilingual") {
    return headings[1] || headings[0] || path.basename(filePath, ".md");
  }

  return headings[0] || path.basename(filePath, ".md");
}

function parseChapterNumber(fileName) {
  const match = fileName.match(/^Chapter\s+(\d+)_/);
  return match ? Number(match[1]) : Number.POSITIVE_INFINITY;
}

function parseAppendixLetter(fileName) {
  const match = fileName.match(/^Appendix\s+([A-Z])_/);
  return match ? match[1] : "Z";
}

function categorizeFiles(dirName) {
  const dirPath = path.join(siteRoot, dirName);
  const files = fs
    .readdirSync(dirPath)
    .filter((file) => file.endsWith(".md") && file !== "index.md");

  const main = files
    .filter((file) => MAIN_ORDER.includes(file))
    .sort((a, b) => MAIN_ORDER.indexOf(a) - MAIN_ORDER.indexOf(b));
  const chapters = files
    .filter((file) => /^Chapter\s+\d+_/.test(file))
    .sort((a, b) => parseChapterNumber(a) - parseChapterNumber(b));
  const appendices = files
    .filter((file) => /^Appendix\s+[A-Z]_/.test(file))
    .sort((a, b) => parseAppendixLetter(a).localeCompare(parseAppendixLetter(b)));

  return { main, chapters, appendices };
}

function itemsFor(section, files, mode) {
  return files.map((fileName) => ({
    text: labelForFile(path.join(siteRoot, section, fileName), mode),
    link: routeFromFile(section, fileName)
  }));
}

function sidebarFor(section, mode, labels) {
  const { main, chapters, appendices } = categorizeFiles(section);

  return [
    {
      text: labels.main,
      items: [
        { text: labels.index, link: `/${section}/` },
        ...itemsFor(section, main, mode)
      ]
    },
    {
      text: labels.chapters,
      items: itemsFor(section, chapters, mode)
    },
    {
      text: labels.appendices,
      items: itemsFor(section, appendices, mode)
    }
  ];
}

const zhSidebar = sidebarFor("chapters", "zh", {
  main: "阅读入口",
  index: "中文版首页",
  chapters: "核心章节",
  appendices: "附录"
});

const enSidebar = sidebarFor("original", "en", {
  main: "Getting Started",
  index: "English Index",
  chapters: "Core Chapters",
  appendices: "Appendices"
});

const bilingualSidebar = sidebarFor("bilingual", "bilingual", {
  main: "双语入口",
  index: "双语版首页",
  chapters: "核心章节",
  appendices: "附录"
});

export default defineConfig({
  base: "/agentic-design-patterns/",
  title: "Agentic Design Patterns",
  description: "《Agentic Design Patterns》中文、英文与双语对照阅读站点",
  lang: "zh-CN",
  cleanUrls: true,
  ignoreDeadLinks: [
    /^https:\/\/docs\.google\.com\//,
    /^https:\/\/drive\.google\.com\//,
    /^https:\/\/colab\.research\.google\.com\//,
    /^https:\/\/www\.amazon\.com\//,
    /^http:\/\/localhost:8000/,
    /^\.\/%E6/
  ],
  themeConfig: {
    logo: "/images/cover.png",
    nav: [
      { text: "首页", link: "/" },
      { text: "中文版", link: "/chapters/" },
      { text: "English", link: "/original/" },
      { text: "双语", link: "/bilingual/" },
      { text: "搜索", link: "/search" },
      { text: "GitHub", link: "https://github.com/xindoo/agentic-design-patterns" }
    ],
    sidebar: {
      "/chapters/": zhSidebar,
      "/original/": enSidebar,
      "/bilingual/": bilingualSidebar
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/xindoo/agentic-design-patterns" }
    ],
    outline: {
      level: [2, 3],
      label: "页面大纲"
    },
    docFooter: {
      prev: "上一页",
      next: "下一页"
    }
  }
});
