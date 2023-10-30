// 列表区展示所有物料
// key 对应组件映射关系
import { ElButton, ElInput } from "element-plus";

function createEditorConfig() {
  const componentList = [];
  const componentMap = {};
  return {
    componentList,
    componentMap,
    register:(component) => {
      componentList.push(component);
      componentMap[component.key] = component;
    }
  };
}
const registerConfig = createEditorConfig();

registerConfig.register({
  label: "文本",
  key: "text",
  preview: () => "预览文本",
  render: () => "渲染文本"
});

registerConfig.register({
  label: "按钮",
  key: "button",
  preview: () => <ElButton>预览按钮</ElButton>,
  render: () => <ElButton>渲染按钮</ElButton>
});

registerConfig.register({
  label: "输入框",
  key: "input",
  preview: () => <ElInput></ElInput>,
  render: () => <ElInput></ElInput>
});

export default registerConfig;
