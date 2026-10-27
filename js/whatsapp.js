// js/whatsapp.js — Checkout & Order Flow with Firebase Auth & Firestore

window.WhatsApp = {
    SHOP_PHONE: "917289996804", // Shop WhatsApp contact

    ALLOWED_PINCODES: [
        '201001', // Ghaziabad City, Navyug Market, G.T. Road, Model Town
        '201002', // Kavi Nagar (Shop location), Shastri Nagar, Sector 18 KD Market
        '201003', // Industrial Area, Rajendra Nagar
        '201005', // Sahibabad Industrial Area
        '201009', // Vijay Nagar, Crossings Republik
        '201010', // Vaishali, Kaushambi
        '201013', // Vasundhara Sector 1-9
        '201014', // Indirapuram (Vaibhav Khand, Ahinsa Khand, Nyay Khand)
        '201017'  // Govindpuram
    ],

    initFormListener() {
        const form = document.getElementById('bouquet-order-form');
        if (!form) return;

        // 1. Setup Auth state / User status indicator in form
        this.updateUserStatusDisplay();

        // Listen for auth changes to re-render status live
        if (window.RNPAuth && typeof window.RNPAuth.onUserChanged === 'function') {
            window.RNPAuth.onUserChanged(() => this.updateUserStatusDisplay());
        } else {
            window.addEventListener('RNPAuthReady', () => {
                this.updateUserStatusDisplay();
                if (window.RNPAuth.onUserChanged) {
                    window.RNPAuth.onUserChanged(() => this.updateUserStatusDisplay());
                }
            });
        }

        // 2. Setup real-time Pincode Validation
        const pincodeInput = document.getElementById('deliveryPincode');
        if (pincodeInput) {
            pincodeInput.addEventListener('input', (e) => {
                // Keep only numeric characters
                e.target.value = e.target.value.replace(/\D/g, '').slice(0, 6);
                this.validatePincodeLive(e.target.value);
            });

            pincodeInput.addEventListener('blur', (e) => {
                this.validatePincodeLive(e.target.value, true);
            });
        }

        // 3. Intercept Form Submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleOrderSubmit();
        });
    },

    /**
     * Checks if current user is signed in and updates the form header badge.
     */
    async updateUserStatusDisplay() {
        const statusEl = document.getElementById('order-user-status');
        if (!statusEl) return;

        if (!window.RNPAuth) {
            await new Promise((resolve) => {
                if (window.RNPAuth) return resolve();
                window.addEventListener('RNPAuthReady', () => resolve(), { once: true });
                setTimeout(resolve, 3000);
            });
        }

        try {
            const user = window.RNPAuth ? await window.RNPAuth.getCurrentUser() : null;
            if (user) {
                const profile = await window.RNPAuth.getUserProfile();
                const displayName = profile?.name || user.displayName || 'Customer';
                const phone = profile?.whatsapp || '';

                statusEl.innerHTML = `
                    <div class="user-status-pill logged-in">
                        <span class="user-status-avatar">${(displayName[0] || 'U').toUpperCase()}</span>
                        <div class="user-status-meta">
                            <span class="user-status-name">Ordering as <strong>${escapeHtml(displayName)}</strong></span>
                            ${phone ? `<span class="user-status-phone">${phone}</span>` : `<span class="user-status-pending">WhatsApp pending</span>`}
                        </div>
                        <a href="/login.html?redirect=${encodeURIComponent(window.location.pathname)}" class="user-status-switch" title="Switch Account">Switch</a>
                    </div>
                `;

                // Pre-fill Phone Number input from user profile (if not manually edited)
                const phoneInput = document.getElementById('customerPhone');
                if (phoneInput && phone) {
                    if (!phoneInput.value.trim() || phoneInput.dataset.prefilled !== 'false') {
                        phoneInput.value = phone;
                        phoneInput.dataset.prefilled = 'true';
                    }
                    phoneInput.addEventListener('input', () => {
                        phoneInput.dataset.prefilled = 'false';
                    }, { once: true });
                }

                // Pre-fill Delivery Address & Pincode from user profile (if not manually edited)
                const addressInput = document.getElementById('deliveryAddress');
                if (addressInput && profile?.deliveryAddress) {
                    if (!addressInput.value.trim() || addressInput.dataset.prefilled !== 'false') {
                        addressInput.value = profile.deliveryAddress;
                        addressInput.dataset.prefilled = 'true';
                    }
                    addressInput.addEventListener('input', () => {
                        addressInput.dataset.prefilled = 'false';
                    }, { once: true });
                }

                const pincodeInput = document.getElementById('deliveryPincode');
                if (pincodeInput && profile?.deliveryPincode) {
                    if (!pincodeInput.value.trim() || pincodeInput.dataset.prefilled !== 'false') {
                        pincodeInput.value = profile.deliveryPincode;
                        pincodeInput.dataset.prefilled = 'true';
                        this.validatePincodeLive(profile.deliveryPincode);
                    }
                    pincodeInput.addEventListener('input', () => {
                        pincodeInput.dataset.prefilled = 'false';
                    }, { once: true });
                }
            } else {
                statusEl.innerHTML = `
                    <div class="user-status-pill guest">
                        <span class="user-status-icon">🌸</span>
                        <span class="user-status-text">Browsing is public. Log in required at checkout.</span>
                    </div>
                `;
            }
        } catch (err) {
            console.warn('[RNP] Could not check user status:', err);
        }
    },

    /**
     * Validates pincode and displays instant feedback to the user.
     */
    validatePincodeLive(val, onBlur = false) {
        const feedbackEl = document.getElementById('pincode-feedback');
        const inputEl = document.getElementById('deliveryPincode');
        const indicator = document.getElementById('pincode-indicator');
        if (!feedbackEl || !inputEl) return false;

        const pincode = String(val).trim();

        if (pincode.length === 0) {
            feedbackEl.textContent = '';
            feedbackEl.className = 'pincode-feedback';
            inputEl.classList.remove('input-valid', 'input-invalid');
            if (indicator) indicator.textContent = '';
            return false;
        }

        if (pincode.length < 6) {
            if (onBlur) {
                feedbackEl.textContent = 'Please enter a 6-digit postal pincode.';
                feedbackEl.className = 'pincode-feedback error';
                inputEl.classList.add('input-invalid');
                inputEl.classList.remove('input-valid');
                if (indicator) indicator.textContent = '❌';
            } else {
                feedbackEl.textContent = '';
                feedbackEl.className = 'pincode-feedback';
                inputEl.classList.remove('input-valid', 'input-invalid');
                if (indicator) indicator.textContent = '';
            }
            return false;
        }

        // Check against allowed list
        const allowed = (window.RNPAuth && window.RNPAuth.ALLOWED_PINCODES) || this.ALLOWED_PINCODES;
        const isAllowed = allowed.includes(pincode);

        if (isAllowed) {
            feedbackEl.textContent = '✓ Deliverable area within 10km radius in Ghaziabad.';
            feedbackEl.className = 'pincode-feedback success';
            inputEl.classList.add('input-valid');
            inputEl.classList.remove('input-invalid');
            if (indicator) indicator.textContent = '✅';
            return true;
        } else {
            feedbackEl.textContent = 'Sorry! To ensure maximum freshness, we currently only deliver within a 10km radius in Ghaziabad.';
            feedbackEl.className = 'pincode-feedback error';
            inputEl.classList.add('input-invalid');
            inputEl.classList.remove('input-valid');
            if (indicator) indicator.textContent = '❌';
            return false;
        }
    },

    /**
     * Handles order submission: enforces login intercept, validates fields,
     * saves order to Firestore Orders collection, and renders success UI.
     */
    async handleOrderSubmit() {
        const form = document.getElementById('bouquet-order-form');
        const submitBtn = document.getElementById('btn-submit-order');
        if (!form) return;

        // ── 1. Check Login State (Intercept if unauthenticated) ──
        if (!window.RNPAuth) {
            alert('Authentication service is initializing. Please wait a moment and try again.');
            return;
        }

        const user = await window.RNPAuth.getCurrentUser();
        const redirectPath = window.location.pathname + window.location.search;

        if (!user) {
            // Trigger beautiful branded login modal
            window.RNPAuth.showLoginModal({
                title: 'Almost there!',
                message: 'Please log in to place and track your order.',
                redirectUrl: redirectPath
            });
            return;
        }

        // Check if user has WhatsApp number registered
        const profile = await window.RNPAuth.getUserProfile();
        if (!profile || !profile.whatsapp) {
            window.RNPAuth.showLoginModal({
                title: 'One Quick Step! 🌸',
                message: 'Please save your WhatsApp number on the login page so our florists can confirm and track your delivery.',
                buttonText: 'Complete WhatsApp Setup',
                redirectUrl: redirectPath
            });
            return;
        }

        // ── 2. Read and Validate Form Fields ──
        const formData = new FormData(form);
        const recipientName = (formData.get('recipientName') || '').trim();
        const inputPhone = (formData.get('customerPhone') || '').trim();
        const address = (formData.get('deliveryAddress') || '').trim();
        const pincode = (formData.get('deliveryPincode') || '').trim();
        const deliveryDate = formData.get('deliveryDate');
        const deliverySlot = formData.get('deliverySlot');
        const rawCardMessage = (formData.get('cardMessage') || '').trim();
        const paymentMethod = formData.get('paymentMethod') || 'UPI';

        // Validate Contact Person Name
        if (!recipientName) {
            alert('Please enter the name of the person to contact at delivery.');
            document.getElementById('recipientName')?.focus();
            return;
        }

        // Strict 10-Digit Phone Validation
        const rawPhone = inputPhone || profile.whatsapp || '';
        let digits = String(rawPhone).replace(/\D/g, '');
        if (digits.length === 12 && digits.startsWith('91')) {
            digits = digits.slice(2);
        } else if (digits.length === 11 && digits.startsWith('0')) {
            digits = digits.slice(1);
        }

        if (digits.length !== 10) {
            alert('Please enter a valid 10-digit phone number.');
            document.getElementById('customerPhone')?.focus();
            return;
        }
        const customerPhone = `+91${digits}`;

        // Validate Card Message (Max 4 words)
        if (rawCardMessage) {
            const wordCount = rawCardMessage.split(/\s+/).length;
            if (wordCount > 4) {
                alert('Card messages are limited to a maximum of 4 words.');
                document.getElementById('cardMessage')?.focus();
                return;
            }
        }
        const cardMessage = rawCardMessage || 'None';

        // Validate Delivery Address
        if (!address) {
            alert('Please enter your full delivery address.');
            document.getElementById('deliveryAddress')?.focus();
            return;
        }

        // ── 3. Validate Pincode (10km Ghaziabad Radius) ──
        const allowed = (window.RNPAuth && window.RNPAuth.ALLOWED_PINCODES) || this.ALLOWED_PINCODES;
        if (!allowed.includes(pincode)) {
            const pincodeInput = document.getElementById('deliveryPincode');
            const feedbackEl = document.getElementById('pincode-feedback');
            if (feedbackEl) {
                feedbackEl.textContent = 'Sorry! To ensure maximum freshness, we currently only deliver within a 10km radius in Ghaziabad.';
                feedbackEl.className = 'pincode-feedback error';
            }
            if (pincodeInput) {
                pincodeInput.classList.add('input-invalid');
                pincodeInput.focus();
            }
            return;
        }

        // Validate Date & Slot
        if (!deliveryDate) {
            alert('Please select a delivery date.');
            document.getElementById('deliveryDate')?.focus();
            return;
        }
        if (!deliverySlot) {
            alert('Please select a delivery time slot.');
            document.getElementById('deliverySlot')?.focus();
            return;
        }

        // ── 4. Set Loading State ──
        if (submitBtn) {
            submitBtn.disabled = true;
            const btnText = submitBtn.querySelector('.btn-text');
            const btnSpinner = submitBtn.querySelector('.btn-spinner');
            if (btnText) btnText.style.display = 'none';
            if (btnSpinner) btnSpinner.style.display = 'inline';
        }

        // ── 5. Prepare Order Document ──
        const bouquetId = document.getElementById('bouquetId')?.value || '';
        const bouquetName = document.getElementById('bouquetName')?.value || 'Fresh Floral Arrangement';
        const bouquetPrice = parseFloat(document.getElementById('bouquetPrice')?.value || '0');
        
        // Select currently displayed bouquet image element and extract its absolute src
        const displayedImg = document.querySelector('.detail-image-wrapper img, img.detail-image, .detail-section img');
        const bouquetImage = (displayedImg && displayedImg.src) ? displayedImg.src : (document.getElementById('bouquetImage')?.value || '');

        const orderData = {
            customerId: user.uid,
            customerPhone: customerPhone,
            customerName: profile.name || user.displayName || 'Valued Customer',
            customerEmail: user.email || '',
            bouquetId: bouquetId,
            bouquetName: bouquetName,
            price: bouquetPrice,
            imageUrl: bouquetImage,
            recipientName: recipientName,
            deliveryAddress: address,
            pincode: pincode,
            deliveryDate: deliveryDate,
            timeSlot: deliverySlot,
            cardMessage: cardMessage,
            paymentMethod: paymentMethod,
            status: 'PENDING_SHOP_APPROVAL'
        };

        // If cart checkout was pending
        if (window._pendingCartOrder) {
            orderData.cart = window._pendingCartOrder.cart;
            orderData.subtotal = window._pendingCartOrder.subtotal;
            orderData.discount = window._pendingCartOrder.discount;
            orderData.total = window._pendingCartOrder.total;
            if (!orderData.imageUrl && orderData.cart && orderData.cart[0]) {
                orderData.imageUrl = orderData.cart[0].imageUrl || orderData.cart[0].image_url || '';
            }
            if (window._pendingCartOrder.couponStr) {
                orderData.coupon = window._pendingCartOrder.couponStr.trim();
            }
            // Clear pending cart order and empty cart store
            window._pendingCartOrder = null;
            if (window.CartStore && typeof window.CartStore.clearCart === 'function') {
                window.CartStore.clearCart();
            }
        }

        try {
            // ── 6. Save to Firestore 'Orders' Collection ──
            console.log('[DEBUG Frontend] Cloudinary URL captured:', orderData.imageUrl);
            const savedOrder = await window.RNPAuth.saveOrderToFirestore(orderData);

            // ── 6b. Notify Telegram Owner Approval Bot (Fire-and-forget in background) ──
            fetch('/api/notify-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: savedOrder.id,
                    ...orderData
                })
            }).catch((notifyErr) => {
                console.warn('[RNP] Telegram order notification background call failed:', notifyErr);
            });

            // ── 6c. Save Address & Pincode to User Profile in Firestore 'Users' Collection ({ merge: true }) ──
            if (window.RNPAuth && typeof window.RNPAuth.saveUserAddress === 'function') {
                try {
                    await window.RNPAuth.saveUserAddress(user.uid, {
                        deliveryAddress: address,
                        deliveryPincode: pincode
                    });
                } catch (addrErr) {
                    console.warn('[RNP] Could not update saved address in profile:', addrErr);
                }
            }

            // Google Analytics Event
            if (window.gtag) {
                window.gtag('event', 'order_request_placed', {
                    event_category: 'Order',
                    bouquet_name: bouquetName,
                    value: bouquetPrice,
                    currency: 'INR',
                    order_id: savedOrder.id
                });
            }

            // ── 7. Render Success UI Replacing the Form ──
            this.renderSuccessScreen(savedOrder, orderData);

        } catch (error) {
            console.error('[RNP] Order submission failed:', error);
            alert(`Order Error: ${error.code || 'order-failed'} - ${error.message || error}`);
            if (submitBtn) {
                submitBtn.disabled = false;
                const btnText = submitBtn.querySelector('.btn-text');
                const btnSpinner = submitBtn.querySelector('.btn-spinner');
                if (btnText) btnText.style.display = 'inline';
                if (btnSpinner) btnSpinner.style.display = 'none';
            }
        }
    },

    /**
     * Renders a celebration screen replacing the order form.
     */
    renderSuccessScreen(savedOrder, orderData) {
        const container = document.getElementById('order-form-container') || document.getElementById('inline-order-form');
        if (!container) return;

        const orderRef = (savedOrder.id || 'RNP' + Date.now()).substring(0, 8).toUpperCase();
        
        // Direct WhatsApp follow-up link for the customer
        const shopWaMsg = encodeURIComponent(
            `Hi Rose n Petals! I just placed order #${orderRef} for "${orderData.bouquetName}" on your website. Looking forward to your confirmation!`
        );
        const shopWaUrl = `https://api.whatsapp.com/send?phone=${this.SHOP_PHONE}&text=${shopWaMsg}`;

        container.innerHTML = `
            <div class="order-success-screen" role="status" aria-live="polite">
                <div class="success-confetti-badge">🎉</div>
                <h2 class="success-heading">Order Request Received!</h2>
                <p class="success-message">
                    We are checking our fresh flower stock and will confirm your order via WhatsApp in less than 10 minutes.
                </p>

                <div class="order-summary-card">
                    <div class="summary-card-header">
                        <span class="order-ref-label">Order Reference</span>
                        <span class="order-ref-code">#${orderRef}</span>
                    </div>

                    <div class="summary-details-list">
                        <div class="summary-row">
                            <span class="summary-label">Bouquet:</span>
                            <span class="summary-val font-semibold">${escapeHtml(orderData.bouquetName)}</span>
                        </div>
                        <div class="summary-row">
                            <span class="summary-label">Total Amount:</span>
                            <span class="summary-val price-highlight">₹${orderData.price}</span>
                        </div>
                        <div class="summary-row">
                            <span class="summary-label">Recipient:</span>
                            <span class="summary-val">${escapeHtml(orderData.recipientName)}</span>
                        </div>
                        <div class="summary-row">
                            <span class="summary-label">Delivery Slot:</span>
                            <span class="summary-val">${orderData.deliveryDate} (${orderData.timeSlot})</span>
                        </div>
                        <div class="summary-row">
                            <span class="summary-label">Delivery Address:</span>
                            <span class="summary-val">${escapeHtml(orderData.deliveryAddress)}, PIN: <strong>${orderData.pincode}</strong></span>
                        </div>
                        ${orderData.cardMessage && orderData.cardMessage !== 'None' ? `
                        <div class="summary-row">
                            <span class="summary-label">Card Message:</span>
                            <span class="summary-val italic">"${escapeHtml(orderData.cardMessage)}"</span>
                        </div>` : ''}
                        <div class="summary-row">
                            <span class="summary-label">WhatsApp Confirmation To:</span>
                            <span class="summary-val highlight-phone">${orderData.customerPhone}</span>
                        </div>
                        <div class="summary-row">
                            <span class="summary-label">Status:</span>
                            <span class="status-badge-pending">⏳ Checking Fresh Stock</span>
                        </div>
                    </div>
                </div>

                <div class="success-next-steps">
                    <h4>What happens next?</h4>
                    <ol class="next-steps-list">
                        <li>Our florist reviews your requested flowers & slot.</li>
                        <li>You will receive a WhatsApp message within 10 minutes with payment QR & order confirmation.</li>
                        <li>Fresh flowers are hand-crafted and delivered to your doorstep! 🌸</li>
                    </ol>
                </div>

                <div class="success-actions-row">
                    <a href="${shopWaUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp-direct">
                        <span>💬 Message Florist on WhatsApp</span>
                    </a>
                    <a href="/catalog" class="btn btn-browse-more">
                        <span>Browse More Bouquets</span>
                    </a>
                </div>
            </div>
        `;

        // Smooth scroll to success screen
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};

// Helper to escape HTML tags in customer inputs
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
