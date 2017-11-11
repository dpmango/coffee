<?php
  $errors         = array();      // array to hold validation errors
  $data           = array();      // array to pass back data
  // validate the variables ======================================================
  // if any of these variables don't exist, add an error to our $errors array
  if (empty($_POST['phone']))
      $errors['phone'] = 'Phone is required.';

  // return a response ===========================================================
  // if there are any errors in our errors array, return a success boolean of false
  if ( ! empty($errors)) {
    // if there are items in our errors array, return those errors
    $data['success'] = false;
    $data['errors']  = $errors;
  } else {
    $email_to = "sales@laboratoriacoffee.ru";
    $email_subject = "Заказ на звонок с сайта Лаборатория кофе";
    $email_message = "Заказ на звонок с сайта Лаборатория кофе\n\n";
    function clean_string($string) {
      $bad = array("content-type","bcc:","to:","cc:","href");
      return str_replace($bad,"",$string);
    }
    $email_message .= "Телефон: ".clean_string($_POST['phone'])."\n";
    $headers = 'From: '.$email_from."\r\n".
    'Reply-To: '.$email_from."\r\n" .
    'X-Mailer: PHP/' . phpversion();
    @mail($email_to, $email_subject, $email_message, $headers);
    // show a message of success and provide a true success variable
    $data['success'] = true;
    $data['message'] = 'Спасибо!';
  }
  // return all our data to an AJAX call
  echo json_encode($data);
