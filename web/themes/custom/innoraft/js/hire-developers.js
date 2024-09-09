/**
 * @file
 * Global utilities.
 *
 */
(function ($, Drupal) {
  Drupal.behaviors.hire_developers = {
    attach(context, settings) {
      $(window).on('scroll', () => {
        // calculate the starting position of the section
        const offset = $('.hire-developers').offset().top;
        const position = Math.round((window.scrollY - offset) * 0.25);
        // calculate scroll position and stop translation at bottom
        if (position < 0) {
          $('.hire-developers .bg-image').css({ bottom: `${position}px` });
          $('.hire-developers .ring').css({ bottom: `${position * 0.5}%` });
        }
      });
    },
  };
}(jQuery, Drupal));
