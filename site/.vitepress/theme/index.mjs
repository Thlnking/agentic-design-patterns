import DefaultTheme from "vitepress/theme";
import { h } from "vue";
import ReaderModeToggle from "./components/ReaderModeToggle.vue";
import PagefindSearch from "./components/PagefindSearch.vue";
import "./custom.css";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component("PagefindSearch", PagefindSearch);
  },
  Layout() {
    return h(DefaultTheme.Layout, null, {
      "nav-bar-content-after": () => h(ReaderModeToggle),
      "nav-screen-content-after": () => h(ReaderModeToggle, { mobile: true })
    });
  }
};
