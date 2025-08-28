import { createRoot } from "react-dom/client";
import PluginDrawer from "./pluginDrawer";

export interface IConfigData {
  id: string;
  domain: string;
  config: string;
}

const initDrawer = () => {
  if (document.getElementById("inject-css-root")) return;
  const container = document.createElement("div");
  container.id = "inject-css-root";
  document.body.appendChild(container);
  createRoot(container).render(<PluginDrawer />);
};
const initArcoCss = (domain: string, currentConfigs: IConfigData[]) => {
  if (domain === "arco.design" || currentConfigs.length > 0) {
    const url = chrome.runtime.getURL("plugin.css");
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    document.head.appendChild(link);
  }
};
const mountDrawer = (domain: string, currentConfigs: IConfigData[]) => {
  if (document.body) {
    initDrawer();
    initArcoCss(domain, currentConfigs);
  } else {
    window.addEventListener("DOMContentLoaded", () => {
      initDrawer();
      initArcoCss(domain, currentConfigs);
    });
  }
};

// 读取配置并注入样式
chrome.storage.sync.get("injectCssData").then(({ injectCssData }) => {
  const currentDomain = window.location.hostname.replace(/^www\./, "");
  const currentConfigs = (injectCssData || []).filter(
    (item: IConfigData) => item.domain === currentDomain
  );
  if (currentConfigs.length > 0) {
    currentConfigs.forEach((config: IConfigData) => {
      const style = document.createElement("style");
      style.textContent = config.config;
      document.head.appendChild(style);
    });
  }
  mountDrawer(currentDomain, currentConfigs);
});
