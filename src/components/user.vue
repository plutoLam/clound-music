<template>
  <div class="user">
    <div class="header-user" @click="openLoginDialog">
      <div class="img-wrap">
        <img v-if="isLogin" :src="userData.profile.avatarUrl" alt="">
        <img src="@/assets/avatar.png" alt="" v-else/>
        
      </div>
      <span v-if="!isLogin">未登录</span>
      <span v-else>{{userData.profile.nickname}}</span>
      <Icon type="sanjiaodown" :size="13" />
    </div>

    <el-dialog
      :modal="false"
      :visible.sync="dialogTableVisible"
      class="login-dialog"
      :show-close="false"
    >
      <div class="login-body">
        <div class="qr-code" v-if="isQrLogin">
          <h1>扫码登录</h1>
          <div class="qr-wrap">
            <img :src="base64Img" alt=""/>
          </div>
          <p>使用网易云音乐APP扫码登录</p>
          <p @click="moreLogin()">
            选择其他登录模式
            <Icon type="youjiantou" />
          </p>
        </div>
        <div class="phone-login" v-else>
          <div class="img-wrap">
            <img src="@/assets/phone.png" alt="">
          </div>
          <div class="input">
            <div class="phone">
              <select name="" id="" class="area">
              <option 
              v-for="item in options" 
              :key="item" 
              :value="item"
              >+{{item}}</option>
            </select>
            <input v-model="phone" placeholder="请输入手机号" class="phone-num"></input>
            </div>
            <input type="password" v-model="password" placeholder="请输入密码" class="password"></input>
          </div>
          
          <div class="auto-login">
            <input type="checkbox" v-model="isAutoLogin" class="checkbox">自动登录
             <!-- <el-checkbox v-model="isAutoLogin" text-color="#fff">自动登录</el-checkbox> -->
          </div>

          <!-- <n-button>登录</n-button> -->
          <el-button type="primary" size="medium" @click.native="login">登陆</el-button>
          <a href="#" class="register">注册</a>

          <div class="agree">
            <input type="checkbox" v-model="isAgree" class="checkbox">
            同意
            <a href="#">《服务条款》</a>
            <a href="#">隐私政策</a>
            <a href="#">儿童隐私政策</a>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getLoginData,
  getUserDetailData,
  getQrKey,
  getQrImg,
  getQrCheck,
} from "@/api";
import { UID_KEY, IS_AUTO_LOGIN } from "@/utils";
import storage from "good-storage";
import Vue from "vue";
import { mapState, mapGetters, mapMutations } from "@/store/helper/user";
export default {
  name: "User",
  data() {
    return {
      dialogTableVisible: false,
      isQrLogin: true,
      phone: "13360954233",
      password: "a1244715423",
      options: ["86", "12", "34"],
      isAutoLogin: "",
      isAgree: "",
      base64Img: "",
    };
  },
  created() {
    this.autoLogin();
    // this.qrLogin();
  },
  methods: {
    ...mapMutations(["setuserData"]),
    async qrLogin() {
      let res = await getQrKey();
      const key = res.data.unikey;
      res = await getQrImg(key);
      this.base64Img = res.data.qrimg;

      // getQrCheck = getQrCheck;
      // getQrCheck();
      getQrCheckData();
      function getQrCheckData() {
        setTimeout(() => {
          getQrCheck(key).then((res) => {
            console.log("状态", res);
            if (res.code == 803) {
              console.log("登录");
              this.dialogTableVisible = false;
            } else {
              getQrCheckData();
            }
          });
        }, 1000);
      }
    },
    autoLogin() {
      if (storage.get(IS_AUTO_LOGIN)) {
        const uid = storage.get(UID_KEY);
        if (uid) {
          this.getUserDetailData(uid);
        }
      }
    },
    moreLogin() {
      this.isQrLogin = false;
      console.log(this.isQrLogin);
    },
    openLoginDialog() {
      if (this.isLogin) {
        this.logout();
      } else {
        this.dialogTableVisible = true;
      }
    },
    logout() {
      // this.userData = {};
      this.setuserData({});
      // storage.set(UID_KEY, null);
    },
    login() {
      // console.log(Vue.prototype);
      if (this.isAgree) {
        this.getLoginData();
      } else {
        console.log("请勾选同意");
        // Vue.prototype.$message("这是一条消息提示");
      }
    },
    getLoginData() {
      getLoginData(this.phone, this.password).then((res) => {
        // console.log(res);
        const uid = res.account.id;
        storage.set(UID_KEY, uid);
        storage.set(IS_AUTO_LOGIN, this.isAutoLogin);
        this.getUserDetailData(uid);
        // this.loginData = res;
      });
    },
    getUserDetailData(uid) {
      getUserDetailData(uid).then((res) => {
        // this.userData = res;
        this.setuserData(res);
        this.dialogTableVisible = false;
      });
    },
  },

  computed: {
    ...mapState(["userData"]),
    ...mapGetters(["isLogin"]),
  },
};
</script>

<style lang="scss" scoped>
.user {
  .header-user {
    height: $header-height;
    display: flex;
    align-items: center;

    & > * {
      margin-left: 5px;
    }
    .img-wrap {
      @include img-wrap(27px);
      border-radius: 50%;
      overflow: hidden;
      background-color: #e0e0e0;
      border: #d2d2d2 solid 1px;
    }
  }

  /deep/.el-dialog__wrapper {
    top: -40px;

    .el-dialog {
      top: 0 !important;
      width: 400px !important;

      .el-dialog__body {
        padding: 0 0 !important;
        // width: 400px !important;

        .login-body {
          width: 400px;
          height: 550px;
          // background-color: pink;
          display: flex;
          flex-direction: column;
          align-items: center;

          .qr-code {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
            padding-top: 40px;

            h1 {
              font-size: $font-size-title-lg;
            }
          }

          .phone-login {
            width: 70%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-around;

            .img-wrap {
              margin-top: 80px;
              // @include img-wrap(100%, 100px);
              img {
                width: 100%;
              }
            }
            .input {
              display: flex;
              flex-direction: column;
              width: 100%;
              height: 70px;
              input {
                border: $border;
                outline: none;
                &:focus {
                  border: $border;
                }
              }

              .phone {
                display: flex;
                flex: 1;
                .area {
                  flex: 1;
                  border: $border;
                }

                .phone-num {
                  flex: 3;
                }
              }

              .password {
                flex: 1;
              }
            }

            .auto-login {
              display: flex;
              align-items: center;

              .checkbox {
                background-color: #fff !important;
              }
            }

            .el-button--medium {
              // padding: 10px 120px;
              width: 100%;
            }

            .register {
              color: $black;
              align-self: center;
            }

            .agree {
              display: flex;
              align-items: center;

              a {
                text-decoration: none;
              }
            }
          }
        }
      }
    }
  }
}
</style>