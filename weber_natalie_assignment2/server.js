//Natalie's Assignment 2
//Code for server copied from Lab 13 and provided by Professor Port during office hour meetings and Assignment 1 workshops. Thank you for all of your help! Kylee Dean-Kobatake also helped me review and revise some of my code and I used examples from W3 schools.

var products = require('./products.json'); // Sets products.json data into a variable called data
const querystring = require('querystring'); // Sets querystring module as variable "querystring"
var express = require('express'); // Begins express module
var app = express (); // Sets express as variable "app"
var myParser = require("body-parser"); // Sets body-parser module as variable "myParser"
var cookieParser = require('cookie-parser'); //sets require cookie parser as variable "cookieParser"
var products_data = require('./products.json') //loads product data 
var fs = require('fs');

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

app.use(cookieParser());
app.get("/login", function (request, response){ //responds with cookie
    response.cookie('username', 'Natalie', {maxAge: 300*1000}).send('cookie set!'); //Sets login username, sends cookie and cookie expiration time
});
app.get("/logout", function (request, response){ //responds with cookie
    username = request.cookies.username //identifies username of who is being logged out
    response.clearCookie('username').send(`logged out ${username}`); //clears cookie upon logout
});

app.post("/process_form", function (request, response) { 
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
        // If no errors then pass quantity data to login.html, otherwise send user back to products_display.html
        var stringified = querystring.stringify(POST);
        if (hasqty == true && hasErrors == false) {
            console.log(stringified); // log quantities
            response.redirect("./login.html?" + stringified); //redirects user to login.html
        }
        //if no errors, send quantity data to invoice, otherwise go back to display page
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

const user_data_filename = 'user_data.json'; // user_data.json assigned to user_data_filename
var data = fs.readFileSync(user_data_filename, 'utf-8'); // reads data in user_data_filename
users_data = JSON.parse(data); // parses data variable into JSON them passes it to users_reg_data

//This takes the login info from login_form on user_login.html, checks if user exists in userdata.json, if they do and password is correct, then redirect to invoice. 
app.post("/process_login", function (request, response) { 
    // Copied from Assignment 2 ITM 352 Workshop with Jojo's example
    var POST = request.body
    console.log(quantity_data);
    if (typeof users_data[request.body.username] != 'undefined' && typeof quantity_data != 'undefined') { //if username exists in userdata.json retrieve their data
        if (request.body.password != users_data[request.body.username].password) { 
            var contents = fs.readFileSync('invoice.html'); response.send(eval('`' + contents + '`')); //renders template string
        }

            alertstr = `<script> alert("Password is incorrect!");
            window.history.back() </script>`;

            response.send(alertstr); // send alert


        } else { // if the password does match 
            string_with_quantities = request.query; //get quantities string
            string_with_username = request.body; // get username string
            console.log(request);

            response.redirect("./invoice.html?" + querystring.stringify(string_with_quantities) + "&" + querystring.stringify(string_with_username)); // redirect to invoice with the two strings
        }
});

//This processes a user's registration info  and checks if it is valid, if data is valid it redirects user from registration to invoice
app.post("/process_register", function (request, response) {

    let POST = request.body;
    var errors = [];


    //username validation
    if (typeof users_data[request.body.newuser.toLowerCase] != 'undefined') { // sends error if username already exists in user_data.json
        errors.push("Sorry, username already exists.")
    }

    if (request.body.newuser.length < 4) { //sends error if username is less than four characters
        errors.push("Username must be more than four characters.");
    }

    if (request.body.newuser.length > 25) { //sends error if username is more than 25 characters
        errors.push("Username must be less than 25 characters.");
    }

    if (request.body.newfullname.length > 30) { //if full name is more than 25 characters long
        errors.push("Name is too long!");
    }

    if (/^[A-Za-z]+$/.test(request.body.name)) { // if full name contains characters beside letters code from Kylee Dean-Kobatake and W3schools
    } else {
        errors.push(("Username can only contain letters or numbers.")); 
        //sends error if username has characters other than letters 
    }

    //password validation
    if (request.body.newpass.length < 6) { //sends error if password is less than six characters
        errors.push("password must be more than six characters.");
    }

    //confirms password
    if (request.body.newpass != request.body.newpass_confirm) { //if passwords do not match
        errors.push("Passwords do not match!");
    }

    if (errors.length == 0) { //if function is executed when there are no errors in user registration data validation from functions above

        let POST = request.body;

        //send data to user_data.json to be stored
        username = POST['newuser'];
        users_data[username] = {};
        users_data[username].name = POST['newfullname'];
        users_data[username].password = POST['newpass'];
        users_data[username].email = POST['newemail'];
        reg_info_str = JSON.stringify(users_data); //parses and stores new user data in reg_info_str
        fs.writeFileSync(user_data_filename, reg_info_str, "utf-8");
        string_with_quantities = request.query; //gets quantities query
        string_with_reg_data = request.body; // gets registration string
        console.log(string_with_reg_data);

        response.redirect("./invoice.html?" + querystring.stringify(string_with_quantities) + "&" + querystring.stringify(string_with_reg_data)); //redirects user to invoice with quantities and registration data
    } else {

        console.log(errors);
        alertstr = `<script> alert("Registration error.");
        window.history.back() </script>`;

        response.send(alertstr);//sends an alert
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