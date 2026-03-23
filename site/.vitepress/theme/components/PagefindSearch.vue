<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { withBase } from "vitepress";

const searchRoot = ref(null);
const loadError = ref("");
let searchInstance = null;

function ensureStylesheet() {
  const href = withBase("/pagefind/pagefind-ui.css");

  if (document.querySelector(`link[data-pagefind-ui="${href}"]`)) {
    return;
  }

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  link.dataset.pagefindUi = href;
  document.head.appendChild(link);
}

function loadScript() {
  const src = withBase("/pagefind/pagefind-ui.js");

  return new Promise((resolve, reject) => {
    if (window.PagefindUI) {
      resolve();
      return;
    }

    const existing = document.querySelector(`script[data-pagefind-ui="${src}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Pagefind UI load failed")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.dataset.pagefindUi = src;
    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener("error", () => reject(new Error("Pagefind UI load failed")), { once: true });
    document.body.appendChild(script);
  });
}

onMounted(async () => {
  try {
    ensureStylesheet();
    await loadScript();

    if (!searchRoot.value || !window.PagefindUI) {
      throw new Error("Pagefind UI unavailable");
    }

    searchInstance = new window.PagefindUI({
      element: searchRoot.value,
      bundlePath: withBase("/pagefind/"),
      showSubResults: true,
      pageSize: 8,
      resetStyles: false,
      translations: {
        placeholder: "搜索整站内容",
        clear_search: "清除",
        load_more: "加载更多",
        search_label: "站内搜索",
        zero_results: "没有找到 “[SEARCH_TERM]” 的结果"
      }
    });
  } catch (error) {
    loadError.value = import.meta.env.DEV
      ? "开发模式下不会生成 Pagefind 索引。请先运行 `npm run docs:build`，再使用 `npm run docs:preview` 验证搜索。"
      : "Pagefind 搜索资源加载失败，请先确认构建产物中已生成 `/pagefind/` 目录。";
  }
});

onBeforeUnmount(() => {
  if (searchInstance?.destroy) {
    searchInstance.destroy();
  }
});
</script>

<template>
  <div class="search-page">
    <p class="search-page__lead">
      搜索会覆盖中文版、英文版和双语版内容。建议直接输入章节名、术语或关键概念。
    </p>
    <div v-if="loadError" class="search-page__status is-error">{{ loadError }}</div>
    <div v-else ref="searchRoot" />
    <p class="search-page__tip">
      索引在构建阶段生成，因此 GitHub Pages 上的搜索会和已部署站点内容保持同步。中文搜索建议优先使用空格分词，或用引号进行精确短语匹配。
    </p>
  </div>
</template>
