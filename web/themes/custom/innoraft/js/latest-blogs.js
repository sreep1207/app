/**
 * @file
 * Global utilities.
 *
 */
(function ($, Drupal) {
  Drupal.behaviors.latest_blogs = {
    attach(context, settings) {
      // Slick slider initialization.
      $('.block-views-blockblogs-block-1 .view-content').not('.slick-initialized').slick({
        dots: false,
        slidesToShow: 3,
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
            breakpoint: 768,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              autoplay: true,
              autoplayspeed: 2000,
              infinite: true,
            },
          },
        ],
      });
    },
  };
}(jQuery, Drupal));
