const xygLocation = {
  lng: 113.33717442876233,
  lat: 23.091333102548455
};

const web = require("web.js");

function computer(parameter) {
  let tem = parameter.address;
  let address = tem.provinceName + tem.provinceName + tem.cityName + tem.detailInfo
  web.request("C1013", {
    address: address,
  }, {
    success: function(d) {
      let distance = GetDistance(
        d.lat,
        d.lng,
        xygLocation.lat,
        xygLocation.lng
      )
      console.log(d.lng);
      console.log(d.lat);
      console.log(xygLocation.lng);
      console.log(xygLocation.lat);
      console.log(distance);
      if (distance < 10 && parameter.price > 30) {
        parameter.onSuccess(0);
      } else {
        parameter.onSuccess(6);
      }
    },
    fail: function(code, msg) {
      parameter.onFail(msg);
    }
  });
}
//计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度
function GetDistance(lat1, lng1, lat2, lng2) {
  var radLat1 = lat1 * Math.PI / 180.0;
  var radLat2 = lat2 * Math.PI / 180.0;
  var a = radLat1 - radLat2;
  var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * 6378.137; // EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000;
  return s;
}

//进行经纬度转换为距离的计算
//经纬度转换成三角函数中度分表形式。
function Rad(d) {
  return d * Math.PI / 180.0;
}

module.exports = {
  computer: computer,
}