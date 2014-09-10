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
	sign(req, '/V1/Charges', function(result){
		var object = JSON.parse(result)
		console.log("result: " + typeof(object))
		console.log("result.ChargeId: "+ object.ChargeId)
		if(!result.Captured){
			var terminal = "/V1/Charges/?id="+object["ChargeId"]+"/Terminal"
			req.body = object;
			req.id = object.ChargeId;
			sign(req, terminal, function(result){
				res.send(result)
			})
			
		}
	})
})

router.get("/charges", function (req, res){
	request.get("http://www.bohlmark.se/V1/charges?")
})






module.exports = router;
