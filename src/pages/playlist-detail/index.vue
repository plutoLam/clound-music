<template>
  <div class="playlist-detail">
    <DetailHeader ref="header" :playlist="playlist" :songs="songs" />
    <div class="tabs-wrap">
      <Tabs :tabs="tabs" type="theme" v-model="activeTab" />
      <el-input
        class="input"
        placeholder="搜索歌单音乐"
        suffix-icon="el-icon-search"
        v-model="searchValue"
        v-show="activeTab === SONG_IDX"
      ></el-input>
    </div>
    <SongTable
      :highlightText="searchValue"
      :songs="songs"
      class="table"
      v-if="activeTab === SONG_IDX"
    />
    <PlayListComment
      :id="id"
      class="comment"
      v-if="activeTab === COMMENT_IDX"
    />
  </div>
</template>
<script>
import DetailHeader from "./header";
import SongTable from "@/components/song-table";
import PlayListComment from "@/components/playlist-comment";
import { createSong } from "@/utils";
import { getListDetail } from "@/api";
import { getSongDetail } from "@/api";

const MAX = 500;
const SONG_IDX = 0;
const COMMENT_IDX = 1;

export default {
  components: {
    DetailHeader,
    SongTable,
    PlayListComment,
  },
  data() {
    return {
      playlist: {},
      songs: [],
      activeTab: SONG_IDX,
      searchValue: "",
      inputFocus: false,
      tabs: ["歌曲列表", "评论"],
    };
  },
  created() {
    this.SONG_IDX = SONG_IDX;
    this.COMMENT_IDX = COMMENT_IDX;
  },
  methods: {
    activeChange(index) {
      this.activeTab = index;
      console.log(this.activeTab);
    },
    async init() {
      const { playlist } = await getListDetail({ id: this.id });
      this.playlist = playlist;
      this.genSonglist(playlist);
    },
    async genSonglist(playlist) {
      const trackIds = playlist.trackIds.map(({ id }) => id);
      const songDetails = await getSongDetail(trackIds.slice(0, MAX));
      // console.log("songDetails", songDetails);
      const songs = songDetails.songs.map(({ id, name, al, ar, mv, dt }) =>
        createSong({
          id,
          name,
          artists: ar,
          duration: dt,
          mvId: mv,
          albumName: al.name,
          img: al.picUrl,
          playListName: playlist.name,
        })
      );
      this.songs = songs;
    },
  },
  computed: {
    id() {
      return Number(this.$route.params.id);
    },
  },
  watch: {
    id: {
      handler() {
        this.init();
        const { header } = this.$refs;
        if (header) {
          this.$refs.header.$el.scrollIntoView();
        }

        // window.scrollTo(0, 0);  //实现不了
      },
      immediate: true,
    },
  },
};
</script>
<style lang="scss" scoped>
.playlist-detail {
  width: 100%;
  position: relative;

  .tabs-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 24px;
    // border-bottom: 1px solid var(--border);

    .input {
      width: 195px;
      // height: 50px;
      /deep/.el-input__inner {
        border-radius: 130px;
        // background: transparent !important;
      }
    }
  }

  .comment {
    width: 85%;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    margin: 25px 0;
  }
}
</style>