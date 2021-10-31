<template>
  <div class="discovery">
    <Tabs class="tabs" :tabs="tabs" type="theme" />
    <router-view></router-view>

    <!-- <div class="exclusive" v-if="activeTab === 1">exclusive</div>
    <div class="songList" v-if="activeTab === 2">songList</div>
    <div class="leaderboard" v-if="activeTab === 3">leaderboard</div>
    <div class="singer" v-if="activeTab === 4">singer</div>
    <div class="new" v-if="activeTab === 5">new</div> -->
  </div>
</template>
<script>
import PersonalRecommendation from "./personalRecommendation.vue";
const tabs = [
  {
    title: "个性推荐",
    key: "personalRecommendation",
    to: "personalRecommendation",
  },
  {
    title: "专属定制",
    key: "exclusive",
    to: "exclusive",
  },
  {
    title: "歌单",
    key: "songlist",
    to: "songlist",
  },
];
export default {
  components: {
    PersonalRecommendation,
    tabs,
  },
  data() {
    return {
      // tabsIndex:{
      //   personalRecommendation:0,
      //   exclusive:1,
      //   songList:2,
      //   leaderboard:3,
      //   singer:4,
      //   new:5
      // },
      // tabs: ["个性推荐", "专属定制", "歌单", "排行榜", "歌手", "最新音乐"],
      activeTab: 0,
    };
  },
  created() {
    this.tabs = tabs;
  },
};
</script>
<style lang="scss" scoped>
.discovery {
  padding: 18px 32px;

  .tabs {
    margin-left: -12px;
    margin-bottom: 20px;
  }
}
</style>