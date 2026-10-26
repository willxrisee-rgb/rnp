// WhatsApp Click Tracking for GA4
document.addEventListener('DOMContentLoaded', function () {

  function trackWhatsAppClick(buttonLabel) {
    if (window.gtag) {
      gtag('event', 'whatsapp_click', {
        event_category: 'WhatsApp',
        event_label: buttonLabel,
        page_location: window.location.href,
        page_title: document.title
      });
    }
  }

  // Track all WhatsApp links on the page
  function attachTrackers() {
    var allLinks = document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp.com"]');

    allLinks.forEach(function (link) {
      // Avoid attaching twice
      if (link.dataset.waTracked) return;
      link.dataset.waTracked = 'true';

      // Determine button label from text content or position
      var label = link.innerText.trim() || link.closest('section')?.id || 'unknown';

      link.addEventListener('click', function () {
        trackWhatsAppClick(label);
      });
    });
  }

  // Run on load
  attachTrackers();

  // Re-run after 2 seconds to catch dynamically loaded content
  setTimeout(attachTrackers, 2000);

  // ── 1. Scroll Depth Tracking ──
  var scrollMilestones = { 25: false, 50: false, 75: false, 100: false };
  var scrollTimeout;

  window.addEventListener('scroll', function () {
    if (scrollTimeout) return;

    scrollTimeout = setTimeout(function () {
      var scrollPosition = window.scrollY + window.innerHeight;
      var documentHeight = document.documentElement.scrollHeight;
      var scrollPercent = (scrollPosition / documentHeight) * 100;

      [25, 50, 75, 100].forEach(function (milestone) {
        if (!scrollMilestones[milestone] && scrollPercent >= milestone) {
          scrollMilestones[milestone] = true;
          if (window.gtag) {
            gtag('event', 'scroll_depth', {
              percent_scrolled: milestone,
              page_location: window.location.href,
              page_title: document.title
            });
          }
        }
      });

      scrollTimeout = null;
    }, 250); // Throttled at 250ms
  });

  // Reset scroll tracker on SPA route changes (assumes PopState or manual reset if needed)
  window.addEventListener('popstate', function () {
    scrollMilestones = { 25: false, 50: false, 75: false, 100: false };
  });

  // ── 2. Product View Tracking ──
  // Currently, the SPA router (pages.js / app.js) does NOT emit a custom event when rendering a bouquet detail page.
  // To avoid guessing with MutationObservers or intercepting innerHTML, the cleanest approach is to dispatch a custom event
  // named 'bouquetViewed' right after the bouquet HTML is injected into the container in `pages.js`.
  window.addEventListener('bouquetViewed', function (e) {
    if (window.gtag && e.detail && e.detail.bouquet) {
      var bouquet = e.detail.bouquet;
      gtag('event', 'view_item', {
        item_id: bouquet.id,
        item_name: bouquet.name,
        price: bouquet.price,
        page_location: window.location.href
      });
    }
  });

});

