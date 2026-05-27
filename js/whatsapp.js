// js/whatsapp.js

window.WhatsApp = {
    SHOP_PHONE: "917289996804", // Ensure no '+' just numbers

    initFormListener() {
        // Needs to be called after the form is rendered into the DOM
        const form = document.getElementById('bouquet-order-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.buildAndRedirect();
        });
    },

    buildAndRedirect() {
        const formData = new FormData(document.getElementById('bouquet-order-form'));

        // Read form values
        const fullName = formData.get('fullName').trim();
        const mobileNumber = formData.get('mobileNumber').trim();
        const address = formData.get('address').trim();
        const area = formData.get('area');
        const deliveryDate = formData.get('deliveryDate');
        const deliverySlot = formData.get('deliverySlot');
        let cardMessage = formData.get('cardMessage') ? formData.get('cardMessage').trim() : "None";
        if (cardMessage.length === 0) cardMessage = "None"; // handles just spaces

        const paymentMethod = formData.get('paymentMethod');

        // Read bouquet data from hidden inputs
        const bouquetId = document.getElementById('bouquetId').value;
        const bouquetName = document.getElementById('bouquetName').value;
        const bouquetPrice = document.getElementById('bouquetPrice').value;

        // Construct multi-line message
        const message = `Hi, I want to order a bouquet from Rose n Petals.
Name: ${fullName}
Phone: ${mobileNumber}
Bouquet: ${bouquetName} (${bouquetId})
Price: ₹${bouquetPrice}
Address: ${address}
Area: ${area}
Delivery time: ${deliveryDate} – ${deliverySlot}
Message on card: "${cardMessage}"
Payment method: ${paymentMethod}`;

        // URL encode the message
        const encodedMessage = encodeURIComponent(message);

        // Standard WhatsApp click-to-chat URL
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${this.SHOP_PHONE}&text=${encodedMessage}`;

        if (window.gtag) {
            window.gtag('event', 'whatsapp_order_click', { event_category: 'Order Intent', bouquet_name: bouquetName });
        }

        // Redirect browser
        window.location.href = whatsappUrl;
    }
};
