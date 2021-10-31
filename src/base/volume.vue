<template>
  <div class="volume">
    <Icon type="yinliang" :size="24" class="icon" />
    <div class="volume-bar">
      <ProgressBar
        :isvolume="true"
        class="progress-bar"
        :percent="volumePercent"
        @percentChange="onProgressChange"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "Volume",
  props: {
    volume: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      volumePercent: this.volume,
    };
  },
  methods: {
    onProgressChange(percent) {
      if (percent < 0.05) {
        percent = 0;
      }
      this.volumePercent = percent;
      this.$emit("volumeChange", percent);
      // console.log("change", percent);
    },
  },
};
</script>

<style lang="scss" scoped>
.volume {
  position: relative;
  .volume-bar {
    display: none;
    height: 100px;
    // width: 20px;
    position: absolute;
    top: -106px;
    right: -4px;
    // left: 5px;
    background: $white;
    border: $border;
    border-radius: 5px;
    z-index: $volume-z-index;
    padding: 13px;

    &:before {
      content: "";
      width: 0;
      height: 0;
      /* border: 7px solid transparent; */
      /* border-left-color: #cccccc; */
      border-top: 8px solid #eeee;
      border-right: 8px solid transparent;
      border-left: 8px solid transparent;
      position: absolute;
      top: 97px;
      left: 6px;
    }
  }

  &:hover {
    .volume-bar {
      display: block;
      z-index: $volume-z-index;
    }
  }
}
</style>