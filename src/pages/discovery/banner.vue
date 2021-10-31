<template lang="">
  <el-carousel :interval="4000" type="card" class="banner-carousel" height="200px">
    <el-carousel-item v-for="(item,index) in banners" :key="index">
      <img
        :src="$utils.genImgUrl(item.imageUrl,1500,500)"
        class="banner-img"
      />
    </el-carousel-item>
  </el-carousel>
</template>
<script>
import { getBanner } from "@/api";
export default {
  data() {
    return {
      banners: [],
    };
  },
  async created() {
    const { banners } = await getBanner(); //变量加括号，获取对象里面对应的key的value
    this.banners = banners;
  },
};
</script>
<style lang="scss" scoped>
.banner-img {
  width: 100%;
  height: 100%;
  border-radius: 4px;
}
</style>