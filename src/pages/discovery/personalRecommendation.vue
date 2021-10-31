<template>
  <div>
    <Banner />
    <NewPlaylists :list="list" title="推荐歌单" />
  </div>
</template>

<script>
import Banner from "./banner.vue";
import NewPlaylists from "./new-playlists.vue";
import { getPersonalized } from "@/api";
export default {
  name: "PersonalRecommendation",
  components: {
    Banner,
    NewPlaylists,
  },
  data() {
    return {
      list: [],
    };
  },
  async created() {
    const { result } = await getPersonalized({ limit: 10 });
    this.list = result;
  },
  mounted() {},

  methods: {},
};
</script>

<style lang="scss" scoped>
</style>