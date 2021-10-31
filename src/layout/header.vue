<template>
  <div class="header" :class="{ trans: 'isPlayerShow' }">
    <div class="left">
      <div class="buttons">
        <div class="mac-button red">
          <Icon :size="9" type="home" />
        </div>
        <div class="mac-button yellow">
          <Icon :size="9" type="minus" />
        </div>
        <div class="mac-button green">
          <Icon :size="9" type="full-screen" />
        </div>
      </div>

      <div class="icon-wrap" @click="tsetPlayerShow">
        <Icon type="jiantou8" v-if="isPlayerShow" :size="16" />
      </div>

      <!-- 后退功能 -->
      <!-- <div class="shrink-player">
        <Icon :size="9" type="arrow-left" />
      </div> -->
      <div class="history">
        <RoutesHistory :isPlayerShow="isPlayerShow" />
      </div>
    </div>

    <div class="right">
      <div class="search-wrap">
        <Search />
      </div>
      <User class="user" />
    </div>
  </div>
</template>
<script>
import RoutesHistory from "@/components/routes-history";
import Search from "@/components/search";
import { mapState, mapMutations } from "@/store/helper/music";
import User from "@/components/user";
export default {
  components: {
    RoutesHistory,
    Search,
    User,
  },
  methods: {
    ...mapMutations(["setPlayerShow"]),
    tsetPlayerShow() {
      console.log("isPlayerShow");
      this.setPlayerShow(!this.isPlayerShow);
    },
  },
  computed: {
    ...mapState(["isPlayerShow"]),
  },
};
</script>
<style lang="scss" scoped>
@import "~@/style/element-overwrite.scss";

.header {
  display: flex;
  align-items: center;
  height: $header-height;
  background-color: var(--header-bgcolor);
  padding: 0 20px;
  position: relative;
  z-index: $header-z-index;

  &.trans {
    background: transparent;
  }

  @include el-input-theme(
    ar(--header-input-color),
    var(--header-input-bgcolor),
    var(--header-input-placeholder-color)
  );

  .left {
    display: flex;
    align-items: center;

    .icon-wrap {
      cursor: pointer;
      margin-left: 20px;
      width: 30px;
      height: 100%;
      @include flex-center;
    }
    .buttons {
      display: flex;
      @include flex-center;
      height: 100%;
      &:hover {
        //鼠标放在三个button时
        .mac-button > i {
          opacity: 1;
        }
      }

      .mac-button {
        @include round(12px); //圆形
        @include flex-center;
        margin-right: 8px;
        cursor: pointer;

        &.red {
          background: #ed655a;
        }

        &.green {
          background: #72be47;
        }

        &.yellow {
          background: #e0c04c;
        }

        i {
          opacity: 0;
          transition: opacity 0.3s;
          color: $black;
          font-weight: $font-weight-bold;
          transform-origin: center center;
        }
      }
    }

    .history {
      height: 100%;
      margin-left: 65px;
      @include flex-center;
    }
  }

  .right {
    display: flex;
    align-items: center;

    .search-wrap {
      margin-left: 10px;
      height: 25px;
      border-radius: 25px;
      overflow: hidden;
    }

    .user {
      margin-left: 10px;
    }
  }
}
</style>