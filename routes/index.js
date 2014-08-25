var express = require('express');
var router = express.Router();
var request = require("request")
/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Bazaar' });
});



router.get("/buy", function (req, res){

	var orderNumber = Math.floor(Math.random()*30)+10;
	var customer = "someguy" + Math.floor(Math.random()*300)+10
	request.get("http://www.bohlmark.se/V0/Register?Amount=10000&returnUrl=localhost://3000&Recipientid=2&CurrencyCode=SEK&InstallationId=1&buyerid="+customer+"&orderNumber="+orderNumber , function(err, response, body){
		console.log("request sent!!")
		
		if(!err){
			console.log("successfully!")
			console.log(body + response)
			var parsed = JSON.parse(body)
			var address = "/Terminal?InstallationId=1&r&amount=10000&CurrencyCode=SEK&TransactionId=" + parsed.TransactionId
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
