/**
 * @file
 * Global utilities.
 *
 */
(function ($, Drupal) {
  Drupal.behaviors.spotlight = {
    attach(context, settings) {
      const $newsSlider = $(
        '.block-views-blocknews-view-block-latest-news .view-content',
      );
      const $eventsSlider = $(
        '.block-views-blockevents-view-block-latest-events .view-content',
      );
      // slider options set as objects
      const newsObj = {
        slidesToShow: '',
      };
      const eventsObj = {
        slidesToShow: '',
        vertical: '',
      };
      const itemCount = $(
        '.spotlight .field--name-field-latest-content',
      ).children().length;
      newsObj.slidesToShow = itemCount > 1 ? 2 : 3;
      eventsObj.slidesToShow = itemCount > 1 ? 2 : 3;
      eventsObj.vertical = itemCount > 1;

      // if news block is present
      if ($newsSlider.length > 0) {
        // Slick slider initialization.
        $newsSlider.not('.slick-initialized').slick({
          dots: true,
          slidesToShow: newsObj.slidesToShow,
          slidesToScroll: 1,
          infinite: false,
          responsive: [
            {
              breakpoint: 992,
              settings: {
                slidesToShow: newsObj.slidesToShow - 1,
                slidesToScroll: 1,
                autoplay: true,
                autoplayspeed: 2000,
                infinite: true,
              },
            },
            {
              breakpoint: 576,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                dots: false,
                autoplay: true,
                autoplayspeed: 2000,
                infinite: true,
              },
            },
          ],
        });

        if ($newsSlider.children('.slick-dots').children().length === 1) {
          $newsSlider.children('.slick-dots').hide();
        }

        /*
        * Calculate the maxHeight of the news card and divide it by 2
        * to distribute between event cards. Minus 12 for gap on each.
        */
        const heights = $newsSlider
          .find('.latest-news-card')
          .map(function () {
            return $(this).height();
          })
          .get();

        const maxHeight = Math.max.apply(null, heights);
        $eventsSlider.find('.latest-events-card').each(function () {
          $(this).css({ height: Math.floor(maxHeight / 2 - 12) });
        });
      }

      // if events block is present
      if ($eventsSlider.length > 0) {
        // Slick slider initialization.
        $eventsSlider.not('.slick-initialized').slick({
          dots: true,
          slidesToShow: eventsObj.slidesToShow,
          slidesToScroll: 1,
          infinite: false,
          vertical: eventsObj.vertical,
          verticalSwiping: eventsObj.vertical,
          responsive: [
            {
              breakpoint: 992,
              settings: {
                slidesToShow: eventsObj.vertical
                  ? eventsObj.slidesToShow
                  : eventsObj.vertical - 1,
                autoplay: true,
                autoplayspeed: 2000,
                infinite: true,
              },
            },
            {
              breakpoint: 576,
              settings: {
                dots: false,
                slidesToShow: 1,
                slidesToScroll: 1,
                autoplay: true,
                autoplayspeed: 2000,
                infinite: true,
                vertical: false,
                verticalSwiping: false,
              },
            },
          ],
        });

        if ($eventsSlider.children('.slick-dots').children().length === 1) {
          $eventsSlider.children('.slick-dots').hide();
        }
      }
    },
  };
}(jQuery, Drupal));
