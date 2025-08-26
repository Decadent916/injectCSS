function renderEntries(domainCSSMap) {
  const entriesDiv = document.getElementById('entries');
  entriesDiv.innerHTML = '';
  Object.entries(domainCSSMap).forEach(([domain, css], idx) => {
    const entryDiv = document.createElement('div');
    entryDiv.className = 'entry';
    entryDiv.innerHTML = `
      <label>域名: <input type="text" value="${domain}" data-idx="${idx}" class="domain-input"></label>
      <br>
      <label>CSS样式:<br>
        <textarea data-idx="${idx}" class="css-input">${css}</textarea>
      </label>
      <button class="del-btn" data-idx="${idx}">删除</button>
    `;
    entriesDiv.appendChild(entryDiv);
  });
}

function loadConfig() {
  chrome.storage.sync.get("domainCSSMap", ({ domainCSSMap }) => {
    renderEntries(domainCSSMap || {});
  });
}

function saveConfig() {
  const domainInputs = document.querySelectorAll('.domain-input');
  const cssInputs = document.querySelectorAll('.css-input');
  const map = {};
  domainInputs.forEach((input, i) => {
    const domain = input.value.trim();
    const css = cssInputs[i].value;
    if (domain) map[domain] = css;
  });
  chrome.storage.sync.set({ domainCSSMap: map }, () => {
    alert('配置已保存！');
    loadConfig();
  });
}

function addEntry() {
  chrome.storage.sync.get("domainCSSMap", ({ domainCSSMap }) => {
    const map = domainCSSMap || {};
    map[""] = "";
    chrome.storage.sync.set({ domainCSSMap: map }, loadConfig);
  });
}

function deleteEntry(idx) {
  chrome.storage.sync.get("domainCSSMap", ({ domainCSSMap }) => {
    const entries = Object.entries(domainCSSMap || {});
    entries.splice(idx, 1);
    const newMap = Object.fromEntries(entries);
    chrome.storage.sync.set({ domainCSSMap: newMap }, loadConfig);
  });
}

document.getElementById('add-btn').onclick = addEntry;
document.getElementById('save-btn').onclick = saveConfig;
document.getElementById('entries').onclick = function(e) {
  if (e.target.classList.contains('del-btn')) {
    deleteEntry(Number(e.target.getAttribute('data-idx')));
  }
};
window.onload = loadConfig;