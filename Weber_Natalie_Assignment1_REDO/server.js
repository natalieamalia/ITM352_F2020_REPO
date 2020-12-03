//Natalie's Assignment 1 REDO
//Code for server copied from Lab 13 and provided by Professor Port during office hour meetings and Assignment 1 workshops. Kylee Dean-Kobatake also helped me review and revise some of my code. Thank you for all of your help!

var products = require('./products.json'); // Sets products.json data into a variable called data
const querystring = require('querystring'); // Sets querystring module as variable "querystring"
var express = require('express'); // Begins express module
var app = express (); // Sets express as variable "app"
var myParser = require("body-parser"); // Sets body-parser module as variable "myParser"

// Processes incoming requests
app.all('*', function (request, response, next) {
    console.log(request.method + ' to path ' + request.path); // generates request method and request path in console
    next(); 
});

app.use(myParser.urlencoded({ extended: true }));

// Professor Port helped me type this code to get my products.json
app.get("/product_data.js", function (request, response, next) {
    str = `var products = ${JSON.stringify(products)}`;
    response.type('.js');
    response.send(str);
    });

app.post("/process_form", function (request, response) {
    //process_form(request.body, response);
     POST = request.body;
    response.send(POST); 
});

// Professor Port helped me type this code 
app.post("/process_purchase", function (request, response) {
    //process_purchase(request.body, response);
     POST = request.body;
     if (typeof POST['submitPurchase'] != 'undefined') {
        
        let hasqty = false;
        let hasErrors = false; // assume no errors to begin with
        //validate each quantity 
        for (i in products) { 
            qty = POST[`quantity${i}`];
            //check if quantity is non negative integer
            if (qty != '' && isNonNegInteger(qty) == false) {
                hasErrors = true;
            }
            //check to see if user selected any quantities
            if (qty > 0) {
                hasqty = true;
            }
        }
        //if no errors, send quantity data to invoice, otherwise go back to display page
        const stringified = querystring.stringify(POST);
        if (hasqty == true && hasErrors == false) {
            response.redirect("./invoice.html?" + stringified);
        }
        else { //if no quantity inputted or invalid, notify user and send them back to display
            alertstr = `<script> alert("Error! You need to select a item or enter valid quantities");
                        window.history.back() </script>`;
            
            response.send(alertstr);
         }
    } 
});

// isNonNegInteger function from Lab 12 which checks if quantities entered are a non-negative integer
function isNonNegInteger(q, returnErrors = false) {
    errors = []; //assume no errors at first
/* This function returns true if value of q is a non-negative integer
*/
    if(Number(q) != q) errors.push('Not a number!');
    // Checks if string is a number
    if(q < 0) errors.push('Negative value!'); // Checks if string is non-negative
    if(parseInt(q) != q) errors.push('Not an integer!'); // Checks if string is an integer
    return returnErrors ? errors : (errors.length == 0);
}
app.use(express.static('./public')); // Searches for files in "public"
app.listen(8080, () => console.log(`listening on port 8080`)); // Listens for requests on port 8080