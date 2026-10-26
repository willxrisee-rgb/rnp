// js/components.js

window.Components = {
    createProductCard(bouquet, index = 0) {
        const isPriority = index < 2;
        const imgAttrs = isPriority
            ? 'loading="eager" fetchpriority="high"'
            : 'loading="lazy"';
        const primaryTag = bouquet.occasion_tags.length > 0 ? bouquet.occasion_tags[0] : '';
        const badgeHTML = bouquet.is_best_seller
            ? '<span class="product-card__badge bestseller">BEST SELLER</span>'
            : (primaryTag ? `<span class="product-card__badge occasion">${primaryTag}</span>` : '');

        const imageHtml = bouquet.image_url
            ? `<img src="${bouquet.image_url}"
         alt="${bouquet.name} — Flower Bouquet for Delivery in Ghaziabad"
         class="card-image" ${imgAttrs} width="400" height="400">`
            : `<div class="card-image placeholder-image text-center p-4"><span>Image coming soon</span></div>`;

        const safeBouquetName = (bouquet.name || '').replace(/'/g, "\\'");

        return `
            <article class="product-card">
                <a href="/bouquet/${bouquet.slug}" class="product-card__image" onclick="if(window.gtag) gtag('event', 'bouquet_view', { event_category: 'Engagement', bouquet_name: '${safeBouquetName}' });">
                    ${imageHtml}
                    ${badgeHTML}
                </a>
                <div class="product-card__content">
                    <h3 class="product-card__title">
                        <a href="/bouquet/${bouquet.slug}" onclick="if(window.gtag) gtag('event', 'bouquet_view', { event_category: 'Engagement', bouquet_name: '${safeBouquetName}' });">
                            ${bouquet.name}
                        </a>
                    </h3>
                    <p class="product-card__desc">${bouquet.short_description}</p>
                    <div class="product-card__price-row" style="display:flex; flex-direction:column; gap:8px;">
                        <span class="product-card__price">₹${bouquet.price}</span>
                        <div style="display:flex; gap:8px;">
                            <a href="https://api.whatsapp.com/send?phone=917289996804&text=${encodeURIComponent(`Hi! I'd like to order the ${bouquet.name} bouquet.`)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm product-card__btn" onclick="if(window.gtag) gtag('event', 'whatsapp_order_click', { event_category: 'Order Intent', bouquet_name: '${safeBouquetName}' });">Order now</a>
                            <button class="btn-add-cart" onclick="if(window.CartUI && window.CartUI.addItem){window.CartUI.addItem('${bouquet.id}')} else {console.warn('CartUI not ready yet')}">Add to Cart</button>
                        </div>
                    </div>
                </div>
            </article>
        `;
    },

    createFilterChips(options, selectedOption) {
        const chipsHTML = options.map(opt => {
            const isActive = opt.toLowerCase() === selectedOption.toLowerCase() ? 'active' : '';
            return `<button class="filter-chip ${isActive}" data-filter="${opt}" style="min-height:44px; padding:10px 16px;">${opt}</button>`;
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

    prefillOrderFormFromProfile() {
        if (typeof window === 'undefined') return;
        setTimeout(async () => {
            try {
                if (!window.RNPAuth || typeof window.RNPAuth.getUserProfile !== 'function') return;
                const profile = await window.RNPAuth.getUserProfile();
                if (!profile) return;

                // Pre-fill WhatsApp Phone
                const phoneInput = document.getElementById('customerPhone');
                if (phoneInput && profile.whatsapp && (!phoneInput.value.trim() || phoneInput.dataset.prefilled !== 'false')) {
                    phoneInput.value = profile.whatsapp;
                    phoneInput.dataset.prefilled = 'true';
                }

                // Pre-fill Delivery Address
                const addressInput = document.getElementById('deliveryAddress');
                if (addressInput && profile.deliveryAddress && (!addressInput.value.trim() || addressInput.dataset.prefilled !== 'false')) {
                    addressInput.value = profile.deliveryAddress;
                    addressInput.dataset.prefilled = 'true';
                }

                // Pre-fill Delivery Pincode
                const pincodeInput = document.getElementById('deliveryPincode');
                if (pincodeInput && profile.deliveryPincode && (!pincodeInput.value.trim() || pincodeInput.dataset.prefilled !== 'false')) {
                    pincodeInput.value = profile.deliveryPincode;
                    pincodeInput.dataset.prefilled = 'true';
                    if (window.WhatsApp && typeof window.WhatsApp.validatePincodeLive === 'function') {
                        window.WhatsApp.validatePincodeLive(profile.deliveryPincode);
                    }
                }
            } catch (err) {
                console.warn('[Components] Could not pre-fill order form from profile:', err);
            }
        }, 60);
    },

    createOrderForm(bouquet) {
        // Pre-fill form from user's profile (phone, default delivery address, and pincode)
        this.prefillOrderFormFromProfile();

        return `
            <div class="order-form-container" id="order-form-container">
                <div class="form-header-row">
                    <h3 class="form-title">Order Details</h3>
                    <div id="order-user-status" class="order-user-status"></div>
                </div>
                
                <form id="bouquet-order-form" class="order-form">
                    <input type="hidden" id="bouquetId" value="${bouquet.id}">
                    <input type="hidden" id="bouquetName" value="${bouquet.name}">
                    <input type="hidden" id="bouquetPrice" value="${bouquet.price}">
                    <input type="hidden" id="bouquetImage" value="${bouquet.image_url || ''}">
                    
                    <!-- 1. Contact Person Name at Delivery -->
                    <div class="form-group">
                        <label for="recipientName">
                            Name of the person to contact at delivery <span class="required">*</span>
                        </label>
                        <input type="text" id="recipientName" name="recipientName" required placeholder="Name of the person to contact at delivery">
                    </div>
                    
                    <!-- 2. WhatsApp Phone Number (Pre-filled from profile, editable) -->
                    <div class="form-group">
                        <label for="customerPhone">
                            WhatsApp Phone Number <span class="required">*</span>
                            <span class="label-hint">(For order confirmation & delivery updates)</span>
                        </label>
                        <input type="tel" id="customerPhone" name="customerPhone" required placeholder="+91 98XXXXXXXX" autocomplete="tel">
                    </div>
                    
                    <!-- 3. Delivery Address -->
                    <div class="form-group">
                        <label for="deliveryAddress">Delivery Address <span class="required">*</span></label>
                        <textarea id="deliveryAddress" name="deliveryAddress" rows="3" required placeholder="House/Flat No., Apartment, Street, Landmark..."></textarea>
                    </div>
                    
                    <!-- 4. Delivery Pincode (Crucial: 10km radius Ghaziabad validation) -->
                    <div class="form-group">
                        <label for="deliveryPincode">
                            Delivery Pincode <span class="required">*</span>
                            <span class="label-hint">(10km Ghaziabad delivery radius)</span>
                        </label>
                        <div class="pincode-input-wrapper">
                            <input type="text" id="deliveryPincode" name="deliveryPincode" required maxlength="6" inputmode="numeric" placeholder="e.g. 201002" autocomplete="postal-code">
                            <span id="pincode-indicator" class="pincode-indicator"></span>
                        </div>
                        <div id="pincode-feedback" class="pincode-feedback" role="alert"></div>
                    </div>
                    
                    <!-- 5. Delivery Date & Time Slot (1-Hour Windows) -->
                    <div class="form-row">
                        <div class="form-group">
                            <label for="deliveryDate">Delivery Date <span class="required">*</span></label>
                            <input type="date" id="deliveryDate" name="deliveryDate" required min="${new Date().toISOString().split('T')[0]}">
                        </div>
                        <div class="form-group">
                            <label for="deliverySlot">Time Slot <span class="required">*</span></label>
                            <select id="deliverySlot" name="deliverySlot" required>
                                <option value="">Select time slot...</option>
                                <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                                <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
                                <option value="12:00 PM - 1:00 PM">12:00 PM - 1:00 PM</option>
                                <option value="1:00 PM - 2:00 PM">1:00 PM - 2:00 PM</option>
                                <option value="2:00 PM - 3:00 PM">2:00 PM - 3:00 PM</option>
                                <option value="3:00 PM - 4:00 PM">3:00 PM - 4:00 PM</option>
                                <option value="4:00 PM - 5:00 PM">4:00 PM - 5:00 PM</option>
                                <option value="5:00 PM - 6:00 PM">5:00 PM - 6:00 PM</option>
                                <option value="6:00 PM - 7:00 PM">6:00 PM - 7:00 PM</option>
                                <option value="7:00 PM - 8:00 PM">7:00 PM - 8:00 PM</option>
                            </select>
                        </div>
                    </div>
                    
                    <!-- 5. Custom Message on Card -->
                    <div class="form-group">
                        <label for="cardMessage">
                            Message on Card 
                            <span class="label-hint">(Optional)</span>
                        </label>
                        <textarea id="cardMessage" name="cardMessage" rows="2" placeholder="Write a short heartfelt note to accompany the flowers..."></textarea>
                    </div>
                    
                    <!-- Payment Information -->
                    <div class="form-group">
                        <label>Preferred Payment Method <span class="required">*</span></label>
                        <div class="radio-group">
                            <label class="radio-label">
                                <input type="radio" name="paymentMethod" value="UPI" required checked> UPI (Google Pay, PhonePe, Paytm)
                            </label>
                            <label class="radio-label">
                                <input type="radio" name="paymentMethod" value="Bank transfer" required> Bank Transfer
                            </label>
                        </div>
                        <p class="payment-note-inline">🔒 Safe payment via UPI QR code or NetBanking upon florist confirmation.</p>
                    </div>
                    
                    <div class="delivery-info-block">
                        <p>🌸 100% fresh flowers hand-tied to order in Ghaziabad</p>
                        <p>🕐 Delivered in under 1 hour after florist confirmation</p>
                        <p>💬 Direct WhatsApp update & live stock check in &lt;10 minutes</p>
                    </div>
                    
                    <button type="submit" id="btn-submit-order" class="btn btn-primary btn-block btn-lg">
                        <span class="btn-text">Confirm Order</span>
                        <span class="btn-spinner" style="display:none;">⏳ Placing your order...</span>
                    </button>
                    <p class="form-note">🔒 Safe checkout. Tracked directly via your account & WhatsApp.</p>
                </form>
            </div>
        `;
    },

    createCustomBouquetBanner() {
        return `
            <div class="custom-bouquet-banner" style="background: linear-gradient(135deg, var(--accent-light) 0%, var(--accent-gray) 100%); border-radius: var(--border-radius-lg); padding: var(--spacing-2xl) var(--spacing-lg); text-align: center; margin-top: var(--spacing-2xl); box-shadow: var(--shadow-sm); border: 1px solid var(--border-color);">
                <h2 style="color: var(--primary-color); margin-bottom: var(--spacing-sm);">Can't Find What You're Looking For?</h2>
                <p style="font-size: 1.1rem; color: var(--text-main); margin-bottom: var(--spacing-lg); max-width: 600px; margin-left: auto; margin-right: auto;">We make custom bouquets starting from ₹200.<br>Tell us your occasion, preferred flowers, colour, and budget — and we will create something beautiful just for you.</p>
                <a href="https://api.whatsapp.com/send?phone=917289996804&text=Hi%2C%20I%20want%20to%20order%20a%20custom%20bouquet.%20Can%20you%20help%20me%3F" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-lg" style="display: inline-block;" onclick="if(window.gtag) gtag('event', 'whatsapp_order_click', { event_category: 'Order Intent', bouquet_name: 'Custom' });">Order a Custom Bouquet on WhatsApp</a>
            </div>
        `;
    },

    _discountToastTimer: null,

    /**
     * Non-intrusive 10% discount lead magnet for non-logged-in visitors.
     * Slides in after 5 seconds on the catalog page.
     */
    initDiscountLeadMagnet() {
        if (typeof window === 'undefined' || !window.localStorage) return;

        // Skip if already dismissed
        if (localStorage.getItem('rnp_discount_toast_dismissed') === 'true') {
            return;
        }

        // Clear existing timer if any
        if (this._discountToastTimer) {
            clearTimeout(this._discountToastTimer);
        }

        // Wait 5 seconds
        this._discountToastTimer = setTimeout(async () => {
            if (localStorage.getItem('rnp_discount_toast_dismissed') === 'true') {
                return;
            }

            // Only show for users who are NOT currently logged in
            try {
                const user = window.RNPAuth ? await window.RNPAuth.getCurrentUser() : null;
                if (user) {
                    return;
                }
            } catch (err) {
                console.warn('[RNP] Auth check for lead magnet:', err);
            }

            // Avoid duplicates
            if (document.getElementById('rnp-discount-toast')) {
                return;
            }

            const toast = document.createElement('div');
            toast.id = 'rnp-discount-toast';
            toast.className = 'rnp-discount-toast';
            toast.setAttribute('role', 'alert');

            const loginUrl = `/login.html?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`;

            toast.innerHTML = `
                <div class="rnp-toast-inner">
                    <div class="rnp-toast-content">
                        <span class="rnp-toast-icon">🌸</span>
                        <span class="rnp-toast-text">First time here? Log in to get <strong>10% off</strong> your first Rose n Petals order!</span>
                    </div>
                    <div class="rnp-toast-actions">
                        <a href="${loginUrl}" class="rnp-toast-login-btn">Log In Now</a>
                        <button type="button" class="rnp-toast-close" id="rnp-toast-close-btn" aria-label="Dismiss discount notification">&times;</button>
                    </div>
                </div>
            `;

            document.body.appendChild(toast);

            requestAnimationFrame(() => {
                toast.classList.add('rnp-toast-visible');
            });

            // Dismiss listener
            const closeBtn = document.getElementById('rnp-toast-close-btn');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    localStorage.setItem('rnp_discount_toast_dismissed', 'true');
                    toast.classList.remove('rnp-toast-visible');
                    setTimeout(() => {
                        if (toast.parentNode) {
                            toast.parentNode.removeChild(toast);
                        }
                    }, 350);
                });
            }
        }, 5000);
    }
};

window.CartUI = {
    couponApplied: null,
    
    init() {
        // Inject Cart Drawer HTML
        const drawerHtml = `
            <div class="cart-overlay" id="cart-overlay"></div>
            <div class="cart-drawer" id="cart-drawer">
                <div class="cart-header">
                    <h2>Your Cart</h2>
                    <button class="cart-close" id="cart-close">&times;</button>
                </div>
                <div class="cart-content" id="cart-content">
                    <!-- Dynamic cart items here -->
                </div>
                <div class="cart-footer" id="cart-footer">
                    <div class="cart-coupon">
                        <label>Have a coupon?</label>
                        <div style="display:flex; gap:8px; margin-bottom: 8px;">
                            <input type="text" id="coupon-input" placeholder="Enter coupon code" style="flex:1; padding: 8px; border: 1px solid #ccc; border-radius: 4px; text-transform: uppercase;">
                            <button id="apply-coupon-btn" style="background:#CC0000; color:white; border:none; border-radius:6px; padding: 8px 16px; cursor:pointer;">Apply</button>
                        </div>
                        <div id="coupon-msg" style="font-size:12px; margin-bottom: 12px;"></div>
                    </div>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 12px 0;">
                    <div class="cart-summary">
                        <div class="summary-row"><span>Subtotal:</span> <span id="cart-subtotal">₹0</span></div>
                        <div class="summary-row" id="cart-discount-row" style="display:none; color: #2e7d32;"><span>Discount:</span> <span id="cart-discount">-₹0</span></div>
                        <div class="summary-row" style="font-size:12px; color:#666;"><span>Delivery:</span> <span>Communicated on WhatsApp</span></div>
                        <div class="summary-row" style="font-weight:700; font-size:16px; margin-top:8px;"><span>Total:</span> <span id="cart-total">₹0</span></div>
                    </div>
                    <button class="btn btn-continue" id="cart-continue-btn" style="width:100%; background:white; color:#CC0000; border:2px solid #CC0000; border-radius:8px; padding:12px; font-size:14px; cursor:pointer; margin-bottom:8px;">Continue Shopping</button>
                    <button class="btn btn-checkout" id="cart-checkout-btn" style="width:100%; background:#CC0000; color:white; border:none; border-radius:8px; padding:14px; font-size:14px; font-weight:700; cursor:pointer;">Proceed to Order on WhatsApp</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', drawerHtml);

        // Bind events
        document.getElementById('cart-overlay').addEventListener('click', () => this.close());
        document.getElementById('cart-close').addEventListener('click', () => this.close());
        document.getElementById('cart-continue-btn').addEventListener('click', () => this.close());
        
        document.getElementById('apply-coupon-btn').addEventListener('click', () => this.applyCoupon());
        document.getElementById('coupon-input').addEventListener('input', (e) => {
            e.target.value = e.target.value.toUpperCase();
        });

        document.getElementById('cart-checkout-btn').addEventListener('click', () => this.checkout());

        window.addEventListener('cartUpdated', this.render.bind(this));
        
        // Initial render
        this.render();
    },

    open() {
        document.getElementById('cart-overlay').classList.add('active');
        document.getElementById('cart-drawer').classList.add('active');
    },

    close() {
        document.getElementById('cart-overlay').classList.remove('active');
        document.getElementById('cart-drawer').classList.remove('active');
    },

    addItem(productId) {
        if (!window.Store || !window.CartStore) return;
        const product = window.Store.getProductById(productId);
        if (product) {
            window.CartStore.addToCart(product);
            this.open();
        }
    },

    async applyCoupon() {
        const code = document.getElementById('coupon-input').value.trim();
        const msgEl = document.getElementById('coupon-msg');
        
        if (!code) {
            this.couponApplied = null;
            msgEl.textContent = '';
            this.render();
            return;
        }

        const subtotal = window.CartStore.getSubtotal();
        
        try {
            const res = await fetch('/api/coupons/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, cartTotal: subtotal })
            });
            const data = await res.json();
            
            if (data.valid) {
                this.couponApplied = {
                    code: code,
                    discount: data.discountAmount
                };
                msgEl.textContent = data.message;
                msgEl.style.color = '#2e7d32'; // green
            } else {
                this.couponApplied = null;
                msgEl.textContent = data.message;
                msgEl.style.color = '#c62828'; // red
            }
        } catch(e) {
            this.couponApplied = null;
            msgEl.textContent = 'Error validating coupon.';
            msgEl.style.color = '#c62828';
        }
        this.render();
    },

    render() {
        if (!window.CartStore) return;

        // Update badge
        const badgeEls = document.querySelectorAll('.cart-badge');
        const count = window.CartStore.getTotalItems();
        badgeEls.forEach(badge => {
            if (count > 0) {
                badge.textContent = count;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        });

        const cart = window.CartStore.getCart();
        const contentEl = document.getElementById('cart-content');
        const footerEl = document.getElementById('cart-footer');
        
        if (cart.length === 0) {
            contentEl.innerHTML = `
                <div style="text-align:center; padding: 40px 20px;">
                    <p style="margin-bottom: 20px; color:#666;">Your cart is empty.<br>Browse our bouquets and add something beautiful.</p>
                    <a href="/catalog" class="btn btn-primary" onclick="window.CartUI.close()">Browse Bouquets</a>
                </div>
            `;
            footerEl.style.display = 'none';
            this.couponApplied = null; // reset coupon if cart is empty
            return;
        }

        footerEl.style.display = 'block';
        
        let html = '';
        cart.forEach(item => {
            html += `
                <div class="cart-item" style="display:flex; gap:12px; margin-bottom: 16px; align-items:center;">
                    <img src="${item.imageUrl}" style="width:60px; height:60px; border-radius:8px; object-fit:cover;">
                    <div style="flex:1;">
                        <div style="font-size:14px; font-weight:600; margin-bottom:4px;">${item.name}</div>
                        <div style="font-size:13px; color:#CC0000; margin-bottom:8px;">₹${item.price}</div>
                        <div style="display:flex; align-items:center; gap:8px;">
                            <button onclick="window.CartStore.updateQuantity('${item.id}', ${item.quantity - 1})" style="width:40px; height:40px; min-width:40px; min-height:40px; border:1px solid #eee; background:white; border-radius:4px; cursor:pointer; font-size:18px;">-</button>
                            <span style="font-size:14px; min-width:24px; text-align:center;">${item.quantity}</span>
                            <button onclick="window.CartStore.updateQuantity('${item.id}', ${item.quantity + 1})" style="width:40px; height:40px; min-width:40px; min-height:40px; border:1px solid #eee; background:white; border-radius:4px; cursor:pointer; font-size:18px;">+</button>
                        </div>
                    </div>
                    <button onclick="window.CartStore.removeFromCart('${item.id}')" style="background:none; border:none; cursor:pointer; padding:8px; display:flex;" title="Remove item">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="cart-trash-icon"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
            `;
        });
        contentEl.innerHTML = html;

        // Re-validate coupon if total changed and it drops below minOrder
        // To be thorough, if there's a coupon applied, we should check it against new total,
        // but for simplicity, we'll let the user re-apply or just keep the visual state consistent.
        
        const subtotal = window.CartStore.getSubtotal();
        document.getElementById('cart-subtotal').textContent = `₹${subtotal}`;
        
        let discount = 0;
        if (this.couponApplied && this.couponApplied.discount) {
            // Need to re-cap discount if subtotal drops below discount
            discount = Math.min(this.couponApplied.discount, subtotal); 
            document.getElementById('cart-discount-row').style.display = 'flex';
            document.getElementById('cart-discount-row').style.justifyContent = 'space-between';
            document.getElementById('cart-discount').textContent = `-₹${discount}`;
        } else {
            document.getElementById('cart-discount-row').style.display = 'none';
        }
        
        const total = subtotal - discount;
        document.getElementById('cart-total').textContent = `₹${total}`;
        
        // Add hover effect to trash icon
        document.querySelectorAll('.cart-trash-icon').forEach(icon => {
            icon.addEventListener('mouseenter', () => icon.style.stroke = '#CC0000');
            icon.addEventListener('mouseleave', () => icon.style.stroke = '#999');
        });
    },

    checkout() {
        const cart = window.CartStore.getCart();
        if (cart.length === 0) return;

        const subtotal = window.CartStore.getSubtotal();
        let discount = 0;
        let couponStr = '';
        
        if (this.couponApplied) {
            discount = Math.min(this.couponApplied.discount, subtotal);
            couponStr = `\nCoupon: ${this.couponApplied.code} (-₹${discount})`;
        }
        const total = subtotal - discount;

        // Save the cart order in a global variable
        window._pendingCartOrder = {
            cart: cart,
            subtotal: subtotal,
            discount: discount,
            couponStr: couponStr,
            total: total
        };

        // Close the drawer
        this.close();

        // Helper to inject notice and scroll
        const focusOnForm = () => {
            const formContainer = document.getElementById('inline-order-form');
            if (formContainer) {
                if (!document.getElementById('cart-notice')) {
                    const notice = document.createElement('div');
                    notice.id = 'cart-notice';
                    notice.style.cssText = "background: #fff3cd; color: #856404; padding: 12px; border-radius: 8px; margin-bottom: 15px; font-weight: bold; border: 1px solid #ffeeba;";
                    notice.textContent = "Complete your delivery details below to confirm your cart order.";
                    formContainer.parentNode.insertBefore(notice, formContainer);
                }
                const formEl = document.getElementById('bouquet-order-form');
                if (formEl) formEl.scrollIntoView({behavior: 'smooth', block: 'start'});
            }
        };

        // Check if we are already on a detail page
        if (window.location.pathname.startsWith('/bouquet/')) {
            focusOnForm();
        } else {
            // Navigate to the detail page of the first item
            const firstItem = cart[0];
            const product = window.Store ? window.Store.getProductById(firstItem.id) : null;
            const targetSlug = product ? product.slug : firstItem.id;
            window.history.pushState(null, '', `/bouquet/${targetSlug}`);
            if (typeof App !== 'undefined') {
                App.handleRouting();
            }
            // Give the app time to render the new page
            setTimeout(focusOnForm, 300);
        }
    }
};

// CartUI will be initialized in app.js after Store loads