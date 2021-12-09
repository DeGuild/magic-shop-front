/* eslint-disable quotes */
/* eslint-disable global-require */
/* vue.config.js */
module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/styles/_variables.scss";`,
      },
    },
  },
};
