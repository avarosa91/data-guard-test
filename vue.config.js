module.exports = {
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      title: 'App',
    },
  },

  configureWebpack: {
    devtool: 'source-map',
    plugins: [
    ]
  },
  productionSourceMap: false,
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "~@/scss/variables";`,
      },
    },
  },
  chainWebpack: config => {
    config.module
        .rule('vue')
        .use('vue-loader')
        .loader('vue-loader')
        .tap(options => {
          // https://stackoverflow.com/a/50812286
          options.prettify = false;
          return options;
        });
  }
};
