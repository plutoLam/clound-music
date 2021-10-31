<template>
  <div class="search">
    <el-input
      placeholder="搜索"
      prefix-icon="el-icon-search"
      ref="input"
      @focus="setDetailShow"
      @keydown.enter.native="enter"
      v-model="input"
      @input.native="throttled"
    >
    </el-input>
    <Toggle
      class="search-detail"
      v-show="isDetailShow"
      ref="searchDetail"
      :class="{ inSuggest: isShowSuggest }"
      :show.sync="isDetailShow"
      :includedDom="[$refs.input && $refs.input.$el]"
    >
      <!-- <Toggle :show.sync="isDetailShow">
        <div class="fa">
          <div class="son"></div>
        </div>
        <span>123</span>
      </Toggle> -->
      <div class="search-detail-content" v-if="!isShowSuggest">
        <div
          class="search-history"
          v-show="searchHistory && searchHistory.length"
        >
          <span>搜索历史</span>
          <Icon type="lajitong" @click="emptyHistory" />
        </div>
        <div class="history">
          <div
            class="history-item"
            v-for="(item, index) in searchHistory"
            :key="index"
          >
            {{ item }}
          </div>
        </div>

        <p class="hot-title">热搜榜</p>
        <div class="hot">
          <div class="hot-item" v-for="(item, index2) in hotData" :key="index2">
            <div
              class="hot-index"
              :class="{ active: index2 == 1 || index2 == 2 || index2 == 0 }"
            >
              {{ index2 + 1 }}
            </div>
            <div class="hot-right">
              <div class="hot-item-up">
                <span class="searchWord">{{ item.searchWord }}</span>
                <span class="score">{{ item.score }}</span>
              </div>
              <div class="content">
                {{ item.content }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="suggest" v-else>
        <p>
          搜索“
          <span style="color: #5981b2">{{ input }}</span>
          ”相关的结果 >
        </p>
        <div
          class="suggest-detail"
          v-for="(item, index) in order"
          :key="index"
          v-show="item != 'order'"
        >
          <div class="order">
            <Icon :type="iconMapping[item]" :size="14" />
            {{ filterOrder[item] }}
          </div>
          <div
            class="order-item"
            v-for="(item1, index1) in searchSuggest[item]"
            :key="index1"
          >
            <span v-html="hightLight(item1.name)"></span>
            <span v-show="item !== 'artists'"> - </span>
            <span v-if="item == 'songs'">
              <!-- {{ $utils.genArtistisText(item1.artists) }} -->
              <span
                v-html="hightLight($utils.genArtistisText(item1.artists))"
              ></span>
            </span>
            <span v-if="item == 'albums'">
              <!-- {{ item1.artist.name }} -->
              <span v-html="hightLight(item1.artist.name)"></span>
            </span>
          </div>
        </div>
      </div>
    </Toggle>
  </div>
</template>
<script>
import { getHotDetail, getSearchSuggest } from "@/api";
import { SEARCH_HOISTORY_KEY } from "@/utils";
import lodash from "lodash";
import Storage from "good-storage";
export default {
  data() {
    return {
      hotData: [],
      isDetailShow: false,
      input: "",
      searchHistory: [],
      searchSuggest: {},
      filterOrder: {
        songs: "单曲",
        artists: "歌手",
        albums: "专辑",
      },
      iconMapping: {
        songs: "icon-test",
        artists: "renwu-ren",
        albums: "zhuanji",
      },
    };
  },
  created() {},
  computed: {
    order() {
      if (this.searchSuggest && this.searchSuggest.order) {
        // console.log("order");
        return this.searchSuggest.order;
      }
      return [];
    },
    isShowSuggest() {
      return this.input ? true : false;
    },
  },
  methods: {
    setDetailShow() {
      // console.log("show");
      this.isDetailShow = true;
    },
    emptyHistory() {
      Storage.remove(SEARCH_HOISTORY_KEY);
      this.setSearchHistory();
      this.searchHistory = [];
    },
    setSearchHistory() {
      this.searchHistory = this.getSearchHistory();
    },
    getSearchHistory() {
      return Storage.get(SEARCH_HOISTORY_KEY);
    },
    getHotDetailData() {
      getHotDetail().then((res) => {
        console.log(res);
        this.hotData = res.data;
      });
    },
    enter(e) {
      console.log(e);
      const history_arr = Storage.get(SEARCH_HOISTORY_KEY) || [];
      console.log("history_arr", history_arr);
      history_arr.push(this.input);
      Storage.set(SEARCH_HOISTORY_KEY, history_arr);
      this.setSearchHistory();
      // console.log("Storage", Storage.get(SEARCH_HOISTORY_KEY));
    },

    searchInput(e) {
      const key = this.input;
      if (key) {
        console.log(key);
        getSearchSuggest(key).then((res) => {
          console.log(res.result);
          const { result } = res;
          this.searchSuggest = result;
          // this.hightLight(result, key);
        });
      }
    },
    // traverside(data) {
    //   Object.keys(data).forEach((key) => {
    //     data[key].forEach((item) => {
    //       if (item.constructor === Object) {
    //         Object.keys(item).forEach((item_key) => {
    //           if (typeof item_key === "string") {
    //             console.log(item_key);
    //           }
    //         });
    //       } else if (typeof item === "string") {
    //         console.log(item);
    //       }
    //     });
    //   });
    // },
    hightLight(str) {
      // this.traverside(data);
      // console.log("str", str);
      const key = this.input;
      // 将所有字符串中的字母换成小写，实现大小写不敏感
      const key_lower = key.toLowerCase();
      const str_lower = str.toLowerCase();
      //生成正则
      let replaceReg = new RegExp(key_lower, "g");
      // console.log("reg", replaceReg.test(str));

      const index = str_lower.indexOf(key_lower);
      //替换固定长度的字符串
      // console.log("index", str_lower.indexOf(key_lower));
      const replace_key = str.slice(index, key.length);
      let replaceString =
        '<span style="color:#5981B2">' + replace_key + "</span>";

      const replace_str = str_lower.replace(replaceReg, replaceString);
      // console.log(replace_str);
      return replace_str;
    },
  },
  watch: {
    isDetailShow(show) {
      if (show) {
        this.getHotDetailData();
        this.throttled = _.debounce(this.searchInput, 1000);
        this.setSearchHistory();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@mixin cursor_hover() {
  &:hover {
    background: $gray-medium;
    cursor: pointer;
  }
}
.search {
  position: relative;
  width: 150px;
  position: relative;
  .search-detail {
    width: 360px;
    height: 450px;
    background-color: $white;
    position: fixed;
    margin-left: -30px;
    z-index: 99999;
    border: $border;
    border-radius: 5px;

    transition: height 0.2s;
    -moz-transition: height 0.2s; /* Firefox 4 */
    -webkit-transition: height 0.2s; /* Safari and Chrome */
    -o-transition: height 0.2s; /* Opera */

    &.inSuggest {
      height: 380px;
    }

    .search-detail-content {
      width: 100%;
      height: 98%;
      overflow: hidden;
      overflow-y: scroll;
      // margin-top: 15px;
      // margin-bottom: 5px;
      // margin-left: 15px;
      .search-history {
        margin-bottom: 10px;
        margin-left: 15px;
        margin-top: 15px;
        span {
          margin-right: 7px;
        }

        i {
          cursor: pointer;
        }
      }

      .history {
        display: flex;
        flex-wrap: wrap;
        margin-right: -10px;
        margin-left: 15px;
        .history-item {
          border: 1px solid $gray-height;
          padding: 1px 10px;
          border-radius: 20px;
          margin-right: 10px;
          margin-bottom: 6px;
        }
      }

      .hot-title {
        margin: 15px 0;
        margin-left: 15px;
      }

      .hot {
        width: 100%;
        // margin-left: -10px;
        .hot-item {
          width: 100%;
          display: flex;
          padding: 8px 0;
          margin: 5px 0;
          height: 50px;

          @include cursor_hover;

          .hot-index {
            width: 40px;
            height: 100%;
            // background-color: pink;
            padding-top: 5px;
            padding-left: 10px;
            font-size: $font-size-medium;
            color: gray;

            &.active {
              color: red;
            }
          }

          .hot-right {
            width: 90%;
            .searchWord {
              font-weight: $font-weight-bold;
              color: $black;
              margin-right: 5px;
            }

            .score {
              font-size: $font-size-sm;
              color: $gray-height;
              font-weight: 300;
            }

            .content {
              width: 100%;
              font-size: $font-size-sm;
              color: gray;
              margin-top: 5px;
              @include text-ellipsis;
            }
          }
        }
      }
    }

    .suggest {
      width: 100%;
      height: 100%;
      overflow: hidden;
      overflow-y: scroll;
      translate: 1s;
      p {
        margin: 10px;
        font-size: $font-size-sm;
        &:hover {
          color: $black;
          cursor: pointer;
        }
      }
      .suggest-detail {
        width: 100%;
        .order {
          background-color: $gray-medium;
          padding: 5px 0;
          padding-left: 10px;
          font-size: $font-size-medium-sm;
          @include cursor_hover;
        }
        .order-item {
          width: 100%;

          padding: 5px 0;
          padding-left: 10px;
          @include text-ellipsis;
          font-size: $font-size-sm;
          @include cursor_hover;
        }
      }
    }
  }
}
</style>