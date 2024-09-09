(function ($, Drupal) {
  Drupal.behaviors.expandFaq = {
    attach: function (context, settings) {
      once('faqExpand', 'html', context).forEach((element) => {
        $(document).ready(function () {
          var faqNodeId = localStorage.getItem('faqNodeId');
          var faqNodeIdToExpand = localStorage.getItem('faqNodeIdToExpand');
          var redirectingFromSearch = localStorage.getItem('redirectingFromSearch');
          var nodeIds = drupalSettings.faq_node_ids;
          var itemsPerPage = drupalSettings.items_per_page;

          if (faqNodeId && !faqNodeIdToExpand && redirectingFromSearch === 'true') {
            var searchElementIndex = $.inArray(faqNodeId, nodeIds);
            if (searchElementIndex !== -1) {
              var pageIndex = Math.floor(searchElementIndex / itemsPerPage);
              localStorage.setItem('paginationindex', pageIndex);
              if (pageIndex >= 0) {
                // Storing the faqNodeId so that it can be accessed on the new page.
                localStorage.setItem('faqNodeIdToExpand', faqNodeId);
                window.location.href = `/faqs?page=${pageIndex}`;
              }
            }
          } else if (faqNodeIdToExpand) {
            var faqItem = $(`#faq-${faqNodeIdToExpand}`);
            if (faqItem.length) {
              faqItem.find('.accordion-button').removeClass('collapsed');
              faqItem.find('.accordion-collapse').addClass('show');
              $('html, body').animate({
                scrollTop: faqItem.offset().top - 200
              }, 700);
            }
            removeLocalStorageItems(['faqNodeIdToExpand', 'redirectingFromSearch', 'paginationindex', 'faqNodeId']);
          }
        });
      });
    }
  };

  function removeLocalStorageItems(items) {
    items.forEach(function(item) {
      localStorage.removeItem(item);
    });
  }
})(jQuery, Drupal);

