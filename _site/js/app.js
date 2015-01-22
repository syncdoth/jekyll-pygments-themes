$(document).ready(function() {
  'use strict';

  var elements = {
    previewList: $('#themes'),
    searchBox: $('#search'),
    languageDropdown: $('.language-dropdown'),
    noSearchResultsAlert: $('.no-search-results'),
    dismissSearchBtn: $('[data-dismiss="search"]')
  };

  var timeoutId = null;
  var query;

  /* Set up */
  // Initialise 'mix it up' plugin on theme list
  elements.previewList.mixItUp();

  // Instantiate autocomplete theme names in search box
  elements.searchBox.typeahead({
    source: $('body').data('site').themes.map(function(theme) {
      return theme.name;
    }),
    afterSelect: function() {
      elements.searchBox.trigger('search');
    }

  // Bind to search and keyup events
  }).on('keyup search', function(ev) {
    var q = $(this).val(),
      $btn = elements.dismissSearchBtn.filter(function(i, el) {
        return !!($(el).parents('.navbar').length);
      });

    /* Update each link in the language dropdown to include the current search
       query */
    elements.languageDropdown.find('.dropdown-menu').find('a')
      .attr('href', function() {
        return $(this).attr('href').replace(/\?.*$/, '') + (q ? '?q=' + q : '');
      });

    clearTimeout(timeoutId);

    if (!q) {
      $btn.fadeOut();
    } else {
      $btn
        .fadeIn()
        .find('i').removeClass('fa-close').addClass('fa-spin fa-spinner');
    }

    timeoutId = setTimeout(function() {
      ga('send', 'event', 'previews', 'generic', 'search');

      elements.previewList.mixItUp('filter', $('.mix').filter(function(i, el) {
        return $(el).find('.theme').data('theme-id').indexOf(q) !== -1;
      }));

      setTimeout(function() {
        elements.dismissSearchBtn
          .find('i').removeClass('fa-spin fa-spinner').addClass('fa-close');

        elements.noSearchResultsAlert
          .find('.user-input').text(q)
          .end()
          .toggleClass('in', !$('.theme:visible').length);
      }, 600);
    }, q ? 750 : 0);
  });

  // @FIXME this is lazy
  elements.dismissSearchBtn.on('click', function(ev) {
    $('#search').val('').trigger('search');
  });

  // Stop the navbar search form from reloading the page
  $('form').on('submit', function(ev) {
    ev.preventDefault();
  });

  $('[data-label]').on('click', function(ev) {
    var data = $.extend({
      category: 'previews',
      event: 'generic'
    }, $(this).data());

    ga('send', 'event', data.category, data.event, data.label);
  });

  // If we have a query in the url, execute it
  if ((query = window.location.search.slice(3))) {
    elements.searchBox.val(query).trigger('search');
  }
});
