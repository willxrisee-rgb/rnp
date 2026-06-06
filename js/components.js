// js/components.js

window.Components = {
    createProductCard(bouquet) {
        const primaryTag = bouquet.occasion_tags.length > 0 ? bouquet.occasion_tags[0] : '';
        const badgeHTML = bouquet.is_best_seller
            ? '<span class="product-card__badge bestseller">BEST SELLER</span>'
            : (primaryTag ? `<span class="product-card__badge occasion">${primaryTag}</span>` : '');

        const imageHtml = bouquet.image_url
            ? `<img src="${bouquet.image_url}" alt="${bouquet.name}" class="card-image" loading="lazy">`
            : `<div class="card-image placeholder-image text-center p-4"><span>Image coming soon</span></div>`;

        const safeBouquetName = (bouquet.name || '').replace(/'/g, "\\'");

        return `
            <article class="product-card">
                <a href="#/bouquet/${bouquet.id}" class="product-card__image" onclick="if(window.gtag) gtag('event', 'bouquet_view', { event_category: 'Engagement', bouquet_name: '${safeBouquetName}' });">
                    ${imageHtml}
                    ${badgeHTML}
                </a>
                <div class="product-card__content">
                    <h3 class="product-card__title">
                        <a href="#/bouquet/${bouquet.id}" onclick="if(window.gtag) gtag('event', 'bouquet_view', { event_category: 'Engagement', bouquet_name: '${safeBouquetName}' });">
                            ${bouquet.name}
                        </a>
                    </h3>
                    <p class="product-card__desc">${bouquet.short_description}</p>
                    <div class="product-card__price-row">
                        <span class="product-card__price">₹${bouquet.price}</span>
                        <a href="https://api.whatsapp.com/send?phone=917289996804&text=${encodeURIComponent(`Hi! I'd like to order the ${bouquet.name} bouquet.`)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm product-card__btn" onclick="if(window.gtag) gtag('event', 'whatsapp_order_click', { event_category: 'Order Intent', bouquet_name: '${safeBouquetName}' });">Order now</a>
                    </div>
                </div>
            </article>
        `;
    },

    createFilterChips(options, selectedOption) {
        const chipsHTML = options.map(opt => {
            const isActive = opt.toLowerCase() === selectedOption.toLowerCase() ? 'active' : '';
            return `<button class="filter-chip ${isActive}" data-filter="${opt}">${opt}</button>`;
        }).join('');

        return `
            <div class="filter-chips-wrapper">
                <div class="filter-chips-container scroll-hide">
                    ${chipsHTML}
                </div>
            </div>
        `;
    },

    createSteps(steps) {
        return `
            <div class="steps-container">
                ${steps.map((step, idx) => `
                    <div class="step-item">
                        <div class="step-number">${idx + 1}</div>
                        <div class="step-content">
                            <h4 class="step-title">${step.title}</h4>
                            <p class="step-desc">${step.description}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    createOrderForm(bouquet) {
        return `
            <div class="order-form-container">
                <h3 class="form-title">Order Details</h3>
                <form id="bouquet-order-form" class="order-form">
                    <input type="hidden" id="bouquetId" value="${bouquet.id}">
                    <input type="hidden" id="bouquetName" value="${bouquet.name}">
                    <input type="hidden" id="bouquetPrice" value="${bouquet.price}">
                    
                    <div class="form-group">
                        <label for="fullName">Full Name <span class="required">*</span></label>
                        <input type="text" id="fullName" name="fullName" required placeholder="John Doe">
                    </div>
                    
                    <div class="form-group">
                        <label for="mobileNumber">Mobile Number <span class="required">*</span></label>
                        <input type="tel" id="mobileNumber" name="mobileNumber" required placeholder="+91 XXXXX XXXXX">
                    </div>
                    
                    <div class="form-group">
                        <label for="address">Full Delivery Address <span class="required">*</span></label>
                        <textarea id="address" name="address" rows="3" required placeholder="House No, Street, Landmark..."></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="area">Delivery Area <span class="required">*</span></label>
                        <select id="area" name="area" required>
                            <option value="">Select an area...</option>
                            <option value="Kavi Nagar">Kavi Nagar</option>
                            <option value="Raj Nagar">Raj Nagar</option>
                            <option value="Other">Other (Subject to availability)</option>
                        </select>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="deliveryDate">Delivery Date <span class="required">*</span></label>
                            <input type="date" id="deliveryDate" name="deliveryDate" required min="${new Date().toISOString().split('T')[0]}">
                        </div>
                        <div class="form-group">
                            <label for="deliverySlot">Time Slot <span class="required">*</span></label>
                            <select id="deliverySlot" name="deliverySlot" required>
                                <option value="">Select time...</option>
                                <option value="10 AM – 1 PM">10 AM – 1 PM</option>
                                <option value="1 PM – 4 PM">1 PM – 4 PM</option>
                                <option value="4 PM – 8 PM">4 PM – 8 PM</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="cardMessage">Message on Card (optional)</label>
                        <textarea id="cardMessage" name="cardMessage" rows="2" placeholder="Write a short note..."></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label>Preferred Payment Method <span class="required">*</span></label>
                        <div class="radio-group">
                            <label class="radio-label">
                                <input type="radio" name="paymentMethod" value="UPI" required checked> UPI
                            </label>
                            <label class="radio-label">
                                <input type="radio" name="paymentMethod" value="Bank transfer" required> Bank Transfer
                            </label>
                        </div>
                    </div>
                    
                    <button type="submit" class="btn btn-primary btn-block btn-lg">Confirm on WhatsApp</button>
                    <p class="form-note">Next step opens WhatsApp with your order details.</p>
                </form>
            </div>
        `;
    },

    createCustomBouquetBanner() {
        return `
            <div class="custom-bouquet-banner" style="background: linear-gradient(135deg, var(--accent-light) 0%, var(--accent-gray) 100%); border-radius: var(--border-radius-lg); padding: var(--spacing-2xl) var(--spacing-lg); text-align: center; margin-top: var(--spacing-2xl); box-shadow: var(--shadow-sm); border: 1px solid var(--border-color);">
                <h2 style="color: var(--primary-color); margin-bottom: var(--spacing-sm);">Can't find what you're looking for?</h2>
                <p style="font-size: 1.1rem; color: var(--text-main); margin-bottom: var(--spacing-lg);">Get your custom bouquet, handcrafted just for you — starting from just ₹200.</p>
                <ul style="list-style: none; padding: 0; margin: 0 auto var(--spacing-lg) auto; max-width: 400px; text-align: left; color: var(--text-muted);">
                    <li style="margin-bottom: var(--spacing-sm); display: flex; align-items: flex-start;"><span style="color: var(--primary-color); font-weight: bold; margin-right: var(--spacing-sm);">✓</span> Tell us your budget, occasion, and preferred flowers</li>
                    <li style="margin-bottom: var(--spacing-sm); display: flex; align-items: flex-start;"><span style="color: var(--primary-color); font-weight: bold; margin-right: var(--spacing-sm);">✓</span> We'll arrange a fresh bouquet just for you</li>
                    <li style="display: flex; align-items: flex-start;"><span style="color: var(--primary-color); font-weight: bold; margin-right: var(--spacing-sm);">✓</span> Same local delivery in Kavi Nagar & Raj Nagar</li>
                </ul>
                <a href="https://api.whatsapp.com/send?phone=917289996804&text=Hi%2C%20I%20want%20to%20order%20a%20custom%20bouquet.%20Can%20you%20help%20me%3F" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-lg" style="display: inline-block;" onclick="if(window.gtag) gtag('event', 'whatsapp_order_click', { event_category: 'Order Intent', bouquet_name: 'Custom' });">Order a Custom Bouquet on WhatsApp</a>
            </div>
        `;
    }
};