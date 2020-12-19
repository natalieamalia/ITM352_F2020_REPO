//Natalie's Assignment 3 server
//Code for server copied from Assignment 2 which used code from Lab 13, Lab 15, and code that was provided by Professor Port during office hour meetings and workshops.

var product_data = require('./public/products.js'); //Sets ./products.js data into a variable called data and loads product data
var express = require('express'); //Server requires express to run//
var app = express (); // loads express into variable "app" and runs the express function
var myParser = require("body-parser"); // loads body-parser module into variable "myParser"
const querystring = require('querystring'); // loads querystring 
var fs = require('fs'); //loads the file system into variable fs
var cookieParser = require('cookie-parser');
var session = require('express-session');
const user_data_filename = 'user_data.json'; 
const nodemailer = require("nodemailer");
const { send } = require('process');

app.use(session({secret: "ITM352 rocks!"})); //sets up the use of sessions for the user
app.use(cookieParser()); //sets up the use of cookies for the user data
app.use(myParser.urlencoded({ extended: true }));
app.use(myParser.json());

if (fs.existsSync(user_data_filename)) { //checks that filename exists
    stats = fs.statSync(user_data_filename); //gets information from file
    console.log(`user_data.json has ${stats['size']} characters`); //reports size of file if file exists
    var data = fs.readFileSync(user_data_filename, 'utf-8');
    users_reg_data = JSON.parse(data); //parses the data if the file exists
} 

app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);// diplays in console the request method and path
    next(); 
});
// Processes incoming requests
app.post("/process_login", function (request, response) {
    POST = request.body;
    if(typeof users_reg_data[request.body.username] != 'undefined') {
        if(request.body.password == users_reg_data[request.body.username].password) {
            if (typeof request.session.login == 'undefined') {
                request.session.login = {};
            }
            if (typeof request.session.login.username == 'undefined') {
                request.session.login.username = [POST.username];
            }
            if (typeof request.session.login.password == 'undefined') {
                request.session.login.password = [POST.password];
            }
          console.log(request.session);

          var user_email = users_reg_data[request.body.username].email;

          response.cookie('username', POST.username);
          response.cookie('email', user_email);
          response.redirect("./login.html");
  

        } else {
            response.send(`Hey! ${request.body.password} doesn't match what we have for you!`)
        }
    } else {
    response.send(`Hey! ${user_data_filename} does not exist`);
}
});

app.post("/process_registration", function (request, response) {
    let POST = request.body;
    var errors = [];
//username validation processes a user's registration info and checks if it is valid, if data is valid it redirects user from registration to invoice
if (typeof users_reg_data[request.body.newuser.toLowerCase] != 'undefined') { // sends error if username already exists in user_data.json
    errors.push("Sorry, username already exists.");
}
if (request.body.newuser.length < 4) { //sends error if username is less than four characters
    errors.push("Username must be more than four characters.");
}
if (request.body.newuser.length > 25) { //sends error if username is more than 25 characters
    errors.push("Username must be less than 25 characters.");
}
if ((/^[0-9a-zA-Z]+$/).test(request.body.newuser) == false) { errors.push("Username can only contain letters or numbers"); // if username contains characters beside letters code from Kylee Dean-Kobatake and W3schools
} 
if (/^[A-Za-z]+$/.test(request.body.name)) { //error if full name contains characters beside letters
} else {
    errors.push("Name can only contain letters");
}
//password validation
if (request.body.newpass.length < 6) { //sends error if password is less than six characters
    errors.push("Password must be more than six characters.");
}
//confirms password
if (request.body.newpass != request.body.newpass_confirm) { //if passwords do not match
    errors.push("Passwords do not match!");
}
//if function is executed when there are no errors in user registration data validation from functions above
if (errors.length === 0) { 
     //send data to userdata.json to be stored
     username = POST['newuser'];
     users_reg_data[username] = {};
     users_reg_data[username].name = POST['newfullname'];
     users_reg_data[username].password = POST['newpass'];
     users_reg_data[username].email = POST['newemail'];
   reg_info_str = JSON.stringify(users_reg_data); //parse and store new user data in reg_info_str
   fs.writeFileSync(user_data_filename, reg_info_str, "utf-8");// write to file

       response.cookie('username', POST['newuser']);
       response.cookie('email', POST['newemail']);

       alertstr = `<script> alert("Thank you for registering! Please login to continue shopping.");
                   window.history.back() </script>`;

       response.send(alertstr); // send alert
       //response.redirect("./index.html"); // redirect to invoice with the two strings
} else {
   alertstr = `<script> alert("Error! ${errors}.");
                   window.history.back() </script>`;

       response.send(alertstr); // send alert
}
});

app.post("/add_to_cart", function (request, response) {
    //from Assignment 3 code examples, gets the product quantity data and session from post when the user hits "add to cart" 
    var products_key = request.query['products_key']; // 
    var quantities = request.query['quantities'].map(Number); // from Assignment 3 code examples, gets quantities from the form post and convert form post strings to numbers
    request.session.cart[products_key] = quantities; // from Assignment 3 code examples, stores the quantities array in the session cart object with the same products_key. 
    response.redirect('./cart.html'); //redirects user to cart.html page
});

//From Assignment 3 code examples, gets cart data and loads data into the session
app.get("/get_cart_data", function (request, response) {
    if (typeof request.session.cart == 'undefined') {
        request.session.cart = {};
    }
    response.json(request.session.cart);
});
//From Sessions/Cookies lab, gets login data and loads data into the session
app.post("/get_login_data", function (request, response) {
    if (typeof request.session.login == 'undefined') {
        request.session.login = {};
        console.log(request.session.login);
    }
    response.json(request.session.login);

});
app.post("/go_to_invoice", function (request, response) {
    console.log(request.session.cart);

    if (typeof request.session.login == 'undefined') {
        alertstr = `<script> alert("Please login or register to complete purchase!");
                        window.history.back() </script>`;

            response.send(alertstr);
        
    }
    //If user is logged in, this redirects them to the order invoice. If they are not this function notifies them to log in. Code copied from Kylie Dean-Kobatake
    response.redirect("./invoice.html");
});

//Code copied from assignment 3 examples and from Professor Daniel Port during Assignment 3 workshops
app.post("/complete_order", function (request, response) { //function to complete order after user has successfully logged in and added products to cart
    var user_email = request.cookies.email;
    var invoice_str = `Thank you for buying from Heart Depot,${user_email} ! Your order will be shipped by the next business day`;

    //copied from port's example
    var shopping_cart = request.session.cart;
    for(product_data.store_products in product_data) {
        for(i=0; i<product_data[product_data.store_products].length; i++) {
            if(typeof shopping_cart[product_data.store_products] == 'undefined') continue;
            qty = shopping_cart[product_data.store_products][i];
            if(qty > 0) {
              invoice_str += `<tr><td>${qty}</td><td>${product_data[store_products][i].name}</td><tr>`;
            }
        }
    }
      invoice_str += '</table>';

   
    var transporter = nodemailer.createTransport({
        host: "mail.hawaii.edu",
        port: 25,
        secure: false, // use TLS
        tls: {
          // do not fail on invalid certs
          rejectUnauthorized: false
        }
      });
    
      var user_email = request.cookies.email;
      console.log(user_email);
      var mailOptions = {
        from: 'kkak@hawaii.edu',
        to: user_email,
        subject: 'Your Invoice',
        html: invoice_str
      };
    
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            invoice_str += '<br>There was an error and your invoice could not be emailed :(';
        } else {
            invoice_str += `<br>Your invoice was mailed to ${user_email}`;
        }
        response.send(invoice_str);
      });
});

app.post('/logout', function (request, response) { 
    request.session.destroy(); 
    response.clearCookie("username");
    response.clearCookie("email");
    response.redirect('/index.html');

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
    return returnErrors ? errors : (errors.length === 0);
}
//checkQuantityTextbox function from Lab 12 which checks for invalid quantities entered into product textbox
function checkQuantityTextbox(theTextbox) {
    errors = isNonNegInteger(theTextbox.value, true);
    if (errors.length === 0) errors = ['You want:']; //If there's no errors, replace "Quantity" with "You want:" text
    if (theTextbox.value.trim() === '') errs = ['Quantity'];
    document.getElementById(theTextbox.name + '_label').innerHTML = errs.join(" "); // Show errors if there's invalid quantities 
}

app.use(express.static('./public')); // Searches for files in "public"
app.listen(8080, () => console.log(`listening on port 8080`)); // Listens for requests on port 8080