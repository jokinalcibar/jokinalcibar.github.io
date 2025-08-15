<?php
// Headers must be at the very top, before any output
header("Access-Control-Allow-Origin: https://jokinalcibar.github.io");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: X-Requested-With, Content-Type");
header("Content-Type: application/json"); // Ensure JSON response

// The receiving email address
$receiving_email_address = 'jokinaltzibar@gmail.com';

// SMTP Configuration (REQUIRED for InfinityFree)
$smtp_config = array(
    'host' => 'smtp.gmail.com',
    'username' => 'your-email@gmail.com', // Your Gmail
    'password' => 'your-app-password',   // Gmail App Password
    'port' => '587',
    'encryption' => 'tls'
);

// Load the PHP Email Form library
if (file_exists($php_email_form = './php-email-form.php')) {
    include($php_email_form);
} else {
    die(json_encode(['status' => 'error', 'message' => 'Library not found']));
}

try {
    $contact = new PHP_Email_Form;
    $contact->ajax = true;
    $contact->smtp = $smtp_config; // Use SMTP
    
    $contact->to = $receiving_email_address;
    $contact->from_name = filter_var($_POST['name'], FILTER_SANITIZE_STRING);
    $contact->from_email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    $contact->subject = filter_var($_POST['subject'], FILTER_SANITIZE_STRING);
    
    $contact->add_message($contact->from_name, 'From');
    $contact->add_message($contact->from_email, 'Email');
    $contact->add_message(filter_var($_POST['message'], FILTER_SANITIZE_STRING), 'Message', 10);
    
    $result = $contact->send();
    
    if ($result === 'OK') {
        echo json_encode(['status' => 'success', 'message' => 'Message sent successfully!']);
    } else {
        throw new Exception($result ?: 'Unknown error occurred');
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>