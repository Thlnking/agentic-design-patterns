<script setup>
import { computed } from "vue";
import { useRoute, withBase } from "vitepress";

const props = defineProps({
  mobile: {
    type: Boolean,
    default: false
  }
});

const route = useRoute();

const FAQ_ROUTE_MAP = {
  "/chapters/Frequently%20Asked%20Questions_%20Agentic%20Design%20Patterns": {
    original: "/original/Online%20contribution%20-%20Frequently%20Asked%20Questions_%20Agentic%20Design%20Patterns",
    bilingual: "/bilingual/Frequently%20Asked%20Questions_%20Agentic%20Design%20Patterns"
  },
  "/original/Online%20contribution%20-%20Frequently%20Asked%20Questions_%20Agentic%20Design%20Patterns": {
    chapters: "/chapters/Frequently%20Asked%20Questions_%20Agentic%20Design%20Patterns",
    bilingual: "/bilingual/Frequently%20Asked%20Questions_%20Agentic%20Design%20Patterns"
  },
  "/bilingual/Frequently%20Asked%20Questions_%20Agentic%20Design%20Patterns": {
    chapters: "/chapters/Frequently%20Asked%20Questions_%20Agentic%20Design%20Patterns",
    original: "/original/Online%20contribution%20-%20Frequently%20Asked%20Questions_%20Agentic%20Design%20Patterns"
  }
};

function normalizePath(input) {
  if (!input) return "/";
  return input.replace(/\.html$/, "").replace(/\/+$/, "") || "/";
}

function swapPrefix(pathname, targetPrefix) {
  if (pathname === "/" || pathname === "/index") {
    return targetPrefix;
  }

  if (pathname.startsWith("/chapters")) {
    return pathname.replace(/^\/chapters/, targetPrefix);
  }

  if (pathname.startsWith("/original")) {
    return pathname.replace(/^\/original/, targetPrefix);
  }

  if (pathname.startsWith("/bilingual")) {
    return pathname.replace(/^\/bilingual/, targetPrefix);
  }

  return targetPrefix;
}

const currentPath = computed(() => normalizePath(route.path));

const targets = computed(() => {
  const current = currentPath.value;
  const faqMap = FAQ_ROUTE_MAP[current];

  if (faqMap) {
    return {
      chapters: faqMap.chapters || "/chapters/",
      original: faqMap.original || "/original/",
      bilingual: faqMap.bilingual || "/bilingual/"
    };
  }

  return {
    chapters: swapPrefix(current, "/chapters"),
    original: swapPrefix(current, "/original"),
    bilingual: swapPrefix(current, "/bilingual")
  };
});

const currentMode = computed(() => {
  const current = currentPath.value;

  if (current.startsWith("/original")) return "original";
  if (current.startsWith("/bilingual")) return "bilingual";
  if (current.startsWith("/chapters")) return "chapters";
  return "home";
});

const options = computed(() => [
  {
    key: "chapters",
    label: "中",
    title: "切换到中文版",
    href: withBase(targets.value.chapters)
  },
  {
    key: "original",
    label: "En",
    title: "Switch to English",
    href: withBase(targets.value.original)
  },
  {
    key: "bilingual",
    label: "双",
    title: "切换到双语版",
    href: withBase(targets.value.bilingual)
  }
]);
</script>

<template>
  <div :class="['reader-toggle', { mobile }]">
    <a
      v-for="option in options"
      :key="option.key"
      :href="option.href"
      :title="option.title"
      :class="['reader-toggle__item', { 'is-active': currentMode === option.key }]"
    >
      {{ option.label }}
    </a>
  </div>
</template>
