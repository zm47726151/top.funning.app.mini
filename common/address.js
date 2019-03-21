const xygLocation = {
  lng: 113.33717442876233,
  lat: 23.091333102548455
};

function computer(parameter) {
  let address = parameter.address;
  let url = "http://api.map.baidu.com/geocoder/v2/?address=" + encodeURI(address.provinceName + address.provinceName + address.cityName + address.detailInfo) + "&output=json&ak=tj3qu8wHTAFgQ3OmZbl8CLzTznki2VGR";
  wx.request({
    url: url,
    dataType: 'json',
    success: function(res) {
      let distance = GetDistance(
        res.data.result.location.lng,
        res.data.result.location.lat,
        xygLocation.lng,
        xygLocation.lat
      )
      if (distance < 10 && parameter.price > 30) {
        parameter.onSuccess(0);
      }else{
        parameter.onSuccess(6);
      } 
    },
    fail: function(res) {
      parameter.onFail("计算失败");
    }
  })
}
//计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度
function GetDistance(lat1, lng1, lat2, lng2) {

  var radLat1 = Rad(lat1);
  var radLat2 = Rad(lat2);
  var a = radLat1 - radLat2;
  var b = Rad(lng1) - Rad(lng2);
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * 6378.137; // EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000; //输出为公里
  //s=s.toFixed(4);
  return s;
}

//进行经纬度转换为距离的计算
function Rad(d) {
  return d * Math.PI / 180.0; //经纬度转换成三角函数中度分表形式。
}

module.exports = {
  computer: computer,
}