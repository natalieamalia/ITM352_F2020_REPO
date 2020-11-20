<?php
include("./all_users.inc");

global $username;
global $password;
global $errors;

// First it checks if someone has tried to log in with their username and password.
if (isset($_POST['submitted'])) {
	$username = $_POST['username'];
	$password = $_POST['password'];
    $errors = validate_login($users);
	if(count($errors) > 0)
		displayForm();
	else
		header('Location: ./main.php');
}

// If user needs to log in, this code executes.
else {
	displayForm();
}

function displayForm(){
	// The following form prompts the person for their username & password.
	?>
	Log in below using your username and password or <a href='./registration.php'>register for a new account</a>.
	<br>
	<br>
	<form action=<?php echo  $_SERVER['PHP_SELF'] ?> method='POST'>
	Enter your username: <input type='text' name='username' value= '<?php echo $GLOBALS['username'] ?>'>
	<?php
	if(isset($GLOBALS['errors']['username']))
		echo $GLOBALS['errors']['username'];
	?>
	<br>Enter your password: <input type='password' name='password' value = '<?php echo $GLOBALS['password'] ?>'>
	<?php
	if(isset($GLOBALS['errors']['password']))
		echo $GLOBALS['errors']['password'];
	?>
	<br><input type='submit' name='submitted' value='Log in'>
	</form>
	<br>
	<?php
}

function validate_login($array) {
	$username = $_POST['username'];
	$password = $_POST['password'];
    $username_found = false;
    for($i = 0; $i < count($array); $i++) {
        if (strtolower($username) == $array[$i]['username']) {
            $username_found = true;
            if ($password == $array[$i]['password']) {
                header('Location: ./main.php');
                break;
            }
			else {
			   	$errors['password'] = ' Invalid password';
                return $errors;
        	}
		}
    }
    if ($username_found == false) {
        $errors['username'] = ' Username does not exist.';
		return $errors;
	}
}

?>
