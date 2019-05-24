//app.js
 
App({
  appName: "噼里啪啦",
  isLogin: false,
  shopList: [],
  cookie: {}, 
  onLaunch: function() {
    this.cookie = new Map();
  }
})