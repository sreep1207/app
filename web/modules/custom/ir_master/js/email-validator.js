(function ($) {
  Drupal.behaviors.emailValidator = {
    attach: function (context, settings) {
      // Select all input fields with type="email" within the specified context
      $(once('emailValidator', 'input[type="email"]', context)).each(function () {
        var emailField = $(this);
        emailField.closest('form').submit(function(event) {  
          var email = emailField.val();
          console.log(email)
          // Regular expression for email validation
          var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  
          // Checking if the email matches the regular expression
          if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            event.preventDefault();
          } else {
            // If email is valid, submit the form
            event.target.submit();
          }
        });
      });
    }
  };
})(jQuery);
