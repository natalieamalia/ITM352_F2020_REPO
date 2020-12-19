// This functions.js page was copied from Assignment 3 code examples. It serves as a page for loading functions into my web application in order to load ./products.js data directly.
function loadJSON(service, callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('POST', service, false);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

// This function makes a navigation bar from a products_data object
function nav_bar(this_store_products, products_data) {
    // This makes a navigation bar to other product pages
    for (products_key in products_data) {
        if (products_key == this_store_products) continue;
        document.write(`<a href='./display_products.html?products_key=${products_key}'>${products_key}<a>&nbsp&nbsp&nbsp;`);
    }
}

function get_cookie(name) { //this function returns value from a cookie that was sent
    var name = cookiename + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == '') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
        return "";
        }