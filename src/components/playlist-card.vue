<template>
  <div @click="onClickCard" class="playlist-card">
    <div class="img-wrap">
      <img :src="$utils.genImgUrl(img, 300)" alt="" />
      <!-- <div class="desc-wrap" v-if="desc">
        <span class="desc">{{ desc }}</span>
      </div> -->
      <div class="play-count-wrap">
        <Icon type="Play" color="white" :size="12" />
        <span class="play-count">{{ $utils.unitConverter(playCount) }}</span>
      </div>
      <PlayIcon :size="36" class="play-icon" />
    </div>
    <p class="name">{{ name }}</p>
  </div>
</template>
<script>
export default {
  props: ["id", "img", "name", "desc", "playCount"],
  methods: {
    onClickCard() {
      this.$router.push(`/playlist/${this.id}`);
    },
  },
};
</script>
<style lang="scss" scoped>
.playlist-card {
  position: relative;
  width: calc(20% - 8px);
  margin: 4px;
  margin-bottom: 32px;
  cursor: pointer;

  .img-wrap {
    position: relative;
    width: 100%;
    padding-top: 100%;
    margin-bottom: 8px;
    border-radius: 4px;
    overflow: hidden;

    img {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }

    .play-count-wrap {
      position: absolute;
      top: 4px;
      right: 6px;

      .play-count {
        color: $white;
        font-size: $font-size-sm;
        margin-left: 2px;
      }
    }
    .desc-wrap {
      position: absolute;
      padding: 6px;
      left: 0;
      right: 0;
      top: 0;
      background-color: rgba(0, 0, 0, 0.4);
      transform: translateY(-100%);
      transition: all 0.3s;
    }

    .desc {
      color: $white;
      font-size: $font-size-sm;
    }

    .play-icon {
      opacity: 0;
      position: absolute;
      right: 14px;
      bottom: 14px;
      font-size: 24px;
      transition: all 0.6s;
      color: $white;
    }

    &:hover {
      .desc-wrap {
        transform: translateY(0);
      }

      .play-icon {
        opacity: 1;
      }
    }
  }
}
</style>