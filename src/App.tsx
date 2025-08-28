import { useEffect, useState } from "react";
import { Button, Message } from "@arco-design/web-react";
import { IconBrush, IconEdit, IconDelete } from "@arco-design/web-react/icon";
import type { IConfigData } from "@/types/configData";
import { getConfigList, deleteConfig } from "@/utils";
import styles from "./app.module.scss";

const App = () => {
  const [configList, setConfigList] = useState<IConfigData[]>([]);

  const initData = () => {
    getConfigList().then((list) => {
      setConfigList(list);
    });
  };
  const openPluginDrawer = (editConfig: IConfigData | null) => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      chrome.tabs.sendMessage(tab.id!, {
        action: "showPluginDrawer",
        editConfig,
      });
    });
  };

  useEffect(() => {
    initData();
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.action === "initInjectConfig") {
        initData();
      }
    });
  }, []);

  return (
    <div className={styles["index-page"]}>
      <h1>土拨鼠装修</h1>
      <div className="tip">
        一款网页样式装修器(为避免影响页面样式，请在'https://arco.design/'或已经装修过的页面进行配置)
      </div>
      {configList.length === 0 ? (
        <div className="empty">
          <p>还没有任何装修配置，快去新建吧！</p>
        </div>
      ) : (
        <div className="list">
          {configList.map((item, index) => (
            <div
              key={`${item.id}-${item.domain}-${index}`}
              className="list-item"
            >
              <span className="domain">{item.domain}</span>
              <div className="operation-con">
                <Button
                  type="text"
                  size="mini"
                  icon={<IconEdit />}
                  onClick={() => openPluginDrawer(item)}
                ></Button>
                <Button
                  type="text"
                  size="mini"
                  icon={<IconDelete />}
                  status="danger"
                  onClick={() => {
                    deleteConfig(item.id as string)
                      .then(() => {
                        initData();
                      })
                      .catch(() => {
                        Message.error("删除失败，请稍后重试");
                      });
                  }}
                ></Button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Button
        className="create-btn"
        type="primary"
        icon={<IconBrush />}
        size="large"
        long
        onClick={() => openPluginDrawer(null)}
      >
        新建装修配置
      </Button>
    </div>
  );
};

export default App;
