/**
 * @file
 * Global utilities.
 *
 */
(function ($, Drupal) {
  Drupal.behaviors.gallery_section = {
    attach(context, settings) {
      const gallerySectionWrapper = document.querySelector('.gallery-section-wrapper');
      const galleryRows = gallerySectionWrapper.getElementsByClassName('gallery-row');
      const loadMoreBtn = document.getElementById('loadMoreBtn');
      let visibleRows = 2; // Number of initially visible rows.
      const rowsPerLoad = 1; // Number of rows to load per click.

      // Function to toggle the visibility of gallery rows.
      function toggleRows() {
        for (let i = 0; i < galleryRows.length; i++) {
          if (i < visibleRows) {
            galleryRows[i].style.display = 'flex';
          } else {
            galleryRows[i].style.display = 'none';
          }
        }
      }

      // Initial setup.
      toggleRows();

      // Event listener for the "Load More" button.
      loadMoreBtn.addEventListener('click', () => {
        visibleRows += rowsPerLoad;
        toggleRows();
      });
    },
  };
}(jQuery, Drupal));
