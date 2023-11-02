import { computed, defineComponent, inject, ref } from "vue";
import EditorBlocks from "@/packages/editorBlock/index.jsx";
import "./editor.scss";
import { useMenuDraggable } from "@/hooks/useMenuDraggable.js";
import deepcopy from "deepcopy";
import { useBlockFocus } from "@/hooks/useBlockFocus.js";
import { useBlocksDrag } from "@/hooks/useBlocksDrag.js";
import { useCommand } from "@/hooks/useCommand.js";
export default defineComponent({
  props: {
    modelValue: {
      type: Object
    }
  },
  emits: [ "update:modelValue" ],
  setup(props, ctx) {
    const contentRef = ref(null);
    const config = inject("config");
    const data = computed({
      get() {
        return props.modelValue;
      },
      set(newVal) {
        console.log(newVal);
        ctx.emit("update:modelValue", deepcopy(newVal));
      }
    });
    const containerStyles = computed(() => {
      return {
        width: data.value.container.width + "px",
        height: data.value.container.height + "px",
      };
    });
    // 左侧菜单栏拖拽
    const { dragstart, dragend } = useMenuDraggable(contentRef, data);
    // 点击block实现选择
    const { mousedownHandler, contentMousedownHandler, getFocusBlocks, lastBlock } = useBlockFocus(data, (e) => {
      mousedown(e, lastBlock.value, data);
    });
    // block 拖拽相关
    const { mousedown, lineInfo } = useBlocksDrag(contentRef, getFocusBlocks);
    // 顶部菜单栏相关操作
    const { state } = useCommand(data);
    return () => (
      <div class="editor">
        <div class="editor-left">
          {config.componentList.map((component) => {
            return (
              <div class="editor-left-item" draggable onDragstart={(e) => dragstart(e, component)} onDragend={() => dragend}>
                <span class="item-label">{component.label}</span>
                <div class="item-component">{component.preview()}</div>
              </div>
            );
          })}
        </div>
        <div class="editor-top">
          {data.value.menuList.map((menu) => {
            return (
              <div class="editor-top-item" onClick={state.commands[menu.name]}>
                <span class={menu.icon + "  iconfont item-icon"}></span>
                <div class="item-label">{menu.label}</div>
              </div>
            );
          })}
        </div>
        <div class="editor-right">右侧</div>
        <div class="editor-wrapper">
          {lineInfo.value.y !== null && <div class="line-y" style={{ top: lineInfo.value.y + "px" }}></div> }
          {lineInfo.value.x !== null && <div class="line-x" style={{ left: lineInfo.value.x + "px" }}></div> }
          <div class="editor-wrapper-content" style={containerStyles.value} ref={contentRef} onMousedown={contentMousedownHandler}>
            {data.value.blocks.map((block, index) => {
              return (
                <EditorBlocks
                  class={block.focus ? "editor-block-focus" : ""}
                  block={block}
                  key={index}
                  onUpdateBlock={($event) => data.value.blocks[$event.index] = $event.value}
                  index={index}
                  onMousedown={($event) => mousedownHandler($event, block, index)}
                ></EditorBlocks>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
});
