/**
 * 1.网络请求失败
 * 2.服务端处理失败
 */

function request(cmd, data, operation) {
  let app = getApp();
  let cookie = "";
  app.cookie.forEach(function(value, key, map) {
    cookie = key + "=" + value + ";" + cookie;
  });
  wx.request({
    url: 'http://127.0.0.1:8080/api',
    data: {
      "cmd": cmd,
      "data": data,
    },
    header: {
      "Cookie": cookie
    },
    method: 'POST',
    dataType: 'json',
    success: function(res) {
      let data = res.data;
      if (data.code > 0) {
        operation.success(data.data);
      } else {
        operation.fail(data.code, data.msg);
      }
    },
    fail: function(res) {
      operation.fail(-1000, "网络请求失败");
    },
    complete: function(res) {
      let cookies = res.cookies;
      for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        app.cookie.set(cookie.name, cookie.value);
      }
      if (operation.complete) {
        operation.complete(res);
      }
    },
  });
}

module.exports = {
  request: request,
}