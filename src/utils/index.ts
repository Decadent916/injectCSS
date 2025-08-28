import type { IConfigData } from "@/types/configData";

export const getConfigList = () => {
  return new Promise<IConfigData[]>((resolve, reject) => {
    chrome.storage.sync
      .get("injectCssData")
      .then(({ injectCssData }) => {
        resolve(injectCssData || []);
      })
      .catch(() => {
        reject();
      });
  });
};

export const setConfigList = (list: IConfigData[]) => {
  return new Promise<void>((resolve, reject) => {
    chrome.storage.sync
      .set({ injectCssData: list })
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject();
      });
  });
};

export const deleteConfig = (id: string) => {
  return getConfigList().then((list) => {
    const newList = list.filter((item) => item.id !== id);
    return setConfigList(newList);
  });
};
