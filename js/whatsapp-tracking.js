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

});
