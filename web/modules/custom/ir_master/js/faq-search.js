(function ($, Drupal) {
  Drupal.behaviors.storeNodeId = {
    attach: function (context, settings) {
      $(document).ready(function() {
        // Attaching click event to search result links
        $('.search-result').each(function() {
          var $searchResult = $(this);
          var contentType = $searchResult.find('.content-type').text().trim();
          if (contentType === 'frequently asked questions') {
            var $link = $searchResult.find('.node__title a');
            $link.on('click', function(event) {
              var nodeId = $(this).attr('href').split('/node/')[1];
              localStorage.setItem('faqNodeId', nodeId);
              localStorage.setItem('redirectingFromSearch', 'true');
            });
          }
        });
      });
    }
  };
})(jQuery, Drupal);
