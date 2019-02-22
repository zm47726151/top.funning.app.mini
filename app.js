//app.js

const web = require("common/web.js");

App({
  isLogin: false,
  //shopList:[],
  //cookie:{},
  onLaunch: function () {
    this.cookie = new Map(); 
  }
})