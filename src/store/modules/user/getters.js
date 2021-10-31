
export default {
  isLogin(state) {
    // console.log(Object.keys(this.loginData).length);
    return Object.keys(state.userData).length ? true : false;
    // return false;
  },
}
