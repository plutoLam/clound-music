<template>
  <div class="menu">
    <div class="menu-wrap">
      <div class="menu-block" v-for="(menu, index) in menus" :key="index">
        <p class="menu-block-title" v-if="menu.title">{{ menu.title }}</p>
        <ul class="menu-list">
          <router-link
            v-for="(item, index) in menu.children"
            :key="index"
            :to="item.path"
            active-class="menu-item-active"
            class="menu-item"
            tag="li"
          >
            <Icon :size="15" :type="item.meta.icon" class="iconfont" />

            <span class="menu-title">{{ item.meta.title }}</span>
          </router-link>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { menuRoutes } from "@/router";
import { mapState, mapGetters, mapMutations } from "@/store/helper/user";
import { getUserList } from "@/api";
export default {
  data() {
    return {
      menus: [
        {
          type: "root",
          children: menuRoutes,
        },
      ],
      userPlayList: [],
      uid: "",
    };
  },
  created() {},
  methods: {
    setMenus() {
      const userCreateList = [];
      const userCollectList = [];
      const retMenus = [];
      this.userPlayList.forEach((item) => {
        // console.log(item);
        if (item.userId == this.uid) {
          userCreateList.push(item);
        } else {
          userCollectList.push(item);
        }
      });

      const genPlaylistChildren = (playlist) =>
        playlist.map(({ id, name }) => ({
          path: `/playlist/${id}`,
          meta: {
            title: name,
            icon: "swticonyinle2",
          },
        }));

      if (userCreateList.length) {
        this.menus.push({
          type: "playlist",
          title: "创建的歌单",
          children: genPlaylistChildren(userCreateList),
        });
      }

      if (userCreateList.length) {
        this.menus.push({
          type: "playlist",
          title: "收藏的歌单",
          children: genPlaylistChildren(userCollectList),
        });
      }
    },
  },
  computed: {
    ...mapState(["userData"]),
    ...mapGetters(["isLogin"]),
  },
  watch: {
    isLogin(login) {
      if (this.isLogin) {
        this.uid = this.userData.userPoint.userId;
        getUserList(this.uid).then((res) => {
          // console.log(res);
          this.userPlayList = res.playlist;
          this.setMenus();
        });
      } else {
        this.menus = {
          type: "root",
          children: menuRoutes,
        };
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.menu {
  width: 230px;
  height: 100%;
  display: flex;
  flex-direction: column;
  // background-color: var(--menu-bgcolor);
  border-right: $border;

  .menu-wrap {
    flex: 1;
    overflow: hidden;
    overflow-y: auto;

    .menu-block {
      margin-bottom: 16px;

      .menu-block-title {
        font-size: $font-size-sm;
        color: var(--font-color-grey2);
        padding-left: 16px;
        margin-bottom: 8px;
      }

      .menu-list {
        .menu-item {
          @include text-ellipsis;
          padding: 12px 18px;
          cursor: pointer;

          &:hover {
            background: var(--menu-item-hover-bg);
          }

          &-active {
            // color: $theme-color;
            background: var(--menu-item-active-bg);

            i {
              // color: $theme-color;
            }
          }

          .iconfont {
            font-size: $font-size-medium-sm;
          }
          .menu-title {
            font-size: $font-size-medium-sm;
            margin-left: 8px;
          }
        }
      }
    }
  }
}
</style>