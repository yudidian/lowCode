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
import mitt from "mitt";
const state = ref(data);
const events = new mitt();
provide("config", registerConfig);
provide("$events", events);
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
