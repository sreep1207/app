/**
 * @file
 * Global utilities.
 *
 */
(function ($, Drupal) {
  Drupal.behaviors.our_journey = {
    attach(context, settings) {
      let a = 0; // flag to check once trigger
      $(window).on('scroll', () => {
        // calculate the starting position of the section
        const offset = $('.our-journey').offset().top;
        const position = Math.round((window.scrollY - offset) * 0.25);
        // calculate scroll position and stop translation at bottom
        if (position < 0) {
          $('.our-journey .journey-image').css({ bottom: `${position}px` });
          $('.our-journey .ring').css({ bottom: `${position * 0.5}%` });
        }

        // count up the numbers when section reached viewport top
        const oTop = offset - window.innerHeight;
        if (a === 0 && $(window).scrollTop() > oTop) {
          $('.digits').each(function () {
            const $this = $(this);
            const countTo = $this.attr('data-count');
            $({
              countNum: $this.text(),
            }).animate(
              {
                countNum: countTo,
              },
              {
                duration: 2000,
                easing: 'swing',
                step() {
                  $this.text(Math.floor(this.countNum));
                },
                complete() {
                  $this.text(this.countNum);
                },
              },
            );
          });
          a = 1;
        }
      });
    },
  };
}(jQuery, Drupal));
