/**
 * @file
 * Global utilities.
 *
 */
(function ($, Drupal, once) {
  Drupal.behaviors.faq = {
    attach(context, settings) {
      once('faqSearch', 'html', context).forEach((element) => {
        const inputElem = $('.js-form-item-search input');
        /**
         * The clearButtonShow function adds a clear button to an
         * input field when there is text input,
         * and removes it when the input is empty.
         */
        function clearButtonShow(inputElement) {
          const $parent = inputElement.parent('.js-form-item-search');
          if (inputElement.val().trim() !== '') {
            if ($parent.find('.clear-button').length === 0) {
              const clearButton = $('<div class="clear-button"></div>');
              $parent.append(clearButton);

              clearButton.on('click', function () {
                $(this).siblings('input').val('');
                $(this).remove();
              });
            }
          } else {
            $parent.find('.clear-button').remove();
          }
        }
        clearButtonShow(inputElem);
        inputElem.on('input', () => {
          clearButtonShow(inputElem);
        });
        /* This code snippet is used for implementing a scroll to section
        functionality on search. */
        $(document).ready(() => {
          const currentUrl = new URL(window.location.href);
          if (currentUrl.search.includes('search')) {
            $('html, body').animate({
              scrollTop: $('#views-exposed-form-faq-page-page-1').offset().top - 200,
            }, 500);
          }
        });
      });
    },
  };
}(jQuery, Drupal, once));
