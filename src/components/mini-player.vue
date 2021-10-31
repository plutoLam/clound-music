<template>
  <div class="mini-player" id="mini-player" ref="miniPlayer">
    <div v-if="hasCurrentSong" class="show-player" :class="getPlayerCls">
      <div class="song">
        <div class="img-wrap" @click="tsetPlayerShow">
          <div class="player-control">
            <Icon type="shangjiantou_huaban" :size="24" color="white" />
          </div>
          <div class="mask"></div>
          <img
            :src="$utils.genImgUrl(currentSong.img, 80)"
            alt=""
            class="blur"
          />
        </div>
        <div class="content">
          <div class="content-top">
            <p class="name">{{ currentSong.name }}</p>
            <div class="aixin-wrap" @click="islove = !islove">
              <Icon :type="loveType" :size="20" :color="loveColor" />
            </div>
          </div>

          <p class="artists">{{ currentSong.artistsText }}</p>
        </div>
      </div>
      <div class="player-control">
        <div class="icon-wrap" @click="tsetPlayerShow">
          <Icon type="jiantou8" :size="16" />
        </div>
        <div class="icon-wrap wrap" v-for="item in iconName" :key="item">
          <Icon :type="item" :size="18" color="black" />
        </div>
        <!-- <div class="icon-wrap">
          <Icon type="ziyuan" />
        </div>
        <div class="icon-wrap">
          <Icon type="iconset0425" />
        </div>
        <div class="icon-wrap">
          <Icon type="fenxiang" />
        </div> -->
      </div>
    </div>
    <!-- 控制台 -->
    <div class="center">
      <div class="control">
        <div class="play-mode" @click="onChangePlayMode">
          <Icon :type="modeIcon" />
        </div>
        <div class="prev" @click="prev">
          <Icon type="shangyishou" />
        </div>
        <div class="play" @click="togglePlaying">
          <Icon :type="playIcon" :size="playIconSize" />
        </div>
        <div class="next" @click="next">
          <Icon type="xiayishou" />
        </div>
        <div class="lyrics">词</div>
      </div>
      <div class="time">
        <span class="play-time"> {{ $utils.formatTime(currentTime) }} </span>
        <div class="progress-bar-wrap">
          <ProgressBar
            @percentChange="onProgressChange"
            :percent="playedPercent"
            :disabled="!hasCurrentSong"
            ref="ProgressBar"
          />
        </div>
        <span class="total-time">
          {{ $utils.formatTime(currentSong.duration / 1000) }}
        </span>
      </div>
    </div>

    <div class="mode">
      <div class="volume-wrap">
        <Volume
          :volume="volume"
          @volumeChange="onVolumeChange"
          class="volume"
        />
      </div>
      <Icon type="liebiao" :size="24" @click="togglePlaylistShow" />
    </div>
    <audio
      :src="currentSong.url"
      @canplay="ready"
      @timeupdate="updateTime"
      ref="audio"
      @ended="next"
    ></audio>
    <!-- 当浏览器能够开始播放指定的音频/视频时，发生 canplay 事件 -->
  </div>
</template>
<script>
import {
  mapState,
  mapMutations,
  mapGetters,
  mapActions,
} from "@/store/helper/music";
import Storage from "good-storage";
import { VOLUME_KEY, playModeMap, isDef } from "@/utils";
const DEFAULT_VOLUME = 0.45;
export default {
  data() {
    return {
      islove: true,
      songReady: false,
      volume: Storage.get(VOLUME_KEY, DEFAULT_VOLUME),
      iconName: ["aixin", "ziyuan", "iconset0425", "fenxiang"],
    };
  },
  mounted() {
    // this.audio.volume = this.volume;
    this.onVolumeChange(this.volume);
    this.setMiniPlayerRef(this.$refs.miniPlayer);
  },
  methods: {
    tsetPlayerShow() {
      console.log("isPlayerShow");
      this.setPlayerShow(!this.isPlayerShow);
    },
    onChangePlayMode() {
      const modeKeys = Object.keys(playModeMap);
      const currentModeIndex = modeKeys.findIndex(
        (key) => playModeMap[key].code === this.playMode
      );
      const nextIndex = (currentModeIndex + 1) % modeKeys.length;
      const nextModeKey = modeKeys[nextIndex];
      const nextMode = playModeMap[nextModeKey];
      console.log(nextMode);
      this.setPlayMode(nextMode.code);
    },
    togglePlaylistShow() {
      this.setPlaylistShow(!this.isPlaylistShow);
    },
    onVolumeChange(percent) {
      this.audio.volume = percent;
      Storage.set(VOLUME_KEY, percent);
    },
    onProgressChange(percent) {
      this.audio.currentTime = this.currentSong.durationSecond * percent;
      this.setPlayingState(true);
    },
    updateTime(e) {
      const time = e.target.currentTime;
      this.setCurrentTime(time);
      // console.log(this.currentTime, "time");
    },
    prev() {
      if (this.songReady) {
        this.startSong(this.prevSong);
      }
    },
    next() {
      // console.log(this.$refs.ProgressBar.$refs.progress);
      // this.$refs.ProgressBar.$refs.progress.style.width = 0;
      // this.playedPercent = 0;
      if (this.songReady) {
        this.startSong(this.nextSong);
      }
    },
    togglePlaying() {
      //如果没有正在播放的音乐则return
      if (!this.currentSong.id) {
        return;
      }
      this.setPlayingState(!this.playing);
      console.log(this.playing);
    },
    ready() {
      this.songReady = true;
    },
    async play() {
      if (this.songReady) {
        await this.audio.play();
        console.log("play");
      }
    },
    pause() {
      this.audio.pause();
    },
    ...mapMutations([
      "setCurrentTime",
      "setPlayingState",
      "setPlayMode",
      "setPlaylistShow",
      "setPlayerShow",
      "setMiniPlayerRef",
    ]),
    ...mapActions(["startSong"]),
  },
  watch: {
    currentSong(newSong, oldSong) {
      console.log(newSong.name, "currentSong");
      if (!newSong.id) {
        this.audio.pause();
        this.audio.currentTime = 0;
        return;
      }

      if (oldSong && newSong.id === oldSong.id) {
        this.setCurrentTime(0);
        this.audio.currentTime = 0;
        this.play();
        return;
      }
      this.songReady = false;
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.play();
      }, 1000);
    },
    playing(newPlaying) {
      newPlaying ? this.play() : this.pause();
    },
  },
  computed: {
    ...mapState([
      "currentSong",
      "currentTime",
      "playing",
      "playMode",
      "isPlaylistShow",
      "isPlaylistPromptShow",
      "isPlayerShow",
      "miniPlayerRef",
    ]),
    ...mapGetters(["prevSong", "nextSong"]),
    hasCurrentSong() {
      return isDef(this.currentSong.id);
    },
    getPlayerCls() {
      return this.isPlayerShow ? "show" : "hiden";
    },
    // 播放的进度百分比
    playedPercent() {
      const { durationSecond } = this.currentSong;
      return Math.min(this.currentTime / durationSecond, 1) || 0;
    },
    currentMode() {
      return playModeMap[this.playMode];
    },
    modeIcon() {
      return this.currentMode.icon;
    },
    playIcon() {
      return this.playing ? "pause" : "play";
    },
    playIconSize() {
      return this.playing ? 15 : 23;
    },
    loveType() {
      if (this.islove) {
        return "aixin";
      } else {
        return "aixin1";
      }
    },
    loveColor() {
      if (!this.islove) {
        return "red";
      }
    },
    audio() {
      return this.$refs.audio;
    },
    playIcon() {
      return this.playing ? "pause" : "play";
    },
  },
};
</script>
<style lang="scss" scoped>
.mini-player {
  position: relative;
  position: fixed;
  z-index: $mini-player-z-index;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  height: $mini-player-height;
  padding: 8px 26px;
  padding-right: 24px;
  background: var(--body-bgcolor);
  border-top: $border;
  overflow: hidden;
  i {
    cursor: pointer;
  }

  .show-player {
    transition: transform 0.5s;
    .song {
      height: 100%;
      display: flex;
      align-items: center;
      flex: 4;
      overflow: hidden;

      .img-wrap {
        position: relative;
        margin-right: 8px;
        border-radius: 6px;
        overflow: hidden;
        cursor: pointer;
        @include img-wrap(40px);

        .player-control,
        .mask {
          display: none;
        }
        &:hover {
          .player-control {
            display: block;
            @include abs-center;
          }

          .mask {
            display: block;
            @include abs-stretch;
            background: rgba(0, 0, 0, 0.2);
          }
        }
      }

      .content {
        margin-left: 5px;
        display: flex;
        flex-direction: column;
        // justify-content: space-around;
        // padding: 3px 0;
        .content-top {
          display: flex;
          align-items: center;
          margin-bottom: 5px;
          .name {
            font-size: $font-size-lg;
            margin-right: 5px;
          }
          .aixin-wrap {
            cursor: pointer;
          }
        }

        .artists {
          font-size: $font-size-sm;
        }
      }
    }

    .player-control {
      padding: 8px 0;
      display: flex;
      .icon-wrap {
        width: 40px;
        height: 40px;
        @include flex-center;
        cursor: pointer;
      }

      .wrap {
        border: 1px #eee solid;
        border-radius: 50%;
        margin-left: 16px;
        padding: 15px;
      }
    }

    &.hiden {
      transform: none;
    }

    &.show {
      transform: translateY(-105%);
    }
  }

  .center {
    @include abs-center;
    display: flex;
    flex-direction: column;
    width: 38%;
    height: 100%;
    // background-color: pink;

    .control {
      position: relative;
      left: 50%;
      transform: translate(-50%, 0);
      width: 60%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 10px 1px;

      .play {
        cursor: pointer;
        background-color: #f4f4f4;
        @include round(39px);
        position: relative;
        margin: 0 5px;
        i {
          @include abs-center;
        }
      }
    }

    .time {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: -5px;
      .progress-bar-wrap {
        width: 88%;
        margin: 0 5px;
      }
    }
  }

  .mode {
    display: flex;
    position: absolute;
    right: 26px;
    bottom: 25px;
    // transform: translateY(-50%);  //子元素fixed无效
    i {
      margin-left: 10px;
    }

    .volume-wrap {
      z-index: $volume-z-index;
      position: fixed;
      bottom: 25px;
      right: 56px;
    }
  }
}
</style>