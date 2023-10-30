// 处理左侧菜单拖拽
export function useMenuDraggable(contentRef, data) {
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
    currentComponent = component;
    const el = contentRef.value;
    el.addEventListener("dragenter", dragenterHandler);
    el.addEventListener("dragover", dragoverHandler);
    el.addEventListener("dragleave", dragleaveHandler);
    el.addEventListener("drop", dropHandler);
  };
  const dragend = () => {
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