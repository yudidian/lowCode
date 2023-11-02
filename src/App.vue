<template>
  <div class="app">
    <Editor v-model="state" />
  </div>
</template>

<script setup>
import { provide, ref } from "vue";
import data from "./data.json";
import Editor from "@/packages/editor/index.jsx";
import registerConfig from "@/utils/editorConfig.jsx";
const state = ref(data);
provide("config", registerConfig);
</script>

<style lang="scss">
@import "@/assets/icon/iconfont.css";
.app {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
