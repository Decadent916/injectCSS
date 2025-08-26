// 读取配置并注入样式
chrome.storage.sync.get("domainCSSMap", ({ domainCSSMap }) => {
  if (!domainCSSMap) return;
  const currentDomain = window.location.hostname.replace(/^www\./, "");
  if (domainCSSMap[currentDomain]) {
    const style = document.createElement("style");
    style.textContent = domainCSSMap[currentDomain];
    document.head.appendChild(style);
  }
});