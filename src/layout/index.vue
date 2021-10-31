<template lang="">
  <div class="layout">
    <LayoutHeader />
    <div class="layout-body">
      <div class="layout-menu">
        <LayoutMenu />
      </div>

      <div
        class="content"
        id="page-content"
        @click="togglePlaylistShow()"
      >
        <router-view :class="routerViewCls"/>
      </div>
    </div>
  </div>
</template>
<script>
import LayoutHeader from "./header";
import LayoutMenu from "./menu";
import { layoutCenterNames } from "@/router";
import { mapState, mapMutations } from "@/store/helper/music";
export default {
  components: {
    LayoutHeader,
    LayoutMenu,
  },
  methods: {
    ...mapMutations(["setPlaylistShow"]),
    togglePlaylistShow() {
      // console.log("点击content");
      // this.setPlaylistShow(false);
    },
  },
  created() {
    console.log(layoutCenterNames, this.$route.name);
  },
  computed: {
    routerViewCls() {
      return layoutCenterNames.find((name) => name === this.$route.name)
        ? "router-view-center"
        : "";
    },
    ...mapState(["isPlaylistShow"]),
  },
};
</script>
<style lang="scss" scoped>
.layout {
  height: 100%;

  .layout-body {
    display: flex;
    height: calc(100% - #{$header-height});

    .layout-menu {
      height: calc(100% - #{$mini-player-height});
    }

    .content {
      flex: 1;
      overflow-y: auto;
      min-width: $layout-content-min-width;
      margin-bottom: $mini-player-height;

      .router-view-center {
        max-width: $center-content-max-width;
        margin: auto;
      }
    }
  }
}
</style>