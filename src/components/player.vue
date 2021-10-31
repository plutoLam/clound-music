<template>
  <div class="player" :class="getPlayerCls">
    <div class="wrap">
      <div class="song">
        <div class="left">
          <div class="play-bar-container">
            <div class="play-bar-support-wrap">
              <img src="@/assets/image/play-bar-support.png" alt="" />
            </div>
            <div class="play-bar-wrap">
              <img src="@/assets/image/play-bar.png" alt="" />
            </div>
          </div>

          <div class="img-outer-border">
            <div class="img-outer">
              <img :src="$utils.genImgUrl(currentSong.img, 80)" alt="" />
            </div>
          </div>
        </div>
        <div class="center">
          <h1 class="name">{{ currentSong.name }}</h1>
          <div class="song-detail">
            <span class="singer">{{ currentSong.artistsText }}-</span>
            <span class="album">{{ currentSong.albumName }}</span>
          </div>
          <div class="scroller-wrap">
            <Scroller class="scroller" ref="scroller">
              <!-- <div><div v-for="i in 100" :key="i">123</div></div> -->
              <ul class="lyric-wrap">
                <li
                  ref="lyric"
                  v-for="(item, index) in lyricWithTranslation"
                  :key="index"
                  class="lyric-item"
                  :class="{ active: index === activeLyricIndex }"
                >
                  <p
                    v-for="(i, index) in item.contents"
                    :key="index"
                    class="lyric-text"
                  >
                    {{ i }}
                  </p>
                </li>
              </ul>
            </Scroller>
          </div>
          <div ref="title"></div>
        </div>

        <div class="right">
          <div class="right-container">
            <p class="play-source">播放来源：{{ getSongResource }}</p>
            <h5>包含这首歌的歌单</h5>
            <ul class="include-song-list">
              <li v-for="(i, index) in simiPlayList" :key="index">
                <div class="img-wrap">
                  <img :src="$utils.genImgUrl(i.coverImgUrl, 80)" alt="" />
                </div>
                <p>{{ i.description }}</p>
              </li>
            </ul>
            <h5>喜欢这首歌的人也听</h5>
            <ul class="include-song-list">
              <li v-for="(i, index) in simiSongs" :key="index">
                <div class="img-wrap">
                  <img :src="$utils.genImgUrl(i.img, 80)" alt="" />
                </div>
                <p>{{ i.name }}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- <div class="place" ref="title"></div> -->
      <div class="song-comment" v-if="comments && comments.length">
        <div class="hot-comment" v-show="offset === 1">
          <h1 class="title">精彩评论</h1>
          <CommentItem
            v-for="(item, index) in hotComments"
            :key="index"
            :data="item"
            class="content-item"
          />
        </div>
        <div class="comment">
          <h1 class="title">最新评论</h1>
          <CommentItem
            v-for="(item, index) in comments"
            :key="index"
            :data="item"
            class="content-item"
          />
        </div>
        <el-pagination
          class="pagination"
          background
          layout="prev, pager, next"
          :total="1000"
          :current-page.sync="offset"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import CommentItem from "./comment-item.vue";
import {
  getLyric,
  getSimiSongs,
  getSimiPlaylists,
  getSongComment,
} from "@/api";
import lyricParser from "@/utils/lrcparse"; //defalut导出，不用大括号
//否则会报错 TypeError: Object(...) is not a function
import {
  mapState,
  mapMutations,
  mapActions,
  mapGetters,
} from "@/store/helper/music";
import { createSong, scrollInto } from "@/utils";
export default {
  name: "Player",
  components: {
    CommentItem,
  },
  data() {
    return {
      lyric: [],
      tlyric: [],
      simiPlayList: [],
      simiSongs: [],
      hotComments: [],
      comments: [],
      offset: 1,
      isPlaceShow: false,
    };
  },
  created() {},
  mounted() {
    this.scrollToActiveLyric();
  },

  methods: {
    ...mapMutations(["setPlayerShow"]),
    ...mapActions(["startSong", "addToPlaylist"]),
    currentChange() {
      this.getCommentData();
      this.$nextTick(() => {
        const { title } = this.$refs;
        console.log("title", title.$el);
        title.scrollIntoView();
      });
    },
    getCommentData() {
      getSongComment(this.currentSong.id, this.offset - 1).then((res) => {
        console.log(res);
        if (res.hotComments && res.hotComments.length) {
          this.hotComments = res.hotComments;
        }
        if (res.comments && res.comments.length) {
          this.comments = res.comments;
        }
        // console.log(this.$parent.$data);
      });
    },
    updateSong() {
      this.updateLyric();
      this.updateSimi();
    },
    async updateLyric() {
      // console.log("id", this.currentSong.id);
      const consult = await getLyric(this.currentSong.id);
      // console.log("consult", consult);
      const { lyric, tlyric } = lyricParser(consult);
      // console.log(lyric, tlyric);
      this.lyric = lyric;
      this.tlyric = tlyric;
    },
    async updateSimi() {
      // getSimiSongs(461347998).then((res) => {
      //   console.log(res);
      // });
      // getSimiPlaylists(461347998).then((res) => {
      //   console.log(res);
      // });
      const [simiSongs, simiPlayList] = await Promise.all([
        getSimiSongs(this.currentSong.id),
        getSimiPlaylists(this.currentSong.id),
      ]);
      console.log(simiSongs, simiPlayList);
      this.simiPlayList = simiPlayList.playlists;
      this.simiSongs = simiSongs.songs.map(({ id, name, ar, mv, dt, album }) =>
        createSong({
          id,
          name,
          artists: ar,
          duration: dt,
          mvId: mv,
          img: album.picUrl,
        })
      );
      // console.log("simiSongs", this.simiSongs);
    },
    scrollToActiveLyric() {
      console.log("scrollToActiveLyric");
      // console.log(this.$refs);
      const { scroller, lyric } = this.$refs;
      if (lyric && lyric[this.activeLyricIndex]) {
        // console.log(lyric[this.activeLyricIndex]);
        scroller
          .getScroller()
          .scrollToElement(lyric[this.activeLyricIndex], 500, 0, true);
      }
      // console.log(scroller.getScroller());
    },
  },
  computed: {
    ...mapState(["currentSong", "currentTime", "playing", "isPlayerShow"]),
    ...mapGetters(["hasCurrentSong"]),
    getPlayerCls() {
      return this.isPlayerShow ? "show" : "hiden";
    },
    getSongResource() {
      if (this.currentSong.playListName) {
        // console.log("router", this.$route);
        return this.currentSong.playListName;
      } else {
        return "我喜欢的音乐";
      }
    },
    lyricWithTranslation() {
      let ret = [];
      if (this.lyric.length) {
        this.lyric.forEach((item) => {
          const { time, content } = item;
          const lyricItem = { time, content, contents: [content] };
          const sameTimeLyric = this.tlyric.find(
            ({ time: tlyricTime }) => tlyricTime === time //如果写了大括号就要return
          );
          if (sameTimeLyric) {
            // console.log(sameTimeLyric);
            const { content } = sameTimeLyric;
            // console.log(content);
            if (content) {
              lyricItem.contents.push(content);
            }
          }
          ret.push(lyricItem);
        });
      }
      return ret;
    },
    activeLyricIndex() {
      if (this.lyricWithTranslation) {
        return this.lyricWithTranslation.findIndex((item, index) => {
          const nextLiric = this.lyricWithTranslation[index + 1];
          return (
            item.time <= this.currentTime &&
            (nextLiric ? nextLiric.time >= this.currentTime : true)
          );
        });
      } else {
        return -1;
      }
    },
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (this.isPlayerShow) {
        this.updateSong();
      } else {
        this.updateLyric();
      }
    },
    activeLyricIndex() {
      this.scrollToActiveLyric();
    },
    isPlayerShow(show) {
      // console.log("show", show);
      if (show) {
        this.updateSimi();
        this.getCommentData();
      }
    },
    offset: {
      handler() {
        this.currentChange();
      },
      immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.player {
  position: fixed;
  // top: $header-height;
  top: 0;
  bottom: $mini-player-height;
  width: 100%;
  background: #fff;
  background: linear-gradient(to bottom, #c2c5c7, #f0f1f1, #ffffff);
  // padding-top: $header-height;
  z-index: $player-z-idnex;
  transition: transform 0.5s;
  overflow-y: scroll;
  &.show {
    transform: none;
  }

  &.hiden {
    transform: translateY(105%);
  }
  .wrap {
    width: 100%;
    margin-top: calc(#{$header-height} + 35px);

    .song {
      display: flex;
      width: 100%;
      height: 75vh;

      .left {
        flex: 1;
        position: relative;
        height: 100%;
        // background-color: powderblue;

        .play-bar-container {
          position: absolute;
          left: 200px;
          top: 70px;
          z-index: 10000; //不知道为啥会被盖住

          .play-bar-support-wrap {
            @include img-wrap(20px);
          }

          .play-bar-wrap {
            @include img-wrap(80px);
            margin-left: 6px;
            margin-top: -3px;
          }
        }

        .img-outer-border {
          @include round(300px);
          @include abs-center;
          @include flex-center;
          background-color: #dcdddd;

          .img-outer {
            @include round(280px);
            @include flex-center;
            background-color: black;

            img {
              @include round(200px);
            }
          }
        }
      }

      .center {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 30px;
        // background-color: brown;

        .name {
          font-size: $font-size-title-lg;
        }
        .song-detail {
          color: #919695;
          margin-top: 15px;
        }
        .scroller-wrap {
          margin-top: 35px;

          .scroller {
            height: 340px;
            width: 380px;
            mask-image: linear-gradient(
              180deg,
              hsla(0, 0%, 100%, 0) 0,
              hsla(0, 0%, 100%, 0.6) 3%,
              #fff 25%,
              #fff 75%,
              hsla(0, 0%, 100%, 0.6) 85%,
              hsla(0, 0%, 100%, 0)
            );
          }
          .lyric-wrap {
            padding: 10px;
            padding-bottom: 50%;
            .lyric-item {
              margin: 16px 0;
              .lyric-text {
                text-align: center;
              }

              &.active {
                font-weight: 900;
              }
            }
          }
        }
      }

      .right {
        flex: 1;
        position: relative;

        .right-container {
          position: absolute;
          left: 80px;
          top: 25%;
          width: 270px;
          height: 35vh;
          overflow-y: scroll;
          padding-bottom: 30px;
          @include no-select;
          mask-image: linear-gradient(
            180deg,
            hsla(0, 0%, 100%, 0) 0,
            hsla(0, 0%, 100%, 0.6) 0%,
            #fff 0%,
            #fff 75%,
            hsla(0, 0%, 100%, 0.6) 93%,
            hsla(0, 0%, 100%, 0)
          );

          .play-source {
            font-size: $font-size-medium;
            cursor: pointer;
            @include text-ellipsis;
            width: 100%;
          }

          h5 {
            margin: 10px 0;
            font-size: $font-size-medium;
          }

          .include-song-list {
            li {
              display: flex;
              align-items: center;
              margin-bottom: 8px;
              // padding-right: 10px;
              width: 100%;
              padding: 3px;
              padding-right: 15px;
              border-radius: 5px;

              &:hover {
                background-color: #dbdee0;
              }

              .img-wrap {
                @include img-wrap(35px);
                margin-right: 6px;
                border-radius: 3px;
                overflow: hidden;
              }
              p {
                @include text-ellipsis;
                margin-left: 5px;
                font-size: $font-size-medium-sm;
              }
            }
          }
        }
      }
    }

    .place {
      width: 100%;
      height: $header-height;
    }
    .song-comment {
      width: 60%;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      margin: 25px 0;

      .title {
        margin-bottom: 15px;
      }

      .content-item {
        margin-bottom: 20px;
      }

      .pagination {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }
}
</style>