/**
 * 1.网络请求失败
 * 2.服务端处理失败
 */

function request(cmd, data, operation) {
  console.log(cmd);
  console.log(data);
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
      setCookies(res);

      let d = res.data;
      if (d.code > 0) {
        operation.success(d.data);
      } else {
        if (!d.msg) {
          d.msg = "处理异常";
        }
        if (!d.code) {
          d.code = "-1";
        }
        if (d.code == "-2") {
          login(cmd, data, operation);
          return;
        } else {
          operation.fail(d.code, d.msg);
        }
      }
      if (operation.complete) {
        operation.complete(res);
      }
    },
    fail: function(res) {
      setCookies(res);
      operation.fail(-1000, "网络请求失败");

      if (operation.complete) {
        operation.complete(res);
      }
    }
  });
}

function login(cmd, data, operation) { 
  wx.login({
    success(res) {
      if (res.code) {
        // 发起网络请求
        request("C1003", {
          "jsCode": res.code
        }, {
          success: function(d) {
            getApp().isLogin = true;
            request(cmd, data, operation);
          },
          fail: function(code, msg) {
            operation.fail(code, msg);
            operation.complete(res);
          }
        });
      } else {
        operation.fail("-1", "登录失败");
        operation.complete(res);
      }
    },
    fail: function(res) {
      operation.fail("-1", "登录失败");
      operation.complete(res);
    }
  });
}

function setCookies(res) {
  let cookies = res.cookies;
  let app = getApp();
  if (cookies) {
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i];
      app.cookie.set(cookie.name, cookie.value);
    }
  }
}

module.exports = {
  request: request,
}