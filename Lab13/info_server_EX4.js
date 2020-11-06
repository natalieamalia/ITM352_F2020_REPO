var express = require('express');
var app = express();
var myParser = require("body-parser");
var fs = require('fs')

app.all('*', function (request, response, next) {
    console.log(request.method + ' to path ' + request.path);
});
app.use(myParser.urlencoded({ extended: true }));
app.post("/process_form", function (request, response) {
   let POST = request.body;
   if (typeof POST['quantity_textbox'] != 'undefined') {
    let q = POST['quantity_textbox'];
    if (isNonNegInt(q)) {
        var contents = fs.readFileSync('./views/display_quantity_template.view', 'utf8');
        response.send(eval('`' + contents + '`')); // render template string
    } else {
        response.send(`${q} is not a quantity!`);
    }
}
});
