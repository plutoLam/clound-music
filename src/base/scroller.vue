<template>
  <div class="scroller" ref="scroller">
    <slot></slot>
  </div>
</template>

<script>
// import BScroll from "@better-scroll/core";
// import ScrollBar from "@better-scroll/scroll-bar";
// import MouseWheel from "@better-scroll/mouse-wheel";
import BScroll from "better-scroll";
// BScroll.use(ScrollBar);
// BScroll.use(MouseWheel);
const DEFAULT_OPTIONS = {
  mouseWheel: true, //开启鼠标滚轮 用于 PC 端的鼠标滚轮，默认为 false
  scrollY: true,
  scrollbar: true, //这个配置可以开启滚动条，默认为 false
  probeType: 3,
};
export default {
  name: "Scroller",
  data() {
    return {
      scroller: null,
    };
  },

  mounted() {
    // this.scroller = new BScroll(this.$refs.scroller, DEFAULT_OPTIONS);
    // console.log(this.scroller);
    if (!this.scroller) {
      this.scroller = new BScroll(this.$refs.scroller, DEFAULT_OPTIONS);
      console.log("new scroller");
    } else {
      console.log("scroller变化");
      this.scroller && this.scroller.refresh();
    }
  },
  methods: {
    getScroller() {
      return this.scroller;
    },
  },
};
</script>

<style lang="scss" scoped>
.scroller {
  height: 100%;
  overflow: hidden;

  .bscroll-vertical-scrollbar {
    position: absolute !important;
    right: 1000px !important;
  }
}
</style>