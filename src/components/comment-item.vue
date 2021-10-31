<template>
  <div class="playlist-comment">
    <!-- <h1 class="title">
      {{ title }}
    </h1> -->
    <div class="comment-item">
      <div class="img-wrap">
        <img :src="$utils.genImgUrl(data.user.avatarUrl, 400)" alt="" />
      </div>
      <div class="detail">
        <div class="detail-up">
          <span class="user-name">{{ user.nickname }}: </span>
          <span class="content">{{ data.content }}</span>
        </div>
        <div class="beReplied" v-if="data.beReplied.length">
          <span class="user-name"
            >@{{ data.beReplied[0].user.nickname }}:
          </span>
          <span class="beReplied-content">{{ data.beReplied[0].content }}</span>
        </div>
        <div class="detail-down">
          <div class="time">
            {{ time }}
          </div>
          <div class="control">
            <Icon
              type="dianzan"
              :size="14"
              v-if="!data.liked"
              @click="likeComment()"
            />
            <Icon type="dianzan_kuai" :size="14" color="red" v-else />
            {{ data.likedCount }}
            <el-divider direction="vertical"></el-divider>
            <Icon type="fenxiang1" :size="14" />
            <el-divider direction="vertical"></el-divider>
            <Icon type="pinglun" :size="14" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Like } from "@/api";
export default {
  name: "CommentItem",
  props: {
    title: {
      type: String,
      default: "评论",
    },
    data: Object,
  },
  data() {
    return {};
  },
  methods: {
    likeComment() {
      Like(this.id, this.data.commentId, 1, 2).then((res) => {
        console.log(res);
      });
    },
  },
  computed: {
    id() {
      return Number(this.$route.params.id);
    },
    user() {
      return this.data.user;
    },
    time() {
      let nowData = new Date();
      let time = new Date(this.data.time);
      if (nowData.getFullYear() == time.getFullYear()) {
        return this.$utils.formatDate(this.data.time, "M月dd日 hh:mm");
      } else {
        return this.$utils.formatDate(this.data.time, "yyyy年M月dd日 hh:mm");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.playlist-comment {
  width: 100%;

  .comment-item {
    display: flex;
    width: 100%;

    .img-wrap {
      @include img-wrap(40px);
      border-radius: 50%;
      overflow: hidden;
      margin-right: 15px;
    }

    .detail {
      width: 100%;

      .detail-up {
        font-size: $font-size-medium-sm;
      }
      .beReplied {
        width: 100%;
        background-color: #f4f4f4;
        border-radius: 5px;
        padding: 5px;
        margin-top: 7px;
      }

      .detail-down {
        display: flex;
        justify-content: space-between;
        align-items: center;
        // height: 30px;
        margin-top: 7px;
        .time {
          font-size: $font-size-sm;
          color: gray;
        }

        .control {
          // margin-right: -20px;
          font-size: $font-size-sm;
          i {
            // margin-right: 20px;
            cursor: pointer;
            &:nth-child(2) {
              margin: 0 20px;
            }
          }
        }
      }
    }
  }
}
.user-name {
  @include label;
}
</style>