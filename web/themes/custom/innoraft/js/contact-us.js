/**
 * @file
 * Global utilities.
 *
 */
(function ($, Drupal) {
  Drupal.behaviors.contact_us_form = {
    attach: (context, settings) => {
      // Function to update label position based on the input value
      const updateLabelPosition = (input) => {
        const $input = $(input);
        const $label = $(`label[for="${$input.attr('id')}"]`);
        if ($label.closest('.js-form-item-captcha-response').length) {
          return;
        }
        const isFilled = $input.val().trim() !== '';
        let transformValue;
        if ($input.is('textarea')) {
          const inputHeight = $input.outerHeight();
          transformValue = isFilled || $input.is(':focus') ? `translateY(-${inputHeight - 9}px)` : 'translateY(0%)';
        } else {
          transformValue = isFilled || $input.is(':focus') ? 'translateY(-175%)' : 'translateY(0%)';
        }
        $label.css({
          transform: transformValue,
          'font-size': isFilled ? '12px' : '',
        });
      };

      // Function to hide error messages
      const hideErrorMessage = (input) => {
        const $input = $(input);
        const $invalidFeedback = $input.siblings('.invalid-feedback');
        const $alertDanger = $input.siblings('.alert-danger');

        if ($invalidFeedback.length) {
          $invalidFeedback.hide();
        }
        if ($alertDanger.length) {
          $alertDanger.hide();
        }
      };

      // Function to show error messages
      const showErrorMessage = (input) => {
        const $input = $(input);
        const $invalidFeedback = $input.siblings('.invalid-feedback');
        const $alertDanger = $input.siblings('.alert-danger');

        if ($invalidFeedback.length) {
          $invalidFeedback.show();
        }
        if ($alertDanger.length) {
          $alertDanger.show();
        }
      };

      // Binding events to inputs and textareas
      const bindEvents = (scope) => {
        $('.webform-submission-contact-us-form-form .js-form-item input, .webform-submission-contact-us-form-form .js-form-item textarea', scope).each((index, element) => {
          updateLabelPosition(element);
          $(element).on('focus keyup focusout blur', () => {
            updateLabelPosition(element);
            const isFilled = $(element).val().trim() !== '';
            if (isFilled) {
              hideErrorMessage(element);
            } else {
              showErrorMessage(element);
            }
          });
        });
      };

      bindEvents(context);

      // Re-triggering events on successfull submission.
      $(document).ajaxComplete(() => {
        $('.webform-submission-contact-us-form-form .js-form-item input, .webform-submission-contact-us-form-form .js-form-item textarea', context).each((index, element) => {
          updateLabelPosition(element);
          bindEvents(context);
        });
      });

      // Ensuring labels are updated when the form is submitted
      $('.webform-submission-contact-us-form-form', context).on('submit', () => {
        $(this).find('input, textarea').each((index, element) => {
          updateLabelPosition(element);
        });
      });
    },
  };
}(jQuery, Drupal));
