<template>
  <div
    class="playlist-comment"
    v-infinite-scroll="loadComment"
    infinite-scroll-immediate="false"
    infinite-scroll-distance="2"
    infinite-scroll-delay="300"
  >
    <div class="enter-comment">
      <textarea></textarea>
      <div class="container">
        <div class="container-left">
          <Icon type="aite" :size="20" />
          <Icon type="jinghaojian" :size="16" class="second-icon" />
        </div>
        <NButton class="commit-comment" @click="commitComment">评论</NButton>
      </div>
    </div>
    <div class="hot-comment" v-if="hotComments.length">
      <h1 class="title">精彩评论</h1>
      <CommentItem
        v-for="(item, index) in hotComments"
        :key="index"
        :data="item"
        class="content-item"
      />
    </div>
    <div class="comment" v-if="comments.length">
      <h1 class="title">最新评论</h1>
      <CommentItem
        v-for="(item, index) in comments"
        :key="index"
        :data="item"
        class="content-item"
      />
    </div>
  </div>
</template>

<script>
import CommentItem from "./comment-item.vue";
import { getComment, commitComment } from "@/api";
export default {
  name: "PlayListComment",
  components: {
    CommentItem,
  },
  data() {
    return {
      hotComments: [],
      comments: [],
      comment: "",
      offset: 0,
    };
  },
  props: {
    id: Number,
  },
  created() {
    this.getCommentData();
  },
  computed: {},
  methods: {
    loadComment() {
      console.log("load");
      this.offset++;
      this.getCommentData();
    },
    getCommentData() {
      getComment(this.id, this.offset).then((res) => {
        // console.log(res);
        if (res.hotComments && res.hotComments.length) {
          this.hotComments = res.hotComments;
        }
        if (res.comments && res.comments.length) {
          if (this.offset > 0) {
            this.comments.push(...res.comments);
            // console.log(this.comments);
          } else {
            this.comments = res.comments;
            this.$parent.$data.tabs.splice(1, 1, `评论(${res.total})`);
          }
        }
        // console.log(this.$parent.$data);
      });
    },
    commitComment() {
      console.log("comment");
      commitComment(this.id, "test", "2").then((res) => {
        console.log(res);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.playlist-comment {
  .enter-comment {
    textarea {
      width: 100%;
      height: 50px;
      font-size: $font-size-medium-sm;
      border-color: #e5e5e5;
      border-radius: 5px;
      outline: none;
      resize: none;
    }

    .container {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      margin-bottom: 20px;

      .container-left {
        display: flex;
        i {
          cursor: pointer;
        }

        .second-icon {
          margin-top: 2px;
          margin-left: 10px;
        }
      }

      .commit-comment {
        border-radius: 100px;
      }
    }
  }
  .title {
    margin-bottom: 15px;
  }

  .content-item {
    margin-bottom: 20px;
  }
}
</style>