/**
 * @file
 * Global utilities.
 *
 */
(function ($, Drupal) {
  Drupal.behaviors.why_choose_us = {
    attach(context, settings) {
      // slick slider initialization
      $('.why-choose-us .why-choose-us-slider').not('.slick-initialized').slick({
        dots: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        infinite: false,
        responsive: [
          {
            breakpoint: 1200,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 992,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 576,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
            },
          },
        ],
      });
    },
  };
}(jQuery, Drupal));
