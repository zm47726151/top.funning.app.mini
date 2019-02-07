function request(cmd, data, operation) {
  wx.request({
    url: 'http://127.0.0.1:8080/api',
    data: {
      "cmd": cmd,
      "data": data,
    },
    header: {},
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
      operation.fail(-1000,res);
    },
    complete: function(res) {},
  });
}

module.exports = {
  request: request,
}