/**
 * This function adds a 'scroll to section' functionality on sort of the search results.
 */
(function ($, Drupal, once) {
  Drupal.behaviors.solr_search_scroll = {
    attach(context, settings) {
      once('scrollSection', 'html', context).forEach((element) => {
        $(document).ready(() => {
          const currentUrl = window.location.href;
          if (currentUrl.includes('search')) {
            $('html, body').animate({
              scrollTop: $('.search-filters').offset().top - 200,
            }, 500);
          }
        });
      });
    },
  };
}(jQuery, Drupal, once));
