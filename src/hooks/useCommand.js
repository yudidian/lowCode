import deepcopy from "deepcopy";
import { inject, onUnmounted, } from "vue";
import { ElMessage } from "element-plus";

export function useCommand(data) {
  const events = inject("$events");
  const state = {
    current: -1, // 前进后退的索引值
    queue: [], // 存放所有的操作命令
    commands: {}, // 执行功能映射表
    commandArray: [], // 存放所有命令
    destroyArray: [] // 存放所有销毁函数
  };
  const registry = (command) => {
    state.commandArray.push(command);
    state.commands[command.name] = () => {
      const { nextDo, preDo } = command.execute();
      nextDo && nextDo();
      if (!command.pushQueue) return;
      if (state.queue.length > 0) {
        state.queue = state.queue.slice(0, state.current + 1);
      }
      state.queue.push({ nextDo, preDo });
      state.current++;
    };
  };
  registry({
    name: "nextDo",
    keyboard: "ctrl+y",
    execute() {
      return {
        nextDo() {
          state.current++;
          if (!state.queue[state.current]){
            return ElMessage.error("没有下一步了");
          }
          const { nextDo } = state.queue[state.current];
          nextDo && nextDo();
        }
      };
    }
  });
  registry({
    name: "preDo",
    keyboard: "ctrl+z",
    execute() {
      return {
        nextDo() {
          if (!state.queue[state.current]){
            return ElMessage.error("没有上一步了");
          }
          const { preDo } = state.queue[state.current];
          preDo && preDo();
          state.current--;
        }
      };
    }
  });
  registry({
    name: "drag",
    pushQueue: true,
    beforeData: null,
    init() {
      // 初始化
      this.beforeData = null;
      // 拖拽开始保存状态
      const start = () => {
        this.beforeData = deepcopy(data.value.blocks);
      };
      // 拖拽结束触发指令
      const end = () => {
        state.commands.drag && state.commands.drag();
      };
      events.on("@start", start);
      events.on("@end", end);
      return () => {
        events.off("@start", start);
        events.off("@end", end);
      };
    },
    execute() {
      const beforeData = this.beforeData;
      const afterData = deepcopy(data.value.blocks);
      return {
        nextDo() {
          data.value = { ...data.value, blocks: afterData };
        },
        preDo(){
          data.value = { ...data.value, blocks: beforeData };
        }
      };
    }
  });

  const keyDownHandler = (e) => {
    e.preventDefault();
    let keyStr = "";
    if (e.ctrlKey && e.code === "KeyZ") {
      keyStr = "ctrl+z";
    }
    if (e.ctrlKey && e.code === "KeyY") {
      keyStr = "ctrl+y";
    }
    if (keyStr === "") return;
    const command = state.commandArray.find((command) => command.keyboard === keyStr);
    if (!command) return;
    const { nextDo } = command.execute();
    nextDo && nextDo();
  };
  document.addEventListener("keydown", keyDownHandler);
  (() => {
    state.destroyArray.push(() => {
      document.addEventListener("keydown", keyDownHandler);
    });
    state.commandArray.forEach(item => {
      item.init && state.destroyArray.push(item.init());
    });
  })();
  onUnmounted(() => {
    state.current = -1;
    state.destroyArray.forEach(item => {
      item && item();
    });
  });
  return {
    state
  };
}
