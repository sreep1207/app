/**
 * @file
 * Global utilities.
 *
 */
(function ($, Drupal) {
  Drupal.behaviors.apply_job_form = {
    attach: (context, settings) => {
      // Function to update label position based on the input value
      const updateLabelPosition = (input) => {
        const $input = $(input);
        const $label = $(`label[for="${$input.attr('id')}"]`);
        if ($input.is(':checkbox, :file') || $label.closest('.js-form-managed-file').length || $label.closest('.js-form-item-captcha-response').length) {
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
        const $invalidFeedback = $input.closest('.js-form-item').find('.invalid-feedback');
        const $alertDanger = $input.closest('.js-form-item .fieldset-wrapper').find('.alert-danger');

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
        const $invalidFeedback = $input.closest('.js-form-item').find('.invalid-feedback');
        const $alertDanger = $input.closest('.webform-submission-apply-job-form .js-form-item .fieldset-wrapper').find('.alert-danger');

        if ($invalidFeedback.length) {
          $invalidFeedback.show();
        }
        if ($alertDanger.length) {
          $alertDanger.show();
        }
      };

      // This function is used for removing required asterik conditionally.
      function asterikRemove(parent, scope) {
        const $selectContainer = parent;
        if (scope.value !== '') {
          $selectContainer.addClass('option-selected');
        } else {
          $selectContainer.removeClass('option-selected');
        }
      }

      // Binding events to inputs and textareas
      const bindEvents = (scope) => {
        $('.webform-submission-apply-job-form .js-form-item input, .webform-submission-apply-job-form .js-form-item textarea', scope).each((index, element) => {
          if ($(element).attr('type') === 'checkbox') {
            return;
          }
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

      // Binding events to select elements.
      const bindSelectEvents = (scope) => {
        $('.webform-submission-apply-job-form .form-item-select-profile select', scope).each((index, element) => {
          asterikRemove($('.form-item-select-profile'), element);
          $(element).on('change', () => {
            asterikRemove($('.form-item-select-profile'), element);
            const isFilled = $(element).val().trim() !== '';
            if (isFilled) {
              hideErrorMessage(element);
            } else {
              showErrorMessage(element);
            }
          });
        });
        $('.webform-submission-apply-job-form .form-item-years-of-experience select', scope).each((index, element) => {
          asterikRemove($('.form-item-years-of-experience'), element);
          $(element).on('change', () => {
            asterikRemove($('.form-item-years-of-experience'), element);
            const isFilled = $(element).val().trim() !== '';
            if (isFilled) {
              hideErrorMessage(element);
            } else {
              showErrorMessage(element);
            }
          });
        });
      };

      // Binding events to checkboxes.
      const bindCheckboxEvents = (scope) => {
        $('.webform-submission-apply-job-form .js-webform-type-checkboxes .js-webform-checkboxes .js-form-type-checkbox input', scope).each((index, element) => {
          $(element).on('change', () => {
            const isChecked = $(element).is(':checked');
            if (isChecked) {
              hideErrorMessage(element);
            } else {
              showErrorMessage(element);
            }
          });
        });
      };
      bindEvents(context);
      bindSelectEvents(context);
      bindCheckboxEvents(context);
      $(document).ajaxComplete((event, xhr) => {
        bindEvents(context);
        bindSelectEvents(context);
        bindCheckboxEvents(context);
        if ($('.webform-confirmation__message:contains("Thank you for submission")').length) {
          $('.apply-job-wrapper .field--name-field-job-background-image').css('display', 'none');
        } else {
          $('.apply-job-wrapper .field--name-field-job-background-image').css('display', 'block');
        }
      });

      // Ensuring labels are updated when the form is submitted
      $('.webform-submission-apply-job-form', context).on('submit', () => {
        $(this).find('input, textarea').each((index, element) => {
          updateLabelPosition(element);
        });
        $(this).find('select').each((index, element) => {
          asterikRemove($(element).closest('.js-form-item'), element);
        });
      });
    },
  };
}(jQuery, Drupal));
