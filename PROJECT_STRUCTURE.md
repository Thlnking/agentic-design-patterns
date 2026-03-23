# 项目结构说明

```
agentic-design-patterns/
│
├── README.md                 # 项目主说明文档
├── CONTRIBUTING.md          # 贡献指南
├── translation-guide.md     # 翻译指南
├── progress.md              # 翻译进度追踪
├── glossary.md              # 术语对照表
├── PROJECT_STRUCTURE.md     # 本文件 - 项目结构说明
├── .gitignore               # Git 忽略文件配置
├── package.json             # VitePress 与站点构建脚本
├── package-lock.json        # Node 依赖锁文件
├── CNAME                    # GitHub Pages 自定义域名
│
├── chapters/                # 翻译后的章节目录
│   ├── README.md            # 章节目录说明
│   ├── Agentic Design Patterns.md
│   ├── Chapter 1_ Prompt Chaining.md
│   ├── Chapter 2_ Routing.md
│   └── ...                  # 其他章节、附录与补充材料
│
├── original/                # 原文备份目录
│   ├── README.md            # 原文目录说明
│   ├── Agentic Design Patterns.md
│   ├── Chapter 1_ Prompt Chaining.md
│   └── ...                  # 其他原文章节、附录与补充材料
│
├── bilingual/               # 双语对照版本
│   ├── index.md             # 双语版首页
│   ├── Chapter 1_ Prompt Chaining.md
│   ├── Chapter 2_ Routing.md
│   └── ...                  # 其他双语章节、附录与补充材料
│
├── images/                  # 图片资源目录
│   ├── README.md            # 图片目录说明
│   ├── cover.png            # 封面图片
│   ├── chapter-1/           # 第1章图片
│   ├── chapter-2/           # 第2章图片
│   └── ...                  # 其他章节与附录图片目录
│
├── scripts/
│   └── prepare-vitepress.mjs # 构建前同步内容到 VitePress 站点目录
│
├── site/
│   └── .vitepress/          # VitePress 配置、主题与组件
│
├── .github/
│   └── workflows/           # GitHub Pages 与 PDF/EPUB 工作流
│
├── _config.yml              # 历史 Jekyll 配置（迁移后保留）
├── _includes/               # 历史 Jekyll 模板片段（迁移后保留）
└── _layouts/                # 历史 Jekyll 布局文件（迁移后保留）

```

## 目录说明

### 根目录文件

- **README.md**: 项目总体介绍，包括项目简介、结构、贡献方式等
- **CONTRIBUTING.md**: 详细的贡献指南，包括翻译规范、工作流程、审核标准
- **translation-guide.md**: 翻译指南，包括翻译原则、格式规范、术语对照
- **progress.md**: 翻译进度追踪表，记录每章的翻译状态和负责人
- **glossary.md**: 术语对照表，统一专业术语的翻译
- **package.json / package-lock.json**: VitePress 构建和依赖管理
- **CNAME**: 自定义域名配置
- **.gitignore**: Git 版本控制忽略文件配置

### 核心目录

1. **chapters/**: 存放翻译后的中文章节
   - 是中文版的主内容源
   - 文件名保持原文英文命名，便于对照和同步
   
2. **original/**: 存放英文原文
   - 便于翻译时对照参考
   - 与 `chapters/` 保持对应关系

3. **bilingual/**: 存放双语对照内容
   - 英文段落后紧跟中文翻译
   - 用于网页双语阅读和双语 PDF/EPUB 生成

4. **images/**: 存放所有图片资源
   - `cover.png`: 站点和电子书封面
   - `chapter-XX/`: 各章节专用图片

5. **scripts/**: 存放站点构建辅助脚本
   - `prepare-vitepress.mjs` 会在构建前生成 `site/` 下的内容镜像

6. **site/.vitepress/**: VitePress 站点配置
   - 包含导航、侧边栏、主题组件和样式

7. **.github/workflows/**: 自动化工作流
   - 包括 GitHub Pages 部署与 PDF/EPUB 生成

8. **历史 Jekyll 文件**
   - `_config.yml`、`_includes/`、`_layouts/` 目前仍保留在仓库中
   - 如无明确迁移需要，不应继续基于这些文件开发新功能

## 使用流程

1. **准备阶段**
   - 安装依赖：`npm install`
   - 确认需要修改的内容位于 `chapters/`、`original/` 或 `bilingual/`

2. **翻译阶段**
   - 在 Issues 中认领要翻译的章节
   - 参考 `original/` 中的原文进行翻译
   - 将翻译结果保存到 `chapters/` 目录
   - 如涉及双语展示，同步更新 `bilingual/`
   - 更新图片引用路径

3. **审核阶段**
   - 提交 Pull Request
   - 其他贡献者审核翻译质量
   - 根据反馈修改完善

4. **完成阶段**
   - 运行 `npm run docs:build` 验证站点构建
   - PR 合并后更新 `progress.md`
   - 继续下一章节的翻译或审校

## 注意事项

- 所有 Markdown 文件使用 UTF-8 编码
- 图片引用使用相对路径
- `chapters/`、`original/`、`bilingual/` 是可编辑内容源
- `site/` 下除 `.vitepress/` 外主要是构建生成内容，不应手工维护
- 及时更新进度文件
