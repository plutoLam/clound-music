
module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "~@/style/variables.scss";
          @import "~@/style/mixin.scss";
        `,
      },
    },
  },
  configureWebpack: {
    devtool: 'source-map'
  }
}