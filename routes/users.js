var express = require('express');
var router = express.Router();
var async = require("async");

/* GET users listing. */
router.get('/', function(req, res, next) {
  async.parallel([
    function(cb) {
      req.app.get("redis").get("hello",cb);
    },
    function(cb) {
      req.app.get("mysql").query("select 1;", cb);
    }
  ], function(err, results) {
    if (err) {
      res.send(err);
    } else {
      res.send(results);
    }
  });
});

module.exports = router;
