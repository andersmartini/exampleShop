var express = require('express');
var router = express.Router();
var request = require("request")
var sign = require("./signature.js").sign
var crypto = require("crypto")
/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Bazaar' });
});



router.post("/charge", function (req, res){
	sign(req, res)
})

router.get("/charges", function (req, res){
	request.get("http://www.bohlmark.se/V1/charges?")
})






module.exports = router;
