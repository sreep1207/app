/**
 * @file
 * Global utilities.
 *
 */
(function (Drupal, $, once) {
  Drupal.behaviors.our_portfolio = {
    attach(context, settings) {
      /**
       * The function "detect_active" retrieves the active class from the first child of a slider
       *  and adds the "slick-active" class to the corresponding button in the slider dots.
      */
      const slideLen = $(
        '.our-portfolio-slider .slider-inner .slider-item',
      ).length;
      if (slideLen <= 1) {
        $('.our-portfolio #slider-prev, .our-portfolio #slider-next').hide();
        $('.our-portfolio .progress-bar').hide();
      }
      let currIndex = 0;
      function trackProgress(dir) {
        if (dir === 'next') {
          currIndex = (currIndex + 1) % slideLen;
        } else if (dir === 'prev') {
          currIndex = (currIndex - 1 + slideLen) % slideLen;
        }
        if (currIndex === 0) {
          $('.our-portfolio #slider-prev').addClass('slick-disabled');
        } else {
          $('.our-portfolio #slider-prev').removeClass('slick-disabled');
        }
        if (currIndex === slideLen - 1) {
          $('.our-portfolio #slider-next').addClass('slick-disabled');
        } else {
          $('.our-portfolio #slider-next').removeClass('slick-disabled');
        }
        const currProgress = ((currIndex + 1) / slideLen) * 100;
        $('.our-portfolio .progress-bar .progress-track').css('width', `${currProgress}%`);
      }
      trackProgress();

      /**
       * The function `moveToPrevSlide` moves the last slide
       * to the beginning of the slider and updates the
       * data-position attribute of each slide accordingly.
       */
      function moveToPrevSlide() {
        $('.our-portfolio-slider .slider-inner .slider-item:last-child')
          .hide()
          .prependTo('.our-portfolio-slider .slider-inner')
          .show();
        $.each(
          $('.our-portfolio-slider .slider-item'),
          (index, sliderItem) => {
            $(sliderItem).attr('data-position', index + 1);
          },
        );
        trackProgress('prev');
      }

      /**
       * The function `moveToNextSlide` moves the first slider item
       * to the end of the slider and updates the data-position
       * attribute of each slider item before tracking progress.
       */
      function moveToNextSlide() {
        $('.our-portfolio-slider .slider-inner .slider-item:first-child')
          .hide()
          .appendTo('.our-portfolio-slider .slider-inner')
          .show();
        $.each(
          $('.our-portfolio-slider .slider-item'),
          (index, sliderItem) => {
            $(sliderItem).attr('data-position', index + 1);
          },
        );
        trackProgress('next');
      }

      /**
       *  The code is binding a click event to the element with
       *  the ID "slider-next". When this element is clicked,
       *  the code will execute the following actions:
       */
      $(once('bind-click-next', '.our-portfolio #slider-next', context)).click(
        () => {
          moveToNextSlide();
        },
      );

      /**
       * The code is binding a click event to the element
       * with the ID "slider-prev". When this element is clicked,
       * update the slide number, push slide back.
       */
      $(once('bind-click-prev', '.our-portfolio #slider-prev', context)).click(
        () => {
          moveToPrevSlide();
        },
      );

      /**
       * The code is used for implementing autoplay on the slides
       * and controlling autoplay behaviour.
       */
      once('autoPlaySlides', 'html', context).forEach((element) => {
        let autoplayInterval;
        function startAutoplay() {
          autoplayInterval = setInterval(() => {
            moveToNextSlide();
          }, 5000);
        }

        function stopAutoplay() {
          clearInterval(autoplayInterval);
        }

        // Start autoplay when page is loaded
        startAutoplay();

        // Pause autoplay when mouse enters the slider area or button.
        $('.our-portfolio-slider').mouseenter(() => {
          stopAutoplay();
        });
        $('.slick-prev').mouseenter(() => {
          stopAutoplay();
        });
        $('.slick-next').mouseenter(() => {
          stopAutoplay();
        });
        // Resume autoplay when mouse leaves the slider area or button.
        $('.our-portfolio-slider').mouseleave(() => {
          startAutoplay();
        });
        $('.slick-prev').mouseleave(() => {
          startAutoplay();
        });
        $('.slick-next').mouseleave(() => {
          startAutoplay();
        });
      });
    },
  };
}(Drupal, jQuery, once));
