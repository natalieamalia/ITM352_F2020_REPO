var express = require('express');
var app = express ();
var myParser = require("body-parser");
var products = require ('./products.json');

app.all('*', function (request, response, next) {
    console.log(request.method + ' to path ' + request.path);
    next();
});
app.get("/product_data.js", function (request, response, next) {
    str = `var products = ${JSON.stringify(products)}`;
    response.type('.js');
    response.send(str);
    });
app.use(myParser.urlencoded({ extended: true }));
app.post("/process_form", function (request, response) {
    //process_form(request.body, response);
     POST = request.body;
    response.send(POST); 
});
app.post("/process_purchase", function (request, response) {
    //process_purchase(request.body, response);
     POST = request.body;
    response.send(POST); 
});
app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`));

function isNonNegInteger(q, returnErrors = false) {
    errors = []; //assume no errors at first
/* This function returns true if value of q is a non-negative integer. 
*/
    if(Number(q) != q) errors.push('Not a number!');
    // Checks if string is a number
    if(q < 0) errors.push('Negative value!'); // Checks if it is non-negative
    if(parseInt(q) != q) errors.push('Not an integer!'); // Checks if it is an integer
    return returnErrors ? errors : (errors.length == 0);
}

