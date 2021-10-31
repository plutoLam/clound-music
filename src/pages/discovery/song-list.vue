<template>
  <div
    class="song-list"
    v-infinite-scroll="loadComment"
    infinite-scroll-immediate="false"
    infinite-scroll-distance="2"
    infinite-scroll-delay="300"
    v-if="list && list.length"
  >
    <div class="header">
      <NButton class="button" :round="true">
        {{ tabs[activeTab] }}
        <Icon type="youjiantou" />
      </NButton>
      <Tabs
        :tabs="tabs"
        itemClass="tab-item"
        activeItemClass="tab-item-active"
        v-model="activeTab"
      />
    </div>
    <NewPlaylists :list="list" />
  </div>
</template>

<script>
import { getHighqualityTags, getHotCategory, getHqualityPlaylist } from "@/api";
import NewPlaylists from "./new-playlists.vue";
export default {
  name: "SongList",
  components: {
    NewPlaylists,
  },
  data() {
    return {
      tabs: [],
      activeTab: 0,
      list: [],
      lasttime: "",
      isMore: true,
    };
  },
  created() {},
  computed: {},
  methods: {
    loadComment() {
      this.getHqualityPlaylistData(this.tabs[this.activeTab]);
    },
    getHqualityPlaylistData(cat) {
      if (this.isMore) {
        getHqualityPlaylist(cat, this.lasttime).then((res) => {
          console.log(res);
          const list = res.playlists.map(
            ({ copywriter, id, coverImgUrl, name, playCount }) => {
              return {
                copywriter,
                id,
                picUrl: coverImgUrl,
                name,
                playCount,
              };
            }
          );
          if (this.lasttime) {
            this.list.push(...list);
          } else {
            this.list = list;
          }
          this.lasttime = res.lasttime;
          this.isMore = res.more;
          // console.log(this.list);
        });
      }
    },
  },
  watch: {
    activeTab: {
      handler(activeValue) {
        this.lasttime = "";
        this.isMore = true;
        if (!this.tabs.length) {
          getHotCategory().then((res) => {
            console.log(res);
            this.tabs = res.tags.map((item) => item.name);
            this.getHqualityPlaylistData(this.tabs[activeValue]);
          });
        } else {
          console.log(this.tabs[activeValue]);
          this.getHqualityPlaylistData(this.tabs[activeValue]);
        }
      },
      immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.song-list {
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .button {
      padding-left: 20px;
      padding-right: 20px;
    }

    /deep/.tab-item {
      font-size: $font-size-sm;
      padding: 3px 13px;
      margin: 0;
    }

    /deep/.tab-item-active {
      color: #ec688a;
      background-color: #fdf5f5;
      border-radius: 100px;
      padding: 3px 13px;

      &:hover {
        color: #ec688a;
      }
    }
  }
}
</style>