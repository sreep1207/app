/**
 * @file
 * Global utilities.
 *
 */
(function ($, Drupal) {
  Drupal.behaviors.general = {
    attach(context, settings) {
      $('#go-top').on('click', () => {
        $(window).scrollTop(0);
      });

      const $parentElement = $('.block-views-blockbanner-block-1');
      const pseudoElementWidth = 30;
      const pseudoElementHeight = 30;
      const pseudoElementBottomOffset = 60;

      /* This funstion is used for implementing a scroll down  to section
      functionality on clicking on the scroller icon. */
      $parentElement.on('click', (event) => {
        const parentOffset = $parentElement.offset();
        const parentWidth = $parentElement.outerWidth();
        const parentHeight = $parentElement.outerHeight();
        const pseudoElementCenterX = parentOffset.left + parentWidth / 2;
        const pseudoElementBottomY = parentOffset.top + parentHeight - pseudoElementBottomOffset;
        const pseudoElementTopY = pseudoElementBottomY - pseudoElementHeight;
        const clickX = event.pageX;
        const clickY = event.pageY;

        if (clickX >= pseudoElementCenterX - pseudoElementWidth / 2 &&
          clickX <= pseudoElementCenterX + pseudoElementWidth / 2 &&
          clickY >= pseudoElementTopY &&
          clickY <= pseudoElementBottomY) {
          $('html, body').animate({
            scrollTop: $('#main-wrapper').offset().top - 150,
          }, 50);
          event.stopPropagation();
        }
      });

      $('.scroller').on('click', () => {
        $('html, body').animate({
          scrollTop: $('#main-wrapper').offset().top - 150,
        }, 50);
      });
    },
  };
}(jQuery, Drupal));
