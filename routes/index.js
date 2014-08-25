var express = require('express');
var router = express.Router();
var request = require("request")
/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Bazaar' });
});



router.get("/buy", function (req, res){
	request.get("http://www.bohlmark.se/V0/Register?Amount=100&Recipientid=2&CurrencyCode=SEK&installationId=1&buyerid=someone&orderNumber=25&returnUrl=https://www.bohlmark.se", function(err, response, body){
		console.log("request sent!!")
		
		if(!err){
			console.log("successfully!")
			console.log(body + response)
			var parsed = JSON.parse(body)
			var address = "/Terminal?TransactionId=" + parsed.TransactionId
			console.log("address is: " + address)
			res.redirect("https://www.bohlmark.se/V0" + address)
		}
		else if(err){
			console.log("but it all turned to shit")
			console.error(err + err.message)
		}
	})
})







module.exports = router;
