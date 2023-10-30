import { computed, defineComponent, inject, onMounted, ref } from "vue";
import "./editorBlock.scss";
export default defineComponent({
  props: {
    block: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  emits: [ "updateBlock" ],
  setup(props, ctx) {
    const blockRef = ref(null);
    const config = inject("config");
    const blockStyle = computed(() => {
      return {
        top: `${props.block.top}px`,
        left: `${props.block.left}px`,
        zIndex: `${props.block.zIndex}`
      };
    });
    onMounted(() => {
      const currentBlock = { ...props.block };
      const el = blockRef.value;
      const { offsetWidth, offsetHeight } = el;
      if (currentBlock.alignCenter) {
        currentBlock.left = props.block.left - offsetWidth / 2;
        currentBlock.top = props.block.top - offsetHeight / 2;
        currentBlock.alignCenter = false;
      }
      currentBlock.width = offsetWidth;
      currentBlock.height = offsetHeight;
      ctx.emit("updateBlock", { index: props.index, value: currentBlock });
    });
    return () => {
      const component = config.componentMap[props.block.key];
      const RenderComponent = component.render();
      return (
        <div class="editor-block" style={blockStyle.value} ref={blockRef}>
          {RenderComponent}
        </div>
      );
    };
  }
});
