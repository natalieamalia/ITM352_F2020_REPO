var express = require('express');
var app = express ();
var myParser = require('fs');
var data = require ('./products/product_data.json');
var products = data.products;

app.all('*', function (request, response, next) {
    console.log(request.method + ' to path ' + request.path);
});
app.use(myParser.urlencoded({ extended: true }));
app.post("/process_form", function (request, response) {
    //process_quantity_form(request.body, response);
    response.send(request.body)
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
    } // Checks if string is a number
    if(q < 0) errors.push('Negative value!'); // Checks if it is non-negative
    if(parseInt(q) != q) errors.push('Not an integer!'); // Checks if it is an integer
    return returnErrors ? errors : (errors.length == 0);
}

function process_quantity_form (POST, response) {
    if (typeof POST [`purchase_submit_button`] != 'undefined') {
        var contents = fs.readFileSync['.views/display_quantities_template.view', 'utf8']
        receipt = '';
        for (i in products) {
        let q = POST[`quantity_textbox${1}`];
        }
    }
}

