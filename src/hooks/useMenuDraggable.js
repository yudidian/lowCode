// 处理左侧菜单拖拽
import { inject } from "vue";
export function useMenuDraggable(contentRef, data) {
  const events = inject("$events");
  let currentComponent = null;
  const dragenterHandler = (e)=> {
    // 进入容器
    e.dataTransfer.dropEffect = "move";
  };
  const dragleaveHandler = (e)=> {
    // 离开容器
    e.dataTransfer.dropEffect = "none";
  };
  const dragoverHandler = (e)=> {
    // 经过容器
    e.preventDefault();  //需要阻止默认行为否则不能触发drop
  };
  const dropHandler = (e)=> {
    // 容器内释放
    data.value = {
      ...data.value,
      blocks: [ ...data.value.blocks, {
        top: e.offsetY,
        left: e.offsetX,
        zIndex: 1,
        alignCenter: true,
        key: currentComponent.key
      } ]
    };
    currentComponent = null;
  };
  const dragstart = (e, component) => {
    // 拖拽开始绑定start事件
    events.emit("@start");
    currentComponent = component;
    const el = contentRef.value;
    el.addEventListener("dragenter", dragenterHandler);
    el.addEventListener("dragover", dragoverHandler);
    el.addEventListener("dragleave", dragleaveHandler);
    el.addEventListener("drop", dropHandler);
  };
  const dragend = () => {
    console.log("拖拽结束绑定end事件");
    // 拖拽结束绑定end事件
    events.emit("@end");
    const el = contentRef.value;
    el.removeEventListener("dragenter", dragenterHandler);
    el.removeEventListener("dragover", dragoverHandler);
    el.removeEventListener("dragleave", dragleaveHandler);
    el.removeEventListener("drop", dropHandler);
  };
  return {
    dragstart,
    dragend
  };
}
