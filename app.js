//app.js
 
App({
  imageHost:"http://image.funning.top/",
  appName: "昕阳光果品店",
  isLogin: false,
  shopList: [],
  cookie: {}, 
  onLaunch: function() {
    this.cookie = new Map();
  }
})