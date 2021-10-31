<template>
  <div class="header" v-if="playlist.id">
    <div class="img-wrap">
      <img :src="$utils.genImgUrl(playlist.coverImgUrl, 400)" />
    </div>
    <div class="content">
      <div class="title-wrap">
        <span class="song-sheet">歌单</span>
        <h3 class="title">{{ playlist.name }}</h3>
      </div>

      <div class="creator-wrap">
        <img src="https://picsum.photos/40/40" class="avatar" />
        <p class="creator">{{ playlist.creator.nickname }}</p>
        <p class="create-time">
          {{ $utils.formatDate(playlist.createTime, "yyyy-MM-dd") }} 创建
        </p>
      </div>
      <div class="action-wrap">
        <NButton class="button red">
          <span @click="playAll">
            <Icon class="icon middle" color="white" type="play" />
            <span class="middle">播放全部</span>
          </span>
          <Icon class="middle plus" type="plus" @click="plus" />
        </NButton>
        <NButton @click="playAll" class="button">
          <Icon class="icon middle" color="gray" type="ziyuan" />
          <span class="middle">收藏</span>
        </NButton>
        <NButton @click="playAll" class="button">
          <Icon class="icon middle" color="gray" type="fenxiang" />
          <span class="middle">分享</span>
        </NButton>
        <NButton @click="playAll" class="button">
          <Icon class="icon middle" color="gray" type="iconset0425" />
          <span class="middle">下载全部</span>
        </NButton>
      </div>
      <div class="desc-wrap">
        <p class="desc">
          <span>标签：{{ tagsText }}</span>
        </p>
        <div class="data desc">
          <span>歌曲:{{ playlist.trackCount }} </span>
          <span> 播放:{{ playlist.playCount }}</span>
        </div>
        <p class="desc">
          <span class="value">简介：{{ playlist.description }}</span>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapMutations } from "@/store/helper/music";

export default {
  props: {
    playlist: {
      type: Object,
      default: () => ({}),
    },
    songs: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    playAll() {
      this.startSong(this.songs[0]);
      this.setPlaylist(this.songs);
    },
    plus() {
      console.log("plus");
    },
    ...mapMutations(["setPlaylist"]),
    ...mapActions(["startSong"]),
  },
  computed: {
    tagsText() {
      return this.playlist.tags.join("/");
    },
  },
};
</script>
<style lang="scss" scoped>
.header {
  display: flex;
  padding: 36px;

  .img-wrap {
    width: 200px;
    height: 200px;
    margin-right: 24px;

    img {
      width: 100%;
      height: 100%;
      border-radius: 5px;
    }
  }

  .content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;

    .title-wrap {
      display: flex;
      align-items: center;
      margin-bottom: 12px;

      .song-sheet {
        font-size: $font-size-sm;
        color: red;
        border: red 1px solid;
        margin-right: 4px;
        border-radius: 3px;
        padding: 2px;
      }

      .title {
        font-size: 25px;
        color: var(--font-color-white);
      }
    }

    .action-wrap {
      margin-bottom: 18px;
      margin-left: -10px;

      .red {
        // background: #f95043;
        background: linear-gradient(to left, #fa5143, #f44d41, #ec4141);
        color: #fbdfdd;
        border: none;
        position: relative;
        padding-right: 10px;
        &:hover {
          background: linear-gradient(to left, #d73535, #cc3232, #cc3232);
        }
        span::after {
          content: "";
          height: 100%;
          width: 1px;
          background: rgba($color: $white, $alpha: 0.1);
          position: absolute;
          // right: -2px;
          left: 100px;
          top: 1px;
        }
        .plus {
          margin-left: 15px;
          // margin-right: -4px;
        }
      }

      .button {
        border-radius: 100px;
        border: $border;
        margin-left: 10px;
        .icon {
          margin-right: 4px;
        }

        .middle {
          vertical-align: middle;
        }
      }
    }

    .creator-wrap {
      display: flex;
      align-items: center;
      margin-bottom: 18px;

      .avatar {
        width: 22px;
        height: 22px;
        border-radius: 50%;
        margin-right: 8px;
      }

      .creator {
        margin-right: 8px;
      }

      .create-time {
        font-size: $font-size-sm;
        color: gray;
      }
    }

    .desc {
      margin-bottom: 8px;
      font-size: $font-size-sm;
      color: gray;
      .label {
        display: inline-block;
        margin-right: 8px;
      }

      .value {
        @include text-ellipsis-multi(3);
      }
    }
  }
}
</style>
