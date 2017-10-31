<?php
  $errors         = array();      // array to hold validation errors
  $data           = array();      // array to pass back data
  // validate the variables ======================================================
  // if any of these variables don't exist, add an error to our $errors array
  if (empty($_POST['name']))
      $errors['message'] = 'Name is required.';
  if (empty($_POST['email']))
      $errors['email'] = 'Email is required.';

  // return a response ===========================================================
  // if there are any errors in our errors array, return a success boolean of false
  if ( ! empty($errors)) {
    // if there are items in our errors array, return those errors
    $data['success'] = false;
    $data['errors']  = $errors;
  } else {
    $email_to = "sales@laboratoriacoffee.ru";
    $email_subject = "Запрос на прайс с сайта Лаборатория кофе";
    $email_message = "Запрос на прайс с сайта.\n\n";
    function clean_string($string) {
      $bad = array("content-type","bcc:","to:","cc:","href");
      return str_replace($bad,"",$string);
    }
    $email_message .= "Имя: ".clean_string($_POST['name'])."\n";
    $email_message .= "Email: ".clean_string($_POST['email'])."\n";
    $headers = 'From: '.$email_from."\r\n".
    'Reply-To: '.$email_from."\r\n" .
    'X-Mailer: PHP/' . phpversion();
    @mail($email_to, $email_subject, $email_message, $headers);
    // show a message of success and provide a true success variable
    $data['success'] = true;
    $data['message'] = 'Thank you!';
  }
  // return all our data to an AJAX call
  echo json_encode($data);
