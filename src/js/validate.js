$(document).ready(function(){
  ////////////////
  // FORM VALIDATIONS
  ////////////////

  // jQuery validate plugin
  // https://jqueryvalidation.org


  // GENERIC FUNCTIONS
  ////////////////////

  var validateErrorPlacement = function(error, element) {
    error.addClass('ui-input__validation');
    error.appendTo(element.parent("div"));
  }
  var validateHighlight = function(element) {
    $(element).addClass("has-error");
  }
  var validateUnhighlight = function(element) {
    $(element).removeClass("has-error");
  }
  var validateSubmitHandler = function(form) {
    $(form).addClass('loading');
    $.ajax({
      type: "POST",
      url: $(form).attr('action'),
      data: $(form).serialize(),
      success: function(response) {
        $(form).removeClass('loading');
        var data = $.parseJSON(response);
        if (data.status == 'success') {
          // do something I can't test
        } else {
            $(form).find('[data-error]').html(data.message).show();
        }
      }
    });
  }

  var validatePhone = {
    required: true,
    normalizer: function(value) {
        var PHONE_MASK = '+X (XXX) XXX-XXXX';
        if (!value || value === PHONE_MASK) {
            return value;
        } else {
            return value.replace(/[^\d]/g, '');
        }
    },
    minlength: 11,
    digits: true
  }

  ////////
  // FORMS


  /////////////////////
  // REGISTRATION FORM
  ////////////////////
  $("[js-validate-offer]").validate({
    errorPlacement: function(){
      return false
    },
    highlight: validateHighlight,
    unhighlight: validateUnhighlight,
    submitHandler: function(form) {
      $(form).addClass('is-loading');

      setTimeout(function(){
        // remove is-ok class for error in prodcution
        $(form).removeClass('is-loading');
        $(form).parent().addClass('is-ok');
        // remove is-ok class for error in prodcution
      }, 350);

      // // ajax posting for production
      // $.ajax({
      //   type: "POST",
      //   url: $(form).attr('action'),
      //   data: $(form).serialize(),
      //   success: function(response) {
      //     $(form).removeClass('loading');
      //     var data = $.parseJSON(response);
      //     if (data.status == 'success') {
      //       // do something I can't test
      //       $(form).removeClass('is-loading');
      //       $(form).parent().addClass('is-ok');
      //     } else {
      //       // $(form).find('[data-error]').html(data.message).show();
      //     }
      //   }
      // });
    },
    rules: {
      email: {
        required: true,
        email: true
      },
    },
    messages: {
      email: {
          required: "Заполните это поле",
          email: "Email содержит неправильный формат"
      },
    }
  });

});
