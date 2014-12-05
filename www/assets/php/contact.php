<?php

    $email_to = 'your email';
    $email_from = $_POST['email'];
    $subject = $_POST['name'].' sent you a message from your website';
    $message = $_POST['message'];

    sendEmail($email_to, $email_from, $subject, $message);

    function sendEmail($email_to, $email_from, $subject, $message){
        $headers = "Content-type: text/html; charset=utf-8"."\r\n";
        $headers .= "MIME-Version: 1.1"."\r\n";
        $headers .= "From:".$email_from."\r\n"
                           ."Reply-To:".$email_from;

        mail($email_to, $subject, $message, $headers);
    }

?>
