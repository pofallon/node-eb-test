var express = require('express');
var router = express.Router();
var async = require("async");

/* GET users listing. */
router.get('/', function(req, res, next) {
  async.parallel([
    function(cb) {
      var t = process.hrtime();
      req.app.get("redis").get("hello", function(err, results) {
        cb(err, {
          step: "cache", 
          time: formatTimeInMs(process.hrtime(t)), 
          results: {value: results}
        });
      });
    },
    function(cb) {
      var t = process.hrtime();
      req.app.get("mysql").query("select 1;", function(err, results) {
        cb(err, {
          step: "db",
          time: formatTimeInMs(process.hrtime(t))
        });
      });
    },
    function(cb) {
      var t = process.hrtime();
      req.app.get("api").get(process.env.API_URL, function(err, response) {
        cb(err, {
          step: "api", 
          time: formatTimeInMs(process.hrtime(t)), 
          results: {statusCode: response.statusCode}
        });
      });
    }
  ], function(err, results) {
    if (err) {
      res.send(JSON.stringify(err, null, 4));
    } else {
      res.send(JSON.stringify(results, null, 4));
    }
  });
});

var formatTimeInMs = function(timings) {
  var ms = (timings[0]*1000)+(timings[1]/1000000);
  return(Math.round(ms*100)/100);
}

module.exports = router;
