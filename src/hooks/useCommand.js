import mitt from "mitt";
import deepcopy from "deepcopy";

export function useCommand(data) {
  const state = {
    current: -1, // 前进后退的索引值
    queue: [], // 存放所有的操作命令
    commands: {}, // 执行功能映射表
    commandArray: [] // 存放所有命令
  };
  const registry = (command) => {
    state.commandArray.push(command);
    state.commands[command.name] = () => {
      const { nextDo, preDo } = command.execute();
      nextDo && nextDo();
      preDo && preDo();
    };
  };
  registry({
    name: "nextDo",
    keyboard: "ctrl+y",
    execute() {
      return {
        nextDo() {
          console.log("重做");
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
          console.log("撤销");
        }
      };
    }
  });
  registry({
    name: "drag",
    pushQueue: true,
    init() {
      // 初始化
      const beforeData = data.value.blocks;
      let afterData = [];
      const start = () => {
        data.value = {
          ...data.value,
          blocks: beforeData
        };
      };
      const end = () => {
        afterData = deepcopy(data.value.blocks);
      };
      mitt().on("@start", start);
      mitt().on("@end", end);
    },
    execute() {
      return {
        nextDo() {
          console.log("拖拽");
        },
        preDo(){
          console.log("取消拖拽");
        }
      };
    }
  });

  (() => {
    state.commandArray.forEach(item => {
      item.init && item.init();
    });
  })();
  return {
    state
  };
}
