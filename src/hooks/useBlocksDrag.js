export function useBlocksDrag(contentRef, getFocusBlocks) {
  // block 拖拽相关
  let dragState = {
    startX: 0,
    startY: 0
  };
  const lineInfo = {
    x: null,
    y: null
  };
  const mousemove = (e) => {
    const { clientX: moveX, clientY: moveY } = e;
    const { unFocusBlocks } = getFocusBlocks.value;
    unFocusBlocks.forEach(block => {
      const { top, left } = block;
      for (let i = 0; i < dragState.lines.y.length; i++) {
        const linesY = dragState.lines.y[i];
        if (Math.abs(moveY - dragState.startY + dragState.startTop - linesY.top) < 5) {
          lineInfo.y = linesY.showTop;
          break;
        }
      }
    });
    // 获取移动的距离
    const dragX = moveX - dragState.startX;
    const dragY = moveY - dragState.startY;
    getFocusBlocks.value.onFocusBlocks.forEach((block,index) => {
      block.top = dragState.startPos[index].top + dragY;
      block.left = dragState.startPos[index].left + dragX;
    });
  };
  const mousedown = (e, lastBlock) => {
    const { width: bWidth, height: bHeight } = lastBlock;
    dragState = {
      startX: e.clientX,
      startY: e.clientY,
      startTop: lastBlock.top,
      startLeft: lastBlock.left,
      startPos: getFocusBlocks.value.onFocusBlocks.map(({ top, left }) => ({ top, left })),
      lines: (() => {
        const lines = { x: [], y: [] };
        const { onFocusBlocks } = getFocusBlocks.value;
        onFocusBlocks.forEach(block => {
          const { width: aWidth, height: aHeight, left: aLeft, top: aTop } = block;
          lines.y.push({ showTop: aTop, top: aTop });
          lines.y.push({ showTop: aTop, top: aTop - bHeight });
          lines.y.push({ showTop: aTop + aHeight / 2, top: aTop + aHeight / 2 - bHeight/2 });
          lines.y.push({ showTop: aTop + aHeight, top: aTop + aHeight });
          lines.y.push({ showTop: aTop + aHeight, top: aTop + aHeight -bHeight });
          lines.x.push({ showLeft: aLeft, left: aLeft });
          lines.x.push({ showLeft: aLeft + aWidth, left: aLeft + aWidth });
          lines.x.push({ showLeft: aLeft + aWidth / 2, left: aLeft + aWidth/2 - bWidth /2 });
          lines.x.push({ showLeft: aLeft + aWidth, left: aLeft + aWidth - bWidth });
          lines.x.push({ showLeft: aLeft, left: aLeft -bWidth });
        });
        return lines;
      })()
    };
    contentRef.value.addEventListener("mousemove", mousemove);
    contentRef.value.addEventListener("mouseup", mouseup);
  };
  const mouseup = (e) => {
    contentRef.value.removeEventListener("mousemove", mousemove);
    contentRef.value.removeEventListener("mouseup", mouseup);
  };
  return {
    mousedown
  };
}