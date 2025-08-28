import { useEffect, useState } from "react";
import { Drawer, Form, Input } from "@arco-design/web-react";
import "@arco-design/web-react/dist/css/arco.css";
import type { IConfigData } from "./plugin";

const PluginDrawer = () => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [editConfig, setEditConfig] = useState<null | IConfigData>(null);
  const [loading, setLoading] = useState(false);

  const closeHandler = () => {
    setVisible(false);
    form.resetFields();
  };
  const okHandler = () => {
    form.submit();
  };
  const submitHandler = (values: IConfigData) => {
    setLoading(true);
    chrome.storage.sync
      .get("injectCssData")
      .then(({ injectCssData }) => {
        const newList = [...(injectCssData || [])];
        if (editConfig) {
          const editData = { ...values, id: editConfig.id };
          const index = newList.findIndex((item) => item.id === editConfig.id);
          if (index > -1) {
            newList[index] = editData;
          } else {
            newList.push(editData);
          }
        } else {
          const createData = { ...values, id: Date.now().toString() };
          newList.push(createData);
        }
        return chrome.storage.sync.set({ injectCssData: newList });
      })
      .then(() => {
        alert("保存成功");
        closeHandler();
        chrome.runtime.sendMessage({ action: "initInjectConfig" });
      })
      .catch(() => {
        alert("保存失败，请稍后重试");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.action === "showPluginDrawer") {
        setVisible(true);
        setEditConfig(msg.editConfig || null);
        if (msg.editConfig) {
          form.setFieldsValue({ ...msg.editConfig });
        }
      }
    });
    return () => {
      chrome.runtime.onMessage.removeListener(() => {});
    };
  }, []);

  return (
    <Drawer
      title="装修配置"
      visible={visible}
      width={480}
      okText="保存"
      confirmLoading={loading}
      onCancel={closeHandler}
      onOk={okHandler}
    >
      <Form form={form} colon onSubmit={submitHandler}>
        <Form.Item
          label="域名"
          field="domain"
          rules={[{ required: true, message: "域名不能为空" }]}
        >
          <Input allowClear placeholder="请输入要装修的网站域名" />
        </Form.Item>
        <Form.Item
          label="配置"
          field="config"
          rules={[{ required: true, message: "配置不能为空" }]}
        >
          <Input.TextArea
            allowClear
            autoSize={{ minRows: 10, maxRows: 20 }}
            placeholder="请输入装修样式代码"
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default PluginDrawer;
