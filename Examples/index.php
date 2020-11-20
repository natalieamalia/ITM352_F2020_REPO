<?php
/* Authors: Christie Mattos and Sheridan Wu
	This page prompts user to log in or to create a new account.  It displays
	the login form so that current users don't have to click on a link to be
	transferred to a log-in page (which would be somewhat of a hassle for them).
	People who are not currently registered, however, are given a link to the
	registration page.
*/

//This includes the array containing all existing users.
include("./all_users.inc");

global $username;
global $password;
global $errors;

// First it checks if someone has tried to log in with their username and password.
if (isset($_POST['submitted'])) {
	//Setting the global variables to posted data to make the form sticky.
	$username = $_POST['username'];
	$password = $_POST['password'];
	//This checks whether the user entered valid login information.
    $errors = validate_login($users);
    /* If the information entered was erroneous, the form redisplays.
    	If the information entered was correct, the user would have already
    	been transferred to the main page and this code would not be reached.
    */
	displayForm();
}

// If user has not yet entered login information, this code executes.
else {
	displayForm();
}

function displayForm(){
	// The following form prompts the person for their username & password.
	?>
	<img src='./bread_basket.gif' height=100 align='left'>
	<br>
	<br>
	<font size='5'><b>The Bread Store</b></font>
	<br>
	<br>
	<br>
	<font size= '4'><b>Log in below using your username and password or <a href='./registration.php'>register for a new account</a>.</b></font>
	<br>
	<br>
	<form action=<?php echo  $_SERVER['PHP_SELF'] ?> method='POST'>
	Enter your username: <input type='text' name='username' value= '<?php echo $GLOBALS['username'] ?>'>
	<?php
	//Prints username errors (if they exist) next to the username textbox.
	if(isset($GLOBALS['errors']['username']))
		echo $GLOBALS['errors']['username'];
	?>
	<br>Enter your password: <input type='password' name='password' value = '<?php echo $GLOBALS['password'] ?>'>
	<?php
	//Print password errors (if they exist) next to the password textbox.
	if(isset($GLOBALS['errors']['password']))
		echo $GLOBALS['errors']['password'];
	?>
	<br><input type='submit' name='submitted' value='Log in'>
	</form>
	<br>
	<?php
}

function validate_login($array) {
	//Gets data from the $_POST array and transfers them into variables.
	$username = $_POST['username'];
	$password = $_POST['password'];
	//Initializing the $user_name found variable with value false
    $username_found = false;
    //This will cycle through all the users in the all_users array.
    for($i = 0; $i < count($array); $i++) {
    	//Changes entered username to a lowercase string since all usernames are stored in lowercase.
        if (strtolower($username) == $array[$i]['username']) {
            //If username is found, $username_found is set to true and the password is tested.
			$username_found = true;
            if ($password == $array[$i]['password']) {
            	//If password is correct, user is transferred to the main page.
                header('Location: ./main.php');
            }
            //If the password doesn't match, this code executes.
			else {
				//A password error is returned.
			   	$errors['password'] = ' Invalid password';
                return $errors;
        	}
		}
    }
    //If user entered a nonexistent username, this would execute.
    if ($username_found == false) {
    	//A username error is returned.
        $errors['username'] = ' Username does not exist.';
		return $errors;
	}
}

?>
