<template>
  <div class="recommend">
    <Title>{{ title }}</Title>
    <div class="list-wrap">
      <PlaylistCard
        v-for="item in list"
        :desc="item.copywriter"
        :id="item.id"
        :img="item.picUrl"
        :key="item.id"
        :name="item.name"
        :playCount="item.playCount"
      />
    </div>
  </div>
</template>
<script>
import PlaylistCard from "@/components/playlist-card";
export default {
  components: {
    PlaylistCard,
  },
  data() {
    return {
      // loading: false,
    };
  },
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: "",
    },
  },
};
</script>
<style lang="scss" scoped>
.list-wrap {
  margin: 0 -4px;
  display: flex;
  flex-wrap: wrap;
}
</style>