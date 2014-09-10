var crypto = require("crypto");
var http = require("http");

function sign(req, res){

    var body = req.body;
    body.ReturnUrl = 'https://www.google.se';
    body.OrderNumber = 'order-"'+ Math.floor(Math.random()*10)+'"';
    body = JSON.stringify(body);
    var hash = crypto.createHash('sha256');
    hash.update(body)
    var digest = hash.digest('base64');



    var host = "www.bohlmark.se";
    //host = "localhost"

    var requestParams = {
        hostname: host,
        path: '/V1/Charges',
        port: 80,
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'date': new Date().toUTCString(),
            'host': host,
            'digest': 'SHA-256=' + digest
        }
    }

    var sign = signature('caspeco-1', {'caspeco-1': '6Jj3c7lQr6dhDf4oMsYnTfrjFnwezP4GzqHlqr2heyw='}, 'hmac-sha256', ['date', '(request-target)']);

    var signature = sign(requestParams);
    requestParams.headers['Authorization'] = signature;

    var len = Buffer.byteLength(body)
    var Req = http.request(requestParams, function(response) {
        var b = ""
        response.on("data", function (d) {
            b += d;
        })
        response.on("end", function () {
            console.log("body", b);
            res.send(b)
        })
    });

    Req.write(body)
    Req.end()




    function signature(keyId, keys, algorithm, headers) {
        if (typeof headers != 'string') {
            headers = headers.join(" ")
        }
        var headerArray = typeof headers == 'string' ?
            headers.split(' ') : headers;
        
        function hmacSignature(r) {
            function getHeaderValue(r, header) {
                switch (header) {
                    case 'date':
                        console.log("geting header date " +r  )
                        return new Date().toUTCString()
                        break;
                    case '(request-target)':
                        console.log("getting header request-target " + r)
                        return r.method.toLowerCase() + ' ' + r.path
                        break;
                    default:
                        return r.headers[header];
                }
            }

            var headerStrings = headerArray.map(function (header) {
                console.log("HEADER", header)
                return header + ": " + getHeaderValue(r, header);
            });
            var toSign = headerStrings.join('\n');
            console.log(toSign);
            r.headers["X-Signature-String"] = toSign;
            var parts = algorithm.split('-');
            var key = keys[keyId];
            var keyBuffer = new Buffer(key, 'base64');
            var hmac = crypto.createHmac(parts[1], keyBuffer);
            hmac.update(toSign);
            return hmac.digest('base64');
        }

        function formatAuthorization(signParams) {
            var params = ["keyId", "algorithm", "headers", "signature"]
            var signParamStrings = params.map(function (p) {
                return p + '="' + signParams[p] + '"';
            })
            var authString = 'Signature ' + signParamStrings.join(",");
            console.log("Gernerated auth string", authString);
            return authString
        }

        return function RequestSignature(r) {
            var signParams = {
                keyId: keyId,
                algorithm: algorithm,
                headers: headers,
                signature: hmacSignature(r)
            }

            return formatAuthorization(signParams);
        }
    }

}

exports.sign = sign