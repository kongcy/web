// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  "plugins": {
    "postcss-import": {},
    "postcss-url": {},
    // to edit target browsers: use "browserslist" field in package.json
    "autoprefixer": {}
  },
  devServer:{
    // proxy:{
    //   '/monitor':{
    //     target:"http://172.16.12.19:7070/monitor",
    //     changeOrigin:true,
    //   }
    // }
  }
}
