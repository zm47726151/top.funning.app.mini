/**
 * 1.网络请求失败
 * 2.服务端处理失败
 */

function request(cmd, data, operation) {
  console.log("web request " + cmd + " data", data);
  let app = getApp();
  let cookie = "";
  app.cookie.forEach(function(value, key, map) {
    cookie = key + "=" + value + ";" + cookie;
  });
  console.log("WebRequest.cmd", cmd);
  console.log("WebRequest.data", data);
  console.log("WebRequest.cookie", cookie);
  wx.request({
    //url: 'https://fruits.knxy.top/api',
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
      console.log("WebRequest.success", res);
      if (res.statusCode != 200) {
        operation.fail(-1000, "网络请求失败");
        return;
      }

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
    },
    fail: function(res) {
      console.log("WebRequest.fail", res);
      setCookies(res);
      operation.fail(-1000, "网络请求失败");
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
          }
        });
      } else {
        operation.fail("-1", "登录失败");
      }
    },
    fail: function(res) {
      operation.fail("-1", "登录失败");
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
    return;
  }

  if (res) {
    cookies = res.header["Set-Cookie"];
  }
  if (cookies) {
    let kvs = cookies.split(";");
    if (!kvs || kvs.length < 1) {
      return;
    }

    for (let i = 0; i < kvs.length; i++) {
      let kv = kvs[i];
      kv = kv.split("=");
      if (!kv || kv.length < 2) {
        break;
      }
      let key = kv[0].trim();
      let value = kv[1].trim();
      if (!key || key == "Path") {
        break;
      }
      app.cookie.set(key, value);
    }
  }
}

module.exports = {
  request: request,
}