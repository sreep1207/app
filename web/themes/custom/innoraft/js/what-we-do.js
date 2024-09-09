/**
 * @file
 * Global utilities.
 *
 */
(function ($, Drupal) {
  Drupal.behaviors.adjustWidth = {
    attach(context, settings) {
      const $blocks = $('.services-what-we-do .row .col-12');
      if ($blocks.length > 7) {
        $blocks.first().removeClass('col-xl-5').addClass('col-xl-9');
      }
    },
  };
}(jQuery, Drupal));
