/**
 * @file
 * Global utilities.
 *
 */
(function ($, Drupal) {
  Drupal.behaviors.client_testimonial = {
    attach(context, settings) {
      // Checking the number of images with class testimonial-slide-image
      const imageCount = $('.client-testimonial .testimonial-slide-image img').length;
      if (imageCount > 1) {
        $('.testimonial-slide-image').removeClass('testimonial-slide-one');
        // slick slider initialization.
        // controlling slider syncing
        $('.client-testimonial .testimonial-slider-nav--inner').not('.slick-initialized').slick({
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: true,
          autoplay: true,
          autoplaySpeed: 5000,
          pauseOnHover: false,
          fade: true,
          dots: true,
          draggable: false,
          infinite: true,
          easing: 'easeOutElastic',
          cssEase: 'ease-out',
          asNavFor: '.client-testimonial .testimonial-slider-for',
        });
        $('.client-testimonial .testimonial-slider-for').not('.slick-initialized').slick({
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          asNavFor: '.client-testimonial .testimonial-slider-nav--inner',
          dots: false,
          draggable: false,
          infinite: false,
          easing: 'easeOutElastic',
          cssEase: 'ease-out',
          focusOnSelect: true,
          variableWidth: true,
          responsive: [
            {
              breakpoint: 1200,
              settings: {
                variableWidth: false,
              },
            },
          ],
        });
      } else {
        // Hiding the element with class slick-list if only one content present.
        $('.slick-dots').removeClass('slick-active');
        $('.testimonial-slide-image').addClass('testimonial-slide-one');
      }

      /**
       * This fucntioon is used to play and pause the autoplay of slides
       * based on modal open and close states, and alters style on resize.
       */
      once('lityPlayPause', 'html', context).forEach((element) => {
        $('.read-more-btn').on('click', () => {
          setTimeout(() => {
            $('.popup-content').removeAttr('style');
          }, 100);
        });
        $(document).on('lity:open', () => {
          $('.client-testimonial .testimonial-slider-nav--inner').slick('slickPause');
        });
        $(document).on('lity:close', () => {
          $('.client-testimonial .testimonial-slider-nav--inner').slick('slickPause');
          setTimeout(() => {
            $('.client-testimonial .testimonial-slider-nav--inner').slick('slickPlay');
          }, 50);
        });
        $(document).on('lity:resize', () => {
          $('.popup-content').removeAttr('style');
        });
      });

      // Toggle autoplay on moseenter and mouseleave on the slider buttons.
      $('.slick-prev').mouseenter(() => {
        $('.client-testimonial .testimonial-slider-nav--inner').slick('slickPause');
      });
      $('.slick-next').mouseenter(() => {
        $('.client-testimonial .testimonial-slider-nav--inner').slick('slickPause');
      });
      $('.slick-prev').mouseleave(() => {
        $('.client-testimonial .testimonial-slider-nav--inner').slick('slickPlay');
      });
      $('.slick-next').mouseleave(() => {
        $('.client-testimonial .testimonial-slider-nav--inner').slick('slickPlay');
      });
    },
  };
}(jQuery, Drupal));
