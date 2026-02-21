// js/components.js

window.Components = {
    createProductCard(bouquet) {
        // Tag to show: first occasion tag, fallback if empty
        const primaryTag = bouquet.occasionTags.length > 0 ? bouquet.occasionTags[0] : '';
        const badgeHTML = bouquet.isBestSeller ? '<span class="card-badge bestseller">BEST SELLER</span>' : (primaryTag ? `<span class="card-badge occasion">${primaryTag}</span>` : '');

        const imageHtml = bouquet.image_url
            ? `<img src="${bouquet.image_url}" alt="${bouquet.name}" class="card-image" loading="lazy">`
            : `<div class="card-image placeholder-image text-center p-4"><span>Image coming soon</span></div>`;

        return `
            <div class="product-card">
                <a href="#/bouquet/${bouquet.id}" class="card-image-link">
                    ${imageHtml}
                    ${badgeHTML}
                </a>
                <div class="card-content">
                    <h3 class="card-title"><a href="#/bouquet/${bouquet.id}">${bouquet.name}</a></h3>
                    <p class="card-desc">${bouquet.shortDescription}</p>
                    <div class="card-footer">
                        <span class="card-price">₹${bouquet.price}</span>
                        <a href="#/bouquet/${bouquet.id}" class="btn btn-primary btn-sm">Order now</a>
                    </div>
                </div>
            </div>
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
    }
};
