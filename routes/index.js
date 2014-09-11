var express = require('express');
var router = express.Router();
var request = require("request")
var sign = require("./signature.js").sign
var crypto = require("crypto")
/* GET home page. */
var uncapturedOrders=[];

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

router.get('/', function(req, res) {
	var renderobj = {title:"Bazaar", uncaptured: uncapturedOrders}
	res.render('index', renderobj);
});

router.get("/capture/*", function(req,res){
	var id = req.url.split("/")[-1]
	sign(req,"/V1/charges/"+id+"/capture", function(result){
		try{

		var object = JSON.parse(result)
		console.log("result.ChargeId: "+ object.ChargeId)
			req.id = object.ChargeId;
			var terminal = "http://www.bohlmark.se/V1/Charges/"+object["ChargeId"]+"/Terminal?keyId=caspeco-1"
			res.redirect(terminal)
			
			uncapturedOrders.remove(object.ChargeId)
			console.log(uncapturedOrders.toString())
			res.redirect("/")
		}catch(err){
			res.send(result)
		}
		}
	)
})

router.post("/charge", function (req, res){
	Capture = req.body.Capture;
	console.log("Capture: " + Capture)
	sign(req, '/V1/Charges', function(result){
		var object = JSON.parse(result)
		console.log("result.ChargeId: "+ object.ChargeId)
		if(Capture){
			req.id = object.ChargeId;
			var terminal = "http://www.bohlmark.se/V1/Charges/"+object["ChargeId"]+"/Terminal?keyId=caspeco-1"
			res.redirect(terminal)
			
		}else{
			uncapturedOrders.push(object.ChargeId)
			console.log(uncapturedOrders.toString())
			res.redirect("/")
		}
	})
})

router.get("/charges", function (req, res){
	request.get("http://www.bohlmark.se/V1/charges?")
})






module.exports = router;
