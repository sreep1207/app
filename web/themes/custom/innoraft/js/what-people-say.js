/**
 * @file
 * Global utilities.
 *
 */
(function ($, Drupal) {
  Drupal.behaviors.what_people_say = {
    attach(context, settings) {
      if ($('.field--name-field-client', context).length) {
        $('.field--name-field-client', context).slick({
          dots: true,
          infinite: false,
        });
      }
      const readMoreItems = $('.field--name-field-client-description.field__item', context);
      readMoreItems.each(function () {
        const $this = $(this);
        const fullText = $this.text();
        const wordLimit = 50;
        const words = fullText.split(' ');
        if (words.length > wordLimit) {
          const shownText = `${words.slice(0, wordLimit).join(' ')}...`;
          const hiddenText = words.slice(wordLimit).join(' ');
          $this.html(`${shownText}<a href="#" class="read-more">Read More</a><span class="more-text" style="display:none;">${hiddenText}</span>`);
          $this.on('click', '.read-more', function (e) {
            e.preventDefault();
            $(this).siblings('.more-text').show();
            $(this).remove();
          });
        }
      });
    },
  };
}(jQuery, Drupal));
