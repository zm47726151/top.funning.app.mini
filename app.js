//app.js
 
App({
  appName: "KFS",
  isLogin: false,
  shopList: [],
  cookie: {}, 
  onLaunch: function() {
    this.cookie = new Map();
  }
})