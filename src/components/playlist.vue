<template>
  <Toggle
    class="playlist"
    v-show="isPlaylistShow"
    ref="playlist"
    :show="isPlaylistShow"
    @update:show="setPlaylistShow(false)"
    :includedDom="includedDom"
  >
    <div class="header">
      <h1>当前播放</h1>
      <div class="container">
        <span class="total">总504首</span>
        <div class="btn">
          <div class="collect">
            <Icon type="ziyuan" :size="14" />
            收藏全部
          </div>
          <a href="#">清空列表</a>
        </div>
      </div>
    </div>
    <div class="song-table-wrap" v-if="playlist.length">
      <SongTable
        :songs="playlist"
        :hideColumns="['index', 'love', 'albumName']"
      />
    </div>
    <div class="empty" v-else>你还没有添加任何歌曲！</div>
  </Toggle>
</template>

<script>
import { mapState, mapMutations, mapActions } from "@/store/helper/music";
import SongTable from "./song-table";
export default {
  components: {
    SongTable,
  },
  data() {
    return {
      includedDom: null,
    };
  },

  mounted() {
    this.includedDom = [document.getElementById("mini-player")];
    // document.addEventListener("click", (e) => {
    //   // console.log(this.miniPlayerRef.contains(e.target));
    //   // console.log("ref", this.$root);
    //   if (
    //     !this.$refs.playlist.contains(e.target) &&
    //     !this.miniPlayerRef.contains(e.target) &&
    //     this.isPlaylistShow
    //   ) {
    //     this.setPlaylistShow(!this.isPlaylistShow);
    //   }
    // });
  },

  methods: {
    ...mapMutations(["setPlaylistShow"]),
  },
  computed: {
    ...mapState(["isPlaylistShow", "playlist", "miniPlayerRef"]),
  },
};
</script>

<style lang="scss" scoped>
@import "~@/style/element-overwrite.scss";

.playlist {
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  top: $header-height;
  bottom: $mini-player-height;
  background: var(--playlist-bgcolor);
  z-index: $player-z-idnex;
  @include box-shadow;
  @include el-table-theme(var(--playlist-bgcolor));

  .header {
    margin: 20px;
    height: 8%;
    .container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 15px;
      .total {
        font-size: $font-size-sm;
      }
      .btn {
        display: flex;
        align-items: center;

        .collect {
          margin-right: 10px;
          cursor: pointer;
        }
        a {
          color: $blue;
          text-decoration: none;
        }
      }
    }
  }

  .song-table-wrap {
    overflow-y: auto;
    height: 92%;
  }
  .empty {
    @include abs-center;
    // flex: 1;
    color: gray;
  }
}
</style>