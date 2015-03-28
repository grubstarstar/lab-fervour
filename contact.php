<?php

define('EMAIL','labfervour@gmail.com');
define('NAME','Richard Garner');

header('Content-Type: application/json');

require("includes/class.phpmailer.php");
			
$first = $_REQUEST['first'];
$last = $_REQUEST['last'];
$org = $_REQUEST['organisation'];
$email = $_REQUEST['email'];
$message = $_REQUEST['message'];

$name = $first . " " . $last;
$subject = "* A message from your website *";
$form_feedback = "Message sent successfully";
$body = "$name from $org has sent you following message:\r\n\r\n" . $message;

try {
	$mail = new PHPMailer(true);
	$mail->Host = "mail.labfervour.com";
	$mail->Port = 25;
	$mail->SetFrom($email, $name);
	$mail->AddAddress(EMAIL, NAME);
	$mail->AddReplyTo($email, $name);
	$mail->Subject = $subject;
	//$mail->AltBody = "To view the message, please use an HTML compatible email viewer!"; // optional, comment out and test
	$mail->MsgHTML($body);
	$mail->Send();
} catch (phpmailerException $e) {
	$form_feedback = trim($e->errorMessage());
} catch (Exception $e) {
	$form_feedback = "Sorry! There was an error sending your message, please try again later";
}

// send the output

echo '{"result":"' . $form_feedback . '"}';

?>