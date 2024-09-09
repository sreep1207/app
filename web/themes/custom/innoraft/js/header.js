/**
 * @file
 * Global utilities.
 *
 */
(function ($, Drupal, once) {
  Drupal.behaviors.header = {
    attach(context, settings) {
      $(window).on('scroll', () => {
        if ($(window).scrollTop() > 1) {
          $('header').addClass('scrolled');
        } else {
          $('header').removeClass('scrolled');
        }
      });
      $('header ul.navbar-nav .nav-item .dropdown-toggle, .menu-link--parent').click(function () {
        if ($(window).width() < 992) {
          const href = $(this).prop('href');
          if (href) {
            window.location.href = href;
            return;
          }
          if ($(this).hasClass('menu-link--parent')) {
            if ($(this).hasClass('open')) {
              $(this).removeClass('open');
              $(this).children('ul.dropdown-menu').removeClass('open');
            } else {
              $('.menu-link--parent').removeClass('open');
              $('.menu-link--parent').children('ul.dropdown-menu').removeClass('open');
              $(this).addClass('open');
              $(this).children('ul.dropdown-menu').addClass('open');
            }
          } else {
            $(this).removeClass('show');
            $(this).siblings('ul.dropdown-menu').removeClass('show');
            if ($(this).hasClass('open')) {
              $(this).removeClass('open');
              $(this).siblings('ul.dropdown-menu').removeClass('open');
            } else {
              $('header ul.navbar-nav .nav-item .dropdown-toggle').removeClass('open');
              $('header ul.navbar-nav .nav-item .dropdown-toggle').siblings('ul.dropdown-menu').removeClass('open');
              $(this).addClass('open');
              $(this).siblings('ul.dropdown-menu').addClass('open');
            }
          }
        }
      });
      $('.navigation.menu--main .nav-item.menu-item--expanded.dropdown li.dropdown a.dropdown-toggle').click(function () {
        window.location = $(this).attr('href');
      });
      once('quickSearch', 'html', context).forEach((element) => {
        let showPanel = false;
        $(document).on('click', (e) => {
          if (!$(e.target).closest('.search-icon').length && !$(e.target).closest('.quick-search-panel').length && !$(e.target).closest('.clear-button').length) {
            $('.quick-search-panel').removeClass('open');
            $('.search-icon').removeClass('change');
            showPanel = false;
          }
        });

        $('.search-icon').on('click', (e) => {
          e.preventDefault();
          showPanel = !showPanel;
          $('.quick-search-panel').toggleClass('open', showPanel);
          $('.search-icon').toggleClass('change', showPanel);
        });

        const inputElem = $('.block-views-exposed-filter-blocksolr-search-page-1 .js-form-type-search-api-autocomplete input');

        function clearButtonShow(inputElement) {
          const $parent = inputElement.parent('.block-views-exposed-filter-blocksolr-search-page-1 .js-form-type-search-api-autocomplete');
          if (inputElement.val().trim() !== '') {
            if ($parent.find('.clear-button').length === 0) {
              const clearButton = $('<div class="clear-button"></div>');
              $parent.append(clearButton);

              clearButton.on('click', function () {
                $(this).siblings('input').val('');
                $(this).remove();
              });
            }
          } else {
            $parent.find('.clear-button').remove();
          }
        }

        clearButtonShow(inputElem);
        inputElem.on('input', () => {
          clearButtonShow(inputElem);
        });
      });
    },
  };
}(jQuery, Drupal, once));
