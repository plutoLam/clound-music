<template>
  <div
    ref="progressBar"
    @click="progressClick"
    :class="{ volume: isvolume, ProgressBar: !isvolume }"
  >
    <div class="bar-inner">
      <div class="progress" ref="progress">
        <div
          class="progress-btn-wrapper"
          ref="progressBtn"
          @mousedown="mousedown"
        >
          <div class="progress-btn" :class="{ show: isvolume }"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Storage from "good-storage";
import { VOLUME_KEY } from "@/utils";
export default {
  name: "ProgressBar",
  props: {
    percent: {
      type: Number,
      default: 0,
    },
    isvolume: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isdown: false,
    };
  },
  created() {
    this.touch = {};
  },
  mounted() {
    if (this.isvolume) {
      // console.log(Storage.get(VOLUME_KEY), "storage");
      this._offset(this.percent);
      // this._triggerPercent(this.percent);
    }
    console.log(this.$root);
    document.addEventListener("mousemove", (e) => {
      this.mousemove(e);
    });
    // document.addEventListener("mousemove", (e) => {
    //   console.log(this.mousemove(e));
    // });
    document.addEventListener("mouseup", () => {
      this.mouseup();
    });
    // document.addEventListener("click", () => {
    //   console.log("click");
    // });
  },
  methods: {
    mousedown() {
      console.log("mousedown");
      this.isdown = true;
    },
    mouseup() {
      // console.log("mouseup");
      this.isdown = false;
    },
    mousemove(e) {
      // console.log("mousemove");
      if (this.isdown) {
        // console.log("坐标变化");
        // console.log(e.pageX);
        this.progressClick(e);
      }
    },
    progressClick(e) {
      if (!this.isvolume && !this.disabled) {
        const rect = this.$refs.progressBar.getBoundingClientRect();
        //console.log(rect); //bottom: 700.00390625height: 30left: 309.3515625right: 600.6484375top: 670.00390625 width: 291.296875 x: 309.3515625y: 670.00390625
        // console.log(e, "e");
        // console.log(e.pageX - rect.left);
        const offsetWidth = Math.max(
          0,
          Math.min(e.pageX - rect.left, this.$refs.progressBar.clientWidth)
        );
        const percent = offsetWidth / rect.width;
        // console.log(percent);
        this._offset(percent);
        if (!this.isdown) {
          this._triggerPercent(percent);
        }
      } else if (this.isvolume) {
        const rect = this.$refs.progressBar.getBoundingClientRect();
        // console.log(rect); //bottom: 700.00390625height: 30left: 309.3515625right: 600.6484375top: 670.00390625 width: 291.296875 x: 309.3515625y: 670.00390625
        // console.log(e.pageY, "e");
        // console.log(e.pageY - rect.top);
        const offsetHeight = 72 - Math.max(0, Math.min(e.pageY - rect.top));
        // console.log(offsetHeight);
        const percent = offsetHeight / rect.height;
        // console.log(percent);
        this._offset(percent);
        this._triggerPercent(percent);
      }
    },
    _triggerPercent(percent) {
      this.$emit("percentChange", percent);
    },
    _offset(percent) {
      if (!this.isvolume) {
        this.$refs.progress.style.width = percent * 100 + "%";
      } else {
        this.$refs.progress.style.height = percent * 100 + "%";
      }

      // console.log("progress.clientWidth", this.$refs.progress.clientWidth);
    },
  },
  watch: {
    percent(newPercent) {
      if (newPercent >= 0 && !this.isdown) {
        this._offset(newPercent);
      }
      // console.log(newPercent);
      // this.setProgressOffset(newPercent)
    },
  },
};
</script>
<style lang="scss" scoped>
.ProgressBar {
  height: 30px;
  cursor: pointer;
  .bar-inner {
    height: 3px;
    background: var(--progress-bgcolor);
    position: relative;
    top: 14px;
    border-radius: 1px;

    .progress {
      width: 0%;
      height: 100%;
      // height: 200px;
      background-color: $theme-color;
      position: relative;
      .progress-btn-wrapper {
        position: absolute;
        top: -10px;
        right: -14px;
        width: 25px; //为了使点击范围大
        height: 25px;

        .progress-btn {
          display: none;
          @include round(10px);
          @include abs-center;
          background: $theme-color;

          &.show {
            display: block;
          }
        }
      }
    }
  }

  &:hover {
    .progress-btn {
      display: block !important;
    }
    .bar-inner {
      height: 5px !important;
      border-radius: 2px;
      top: 13px;
    }
  }
}

.volume {
  height: 100%;
  cursor: pointer;

  .bar-inner {
    width: 3px;
    height: 100%;
    background: var(--progress-bgcolor);
    position: relative;
    border-radius: 1px;
    display: flex;
    align-items: flex-end;
    .progress {
      width: 100%;
      height: 0%;
      background-color: $theme-color;
      position: relative;

      .progress-btn-wrapper {
        position: absolute;
        top: -11px;
        right: -6px;
        width: 15px; //为了使点击范围大
        height: 15px;

        .progress-btn {
          @include round(10px);
          @include abs-center;
          background: $theme-color;
        }
      }
    }
  }
}
</style>