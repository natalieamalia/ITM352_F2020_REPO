//Natalie's Assignment 3 server
//Code for server copied from Assignment 2 which used code from Lab 13, Lab 15, and code that was provided by Professor Port during office hour meetings and workshops.

var session = require('express-session');
var express = require('express'); //Server requires express to run//
var cookieParser = require('cookie-parser');
var app = express (); // loads express into variable "app" and runs the express function
var myParser = require("body-parser"); // loads body-parser module into variable "myParser"
const querystring = require('querystring'); // loads querystring 
var fs = require('fs'); //loads the file system into variable fs
var products_data = require('./public/products.js'); //Sets ./products.js data into a variable called data and loads product data
const user_data_filename = 'user_data.json'; 
const nodemailer = require("nodemailer");

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

app.get("/login", function (request, response){ //responds with cookie, copied from Lab 15
        response.cookie('username', 'Natalie', {maxAge: 1000*1000}).send('cookie set!'); //Sets login username, sends cookie and cookie expiration time, copied from Lab 15
    });
app.get("/logout", function (request, response){ //responds with cookie, copied from Lab 15
        username = request.cookies.username; //identifies username of who is being logged out
        response.clearCookie('username').send(`logged out ${username}`); //clears cookie upon logout
    });

// Copied from Assignment 2 ITM 352 Workshop with Jojo's example
// //This takes the login info from login_form on user_login.html and checks if the user exists in user_data.json. If they do and password is correct, the user is redirected to the invoice. 
if (typeof users_data[request.body.username] != 'undefined') { //if username exists in userdata.json retrieve their data
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
      response.cookie('username', POST.username);
      alertstr = `<script> alert("Successful login!");
                    window.history.back() </script>`; //sends an alert
        response.send(alertstr);


    } else { //if the password does not match 
        response.send(`The password ${request.body.password} doesn't match your account information.`);
    }
} else { //if the user data is not available and does not exist
response.send(`This ${user_data_filename} user does not exist`); //reports 'does not exist!' message in console if file does not exist
//redirects to invoice.html upon successful login and redirects to order page producs_display.html login is unsuccessful 
}
});

app.post("/process_registration", function (request, response) { //processes successful registration data
    let POST = request.body;
    var errors = [];

//username validation processes a user's registration info and checks if it is valid, if data is valid it redirects user from registration to invoice
if (typeof users_data[request.body.newuser.toLowerCase] != 'undefined') { // sends error if username already exists in user_data.json
    errors.push("Sorry, username already exists.");
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
//if function is executed when there are no errors in user registration data validation from functions above
if (errors.length === 0) { 
    console.log('none');
    request.query.username = reguser; //registers user if there are no errors
    request.query.name = req.body.name;
    response.redirect('/cart.html?' + querystring.stringify(req.query)); // redirects user to cart upon successful registration
} 
//if function is executed when there are no errors in user registration data validation from functions above and stores data in usrr_data.json
if (errors.length === 0) {
    let POST = request.body;
    username = POST['newuser']; //stores new user info
    users_reg_data[username] = {};
    users_reg_data[username].name = POST['newfullname']; //stores new user's full name
    users_reg_data[username].password = POST['newpass']; //stores user's new password
    users_reg_data[username].email = POST['newemail']; //stores users new email
  reg_info_str = JSON.stringify(  users_reg_data); //stringifies and stores new user data in reg_info_str string
  fs.writeFileSync(user_data_filename, reg_info_str, "utf-8");//stores reg_info_string into file
  query_string_object = request.query;
      query_string_object["username"] = username; //gets username
      console.log(request);
      response.redirect("./cart.html"); //redirects user to cart 
} else {

  response.redirect("./registration.html"); //redirects user back to registration form
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
    POST = request.body;
    var transporter = nodemailer.createTransport({
        host: "mail.hawaii.edu", //mailer
        port: 25,
        secure: false,
        tls: {
          rejectUnauthorized: false
        }
      });
    
      var user_email = 'na23@hawaii.edu';
      var mailOptions = {
        from: 'na23@hawaii.edu',
        to: user_email,
        subject: 'Your Invoice from Natalies Surf Co.',
        html: POST
      };
    
      transporter.sendMail(mailOptions, function(error){ //does not send email of invoice if there are errors
        if (error) {
          POST += '<br>There was an error with processing your order and your invoice could not be emailed.';
        } else {
          POST += `<br>Your order invoice has been mailed to ${user_email}`; //sends email of invoice
        }
        response.send(POST);
      });

});

app.post("/login_success", function (request, response) {
    //When the user logs in successfully and clicks "add to cart" app.post will add the quantity data to the session object. Code copied with the help of Kyle Dean-Kobatake.
    var POST = request.body;
    console.log(POST);
    //if quantity data is valid it is added to session, otherwise an error is returned
    has_errors = false;

    if (has_errors === false) {
        if (typeof request.session.cart == 'undefined') {
            request.session.cart = {};
        }
        if (typeof request.session.cart[POST.product_key] == 'undefined') {
            request.session.cart[POST.product_key] = [];
        }
        request.session.cart[POST.product_key][POST.product_index] = Number.parseInt(POST.quantity);
        response_msg = `Added ${POST.quantity} to your cart!`;
    }
    response_msg = `Added ${POST.quantity} to your cart!`;
    console.log(request.session);
    response.json({"message":response_msg});
    
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