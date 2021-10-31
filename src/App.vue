<template>
  <div id="app">
    <Layout />
    <Player />
    <MiniPlayer />
    <Playlist />
  </div>
</template>
<script>
// const requireComponent = require.context(
//   "@/base",
//   true, //遍历文件子目录
//   /[a-z0-9]+\.(jsx?|vue)$/i
// );

// // 批量注册base组件
// requireComponent.keys().forEach((fileName) => {
//   const componentConfig = requireComponent(fileName);
//   const componentName = componentConfig.default.name;
//   if (componentName) {
//     console.log(componentName);
//     Vue.component(componentName, componentConfig.default || componentConfig);
//   }
// });
import Layout from "@/layout";
import MiniPlayer from "@/components/mini-player";
import Playlist from "@/components/playlist";
import variables from "@/style/themes/variables";
import Player from "@/components/player";
const theme = variables; //选择主题文件
// console.log("theme", document);
Object.keys(theme).forEach((key) => {
  const value = theme[key];
  document.documentElement.style.setProperty(key, value);
});
export default {
  components: {
    Layout,
    Player,
    MiniPlayer,
    Playlist,
  },
};
</script>
<style lang="scss">
#app {
  height: 100%;
  background-color: var(--body-bgcolor);
  font-size: $font-size;
}
</style>
