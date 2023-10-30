import { computed, ref } from "vue";

export function useBlockFocus(data, callback) {
  const selectIndex = ref(-1); // 选择block 的 索引
  // 选择的最后一个block
  const lastBlock = computed(() => {
    return data.value.blocks[selectIndex.value];
  });
  const getFocusBlocks = computed(() => {
    const onFocusBlocks = [];
    const unFocusBlocks = [];
    data.value.blocks.forEach(item => {
      (item.focus ? onFocusBlocks : unFocusBlocks).push(item);
    });
    return { onFocusBlocks, unFocusBlocks };
  });
  const clearBlocksFocus = () => {
    data.value.blocks.forEach((block) => {
      if (block.focus) {
        block.focus = false;
      }
    });
  };
  const mousedownHandler = (e, block, index) => {
    e.preventDefault();
    e.stopPropagation();
    selectIndex.value = index;
    if (!block.focus) {
      // 判断是否是shift键按下
      console.log(e.shiftKey);
      !e.shiftKey && clearBlocksFocus();
      block.focus = true;
    }
    callback(e);
  };
  const contentMousedownHandler = (e) => {
    clearBlocksFocus();
    selectIndex.value = -1;
  };
  return {
    getFocusBlocks,
    mousedownHandler,
    contentMousedownHandler,
    lastBlock
  };
}
