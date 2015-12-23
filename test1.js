require("webduino-js");
require("webduino-blockly");

var request = require("request");
var fs = require("fs");
var cheerio = require("cheerio");

var pm = function() {
  request({
    url: "http://rate.bot.com.tw/Pages/Static/UIP003.zh-TW.htm",
    method: "GET"
  }, function(e, r, b) {
    if (e || !b) {
      return;
    }
    var $ = cheerio.load(b);
    var varTime = new Date();
    var result = [];
    var title = $(".titleLeft");
    var decimal = $(".decimal");
    console.log(decimal);
    for (var i = 0; i < title.length; i++) {
      result.push('{"'+title[i].children[1].data+'":['+decimal[4*i].children[0].data + ','+decimal[4*i+1].children[0].data+']}');
    }
    fs.writeFile("result.json", result, function() {

      var varTime = new Date();
      var a = JSON.parse(result[7]);
      console.log(varTime.toLocaleTimeString()+': '+a[' 日圓 (JPY)'][1]);

      var led;
      boardReady('35PQ', function(board) {
        board.samplingInterval = 20;
        led = getLed(board, 11);
        if (a[' 日圓 (JPY)'][1] < 0.27) {
          led.on();
        } else {
          led.off();
        }
      });
    });
  });
};

pm();
setInterval(pm,5*60*1000);
