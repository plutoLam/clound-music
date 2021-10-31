<template>
  <div class="routes-history">
    <div class="icon-wrap" :class="{ isPlayerShow: isGray }">
      <Icon class="icon" type="zuojiantou" @click="back" />
    </div>
    <div class="icon-wrap" :class="{ isPlayerShow: isGray }">
      <Icon class="icon" type="youjiantou" @click="forward" />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isGray: false,
    };
  },
  props: {
    isPlayerShow: Boolean,
  },
  methods: {
    back() {
      this.$router.back();
    },
    forward() {
      this.$router.forward();
    },
  },
  watch: {
    isPlayerShow(show) {
      if (show) {
        setTimeout(() => {
          this.isGray = true;
        }, 450);
      } else {
        this.isGray = false;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.routes-history {
  display: flex;
  align-content: center;

  .icon-wrap {
    background-color: #f4f4f4;
    @include round(25px);
    position: relative;
    margin: 0 5px;
    transition: 0.05s background-color;
    cursor: pointer;

    &.isPlayerShow {
      background-color: #bbbfc1;
      // -webkit-transition:background-color .3s;
    }
    .icon {
      @include abs-center;
    }
  }
}
</style>