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

    // ── Form Wipe Protection: Capture & Restore Pending Checkout State ──
    savePendingCheckoutState() {
        const form = document.getElementById('bouquet-order-form');
        if (!form) return;
        try {
            const formData = new FormData(form);
            const state = {
                recipientName: (formData.get('recipientName') || '').trim(),
                customerPhone: (formData.get('customerPhone') || '').trim(),
                deliveryAddress: (formData.get('deliveryAddress') || '').trim(),
                deliveryPincode: (formData.get('deliveryPincode') || '').trim(),
                deliveryDate: formData.get('deliveryDate') || '',
                deliverySlot: formData.get('deliverySlot') || '',
                cardMessage: (formData.get('cardMessage') || '').trim(),
                paymentMethod: formData.get('paymentMethod') || 'UPI',
                savedAt: Date.now()
            };
            localStorage.setItem('pendingCheckoutState', JSON.stringify(state));
            console.log('[RNP Checkout] Captured pendingCheckoutState before login redirect:', state);
        } catch (e) {
            console.warn('[RNP Checkout] Could not save pendingCheckoutState:', e);
        }
    },

    restorePendingCheckoutState() {
        try {
            const raw = localStorage.getItem('pendingCheckoutState');
            if (!raw) return;
            const state = JSON.parse(raw);
            // Instantly clear key from localStorage so it auto-fills only once
            localStorage.removeItem('pendingCheckoutState');

            const form = document.getElementById('bouquet-order-form');
            if (!form || !state) return;

            console.log('[RNP Checkout] Auto-filling checkout form with pendingCheckoutState:', state);

            if (state.recipientName) {
                const el = document.getElementById('recipientName');
                if (el) el.value = state.recipientName;
            }
            if (state.customerPhone) {
                const el = document.getElementById('customerPhone');
                if (el) {
                    el.value = state.customerPhone;
                    el.dataset.prefilled = 'false';
                }
            }
            if (state.deliveryAddress) {
                const el = document.getElementById('deliveryAddress');
                if (el) {
                    el.value = state.deliveryAddress;
                    el.dataset.prefilled = 'false';
                }
            }
            if (state.deliveryPincode) {
                const el = document.getElementById('deliveryPincode');
                if (el) {
                    el.value = state.deliveryPincode;
                    el.dataset.prefilled = 'false';
                    this.validatePincodeLive(state.deliveryPincode);
                }
            }
            if (state.deliveryDate) {
                const el = document.getElementById('deliveryDate');
                if (el) el.value = state.deliveryDate;
            }
            if (state.deliverySlot) {
                const el = document.getElementById('deliverySlot');
                if (el) el.value = state.deliverySlot;
            }
            if (state.cardMessage) {
                const el = document.getElementById('cardMessage');
                if (el) el.value = state.cardMessage;
            }
            if (state.paymentMethod) {
                const radio = form.querySelector(`input[name="paymentMethod"][value="${state.paymentMethod}"]`);
                if (radio) radio.checked = true;
            }
        } catch (e) {
            console.warn('[RNP Checkout] Failed to restore pendingCheckoutState:', e);
        }
    },

    /**
     * Strictly restricts delivery time slots so that the final available slot is 8:00 PM - 9:00 PM.
     * Removes 9-10 PM, 10-11 PM, and 11-12 AM slots.
     */
    sanitizeDeliveryTimeSlots() {
        const slotSelect = document.getElementById('deliverySlot');
        if (!slotSelect) return;
        const invalidSlots = ['9:00 PM - 10:00 PM', '10:00 PM - 11:00 PM', '11:00 PM - 12:00 AM', '11:00 PM - 12:00 PM'];
        Array.from(slotSelect.options).forEach(opt => {
            if (invalidSlots.some(inv => opt.value.includes(inv) || opt.text.includes(inv))) {
                opt.remove();
            }
        });
        const has8to9 = Array.from(slotSelect.options).some(opt => opt.value.includes('8:00 PM - 9:00 PM'));
        if (!has8to9) {
            const opt = document.createElement('option');
            opt.value = '8:00 PM - 9:00 PM';
            opt.textContent = '8:00 PM - 9:00 PM';
            slotSelect.appendChild(opt);
        }
    },

    initFormListener() {
        const form = document.getElementById('bouquet-order-form');
        if (!form) return;

        // Fetch dynamic shop configuration (e.g. support phone)
        fetch('/api/config')
            .then(res => res.json())
            .then(cfg => {
                if (cfg && cfg.shopPhone) {
                    this.SHOP_PHONE = cfg.shopPhone;
                }
            })
            .catch(() => {});

        // Restrict delivery time slots (strictly end at 8:00 PM - 9:00 PM)
        this.sanitizeDeliveryTimeSlots();

        // Restore pending checkout state if available
        this.restorePendingCheckoutState();

        // Save form state if customer clicks any login or switch account link
        document.addEventListener('click', (e) => {
            const loginLink = e.target.closest('#rnp-modal-login-btn, .user-status-switch, a[href*="/login"]');
            if (loginLink && document.getElementById('bouquet-order-form')) {
                this.savePendingCheckoutState();
            }
        });

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

        // Real-time Phone Number numeric sanitization (10 digits max)
        const phoneInput = document.getElementById('customerPhone');
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
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
                // Restore form inputs if user just completed login flow
                this.restorePendingCheckoutState();

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

                // Pre-fill Phone Number input from user profile (10 digits, if not manually edited)
                const phoneInput = document.getElementById('customerPhone');
                if (phoneInput && phone) {
                    if (!phoneInput.value.trim() || phoneInput.dataset.prefilled !== 'false') {
                        phoneInput.value = String(phone).replace(/\D/g, '').slice(-10);
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
            // Form Wipe Protection: Capture current form state before login prompt
            this.savePendingCheckoutState();
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
            // Form Wipe Protection: Capture current form state before login prompt
            this.savePendingCheckoutState();
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

        // Strict 10-Digit Phone Validation (prepends +91 behind the scenes)
        const rawPhone = inputPhone || profile.whatsapp || '';
        let digits = String(rawPhone).replace(/\D/g, '').slice(-10);

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

    // ── Live Order Polling & Sound State ──
    _statusPollTimer: null,

    stopStatusPolling() {
        if (this._statusPollTimer) {
            clearInterval(this._statusPollTimer);
            this._statusPollTimer = null;
        }
    },

    playGentleNotificationSound() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            if (ctx.state === 'suspended') {
                ctx.resume();
            }
            const now = ctx.currentTime;
            // Gentle melodic two-bell chime
            const notes = [
                { freq: 523.25, start: 0, dur: 0.35 },    // C5
                { freq: 659.25, start: 0.14, dur: 0.35 }, // E5
                { freq: 783.99, start: 0.28, dur: 0.60 }  // G5
            ];
            notes.forEach(n => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(n.freq, now + n.start);
                gain.gain.setValueAtTime(0, now + n.start);
                gain.gain.linearRampToValueAtTime(0.22, now + n.start + 0.03);
                gain.gain.exponentialRampToValueAtTime(0.001, now + n.start + n.dur);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now + n.start);
                osc.stop(now + n.start + n.dur);
            });
        } catch (e) {
            console.log('[RNP Audio] Chime notification bypassed:', e);
        }
    },

    startLiveStatusPolling(orderId, orderData) {
        this.stopStatusPolling();
        if (!orderId) return;

        console.log(`[RNP Live Tracking] Polling status every 10s for order #${orderId}`);

        const pollStatus = async () => {
            try {
                const res = await fetch(`/api/orders/status/${encodeURIComponent(orderId)}`);
                if (!res.ok) return;
                const data = await res.json();
                if (!data || !data.success) return;

                const currentStatus = (data.status || '').toUpperCase();

                if (currentStatus === 'PAYMENT_PENDING' && data.paymentLink) {
                    // Instantly stop polling
                    this.stopStatusPolling();

                    // Play gentle notification sound
                    this.playGentleNotificationSound();

                    // Trigger celebratory confetti burst
                    if (typeof window.confetti === 'function') {
                        window.confetti({
                            particleCount: 80,
                            spread: 70,
                            origin: { y: 0.55 }
                        });
                    }

                    // Render massive Pay Now button and accepted view
                    this.renderPaymentUnlockedUI(data, orderData);
                } else if (currentStatus === 'PAID' || currentStatus === 'CONFIRMED') {
                    // Instantly stop polling — payment confirmed!
                    this.stopStatusPolling();
                    this.playGentleNotificationSound();
                    if (typeof window.confetti === 'function') {
                        window.confetti({
                            particleCount: 100,
                            spread: 80,
                            origin: { y: 0.55 }
                        });
                    }
                    this.renderPaidSuccessUI(data, orderData);
                } else if (currentStatus === 'CANCELLED_SHOP_BUSY') {
                    this.stopStatusPolling();
                    this.renderShopBusyUI(data, orderData);
                }
            } catch (err) {
                console.warn('[RNP Live Tracking] Polling fetch error:', err);
            }
        };

        // Poll every 10 seconds
        this._statusPollTimer = setInterval(pollStatus, 10000);
    },

    renderPaidSuccessUI(statusData, orderData) {
        const liveActionContainer = document.getElementById('live-order-action-container');
        const statusBadge = document.getElementById('summary-status-badge');

        if (statusBadge) {
            statusBadge.className = 'status-badge-confirmed';
            statusBadge.innerHTML = '✅ Payment Received &bull; Handcrafting Bouquet';
        }

        if (liveActionContainer) {
            liveActionContainer.innerHTML = `
                <div class="massive-payment-card" style="background: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%); border: 1.5px solid #10B981;">
                    <div class="payment-card-badge" style="background: #059669; color: #FFFFFF;">
                        <span class="pulse-sparkle">💰</span>
                        <span>PAYMENT CONFIRMED &bull; ORDER IN PRODUCTION</span>
                    </div>
                    <h3 class="payment-card-heading" style="color: #065F46;">Thank you! We Received Your Payment</h3>
                    <p class="payment-card-desc" style="color: #047857;">
                        Your order is now being handcrafted by our florist with fresh blooms. Our delivery rider will contact the recipient upon arrival!
                    </p>
                    <div style="margin-top: 18px; display: flex; gap: 12px; flex-wrap: wrap;">
                        <a href="/profile.html" class="btn btn-primary" style="display: inline-block; padding: 10px 22px; text-decoration: none; border-radius: 9999px; font-weight: 700;">
                            View in My Orders &rarr;
                        </a>
                        <a href="/catalog" class="btn" style="display: inline-block; padding: 10px 22px; text-decoration: none; border-radius: 9999px; background: #FFFFFF; color: #065F46; border: 1px solid #10B981; font-weight: 600;">
                            Browse More Flowers
                        </a>
                    </div>
                </div>
            `;
        }
    },

    renderPaymentUnlockedUI(statusData, orderData) {
        const liveActionContainer = document.getElementById('live-order-action-container');
        const statusBadge = document.getElementById('summary-status-badge');
        const paymentLink = statusData.paymentLink;
        const price = statusData.price || orderData.price || orderData.total || 0;
        const customerEmail = statusData.customerEmail || orderData.customerEmail || '';
        const recipientName = orderData.recipientName || 'recipient';

        if (statusBadge) {
            statusBadge.className = 'status-badge-payment-pending';
            statusBadge.innerHTML = '💳 Payment Pending &bull; Approved';
        }

        if (liveActionContainer) {
            liveActionContainer.innerHTML = `
                <div class="massive-payment-card animate-glow-pulse" id="massive-payment-card">
                    <div class="payment-card-badge">
                        <span class="pulse-sparkle">🌸</span>
                        <span>FLORIST APPROVED &bull; SECURE CHECKOUT</span>
                    </div>
                    <h3 class="payment-card-heading">Your Secure Payment Link is Ready!</h3>
                    <p class="payment-card-desc">
                        Our florist is ready to handcraft your fresh flowers. Click the button below to complete payment:
                    </p>

                    <a href="${escapeHtml(paymentLink)}" target="_blank" rel="noopener noreferrer" class="btn-pay-now-massive" id="live-pay-now-btn">
                        <span class="pay-btn-main">💳 Pay Now (₹${price})</span>
                        <span class="pay-btn-sub">Click to pay securely via Razorpay (UPI / Cards / Netbanking) &rarr;</span>
                    </a>

                    <div class="payment-card-footer">
                        <div class="footer-note-item">
                            <span class="footer-icon">✉️</span>
                            <span>This payment link was also sent to <strong>${escapeHtml(customerEmail || 'your email')}</strong>.</span>
                        </div>
                        <div class="footer-note-item">
                            <span class="footer-icon">🚚</span>
                            <span>After payment, bouquet crafting begins and our delivery agent will contact ${escapeHtml(recipientName)} upon arrival.</span>
                        </div>
                    </div>
                </div>
            `;

            const payBtn = document.getElementById('live-pay-now-btn');
            if (payBtn) {
                payBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    },

    renderShopBusyUI(statusData, orderData) {
        const liveActionContainer = document.getElementById('live-order-action-container');
        const statusBadge = document.getElementById('summary-status-badge');
        const shopPhone = this.SHOP_PHONE || "917289996804";
        const supportWaUrl = `https://wa.me/${shopPhone}?text=Hi%20Rose%20n%20Petals,%20I%20need%20help%20with%20my%20order!`;

        if (statusBadge) {
            statusBadge.className = 'status-badge-cancelled';
            statusBadge.innerHTML = '❌ Shop Busy &bull; Capacity Reached';
        }

        if (liveActionContainer) {
            liveActionContainer.innerHTML = `
                <div class="shop-busy-card">
                    <div class="busy-icon">⏳</div>
                    <h3 class="busy-heading">Florist Currently at Full Capacity</h3>
                    <p class="busy-desc">
                        Our florists are currently preparing a high volume of orders for this slot. Please chat with us on WhatsApp so we can arrange priority delivery for you.
                    </p>
                    <a href="${supportWaUrl}" target="_blank" rel="noopener noreferrer" class="btn-whatsapp-support">
                        <span>Need help? WhatsApp Us</span>
                    </a>
                </div>
            `;
        }
    },

    /**
     * Renders a redesigned Live Tracking success screen replacing the order form.
     */
    renderSuccessScreen(savedOrder, orderData) {
        const container = document.getElementById('order-form-container') || document.getElementById('inline-order-form');
        if (!container) return;

        const rawOrderId = savedOrder.id || `RNP${Date.now()}`;
        const orderRef = rawOrderId.startsWith('RNP-')
            ? rawOrderId
            : `RNP-${rawOrderId.substring(0, 8).toUpperCase()}`;

        const shopPhone = this.SHOP_PHONE || "917289996804";
        const supportWaUrl = `https://wa.me/${shopPhone}?text=Hi%20Rose%20n%20Petals,%20I%20need%20help%20with%20my%20order!`;

        container.innerHTML = `
            <div class="order-success-screen" role="status" aria-live="polite">
                
                <!-- 🌸 EXACT EXPECTATION SETTING CARD -->
                <div class="success-expectation-card">
                    <div class="live-radar-badge">
                        <span class="live-radar-dot"></span>
                        <span class="live-radar-label">LIVE ORDER TRACKING ACTIVE</span>
                    </div>

                    <div class="expectation-text-block">
                        <h2 class="success-heading">Your order request is received! 🌸</h2>
                        <p class="expectation-p">Our florist will review and accept your order within 10 to 15 minutes.</p>
                        <p class="expectation-p">Once accepted, your secure payment link will appear automatically on this page and will also be sent to your email.</p>
                        <p class="expectation-p">After your payment is complete, we will begin crafting your bouquet, and our delivery agent will contact the provided phone number upon arrival. You will also receive a final WhatsApp confirmation!</p>
                    </div>
                </div>

                <!-- ⚡ DYNAMIC LIVE ACTION / PAYMENT CONTAINER -->
                <div id="live-order-action-container" class="live-order-action-container">
                    <div class="live-polling-banner">
                        <div class="radar-spinner-wrap">
                            <div class="radar-pulse-ring"></div>
                            <div class="radar-pulse-core"></div>
                        </div>
                        <div class="live-polling-text">
                            <h4 class="polling-title">Awaiting Florist Review</h4>
                            <p class="polling-desc">
                                Live tracking is active (auto-checking every 10s). Stay on this screen — your <strong>Pay Now</strong> button will appear here automatically the moment our florist accepts.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- 📋 ORDER SUMMARY CARD -->
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
                            <span class="summary-val price-highlight">₹${orderData.total || orderData.price}</span>
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
                            <span class="summary-label">WhatsApp Updates To:</span>
                            <span class="summary-val highlight-phone">${orderData.customerPhone}</span>
                        </div>
                        ${orderData.customerEmail ? `
                        <div class="summary-row">
                            <span class="summary-label">Email Confirmation To:</span>
                            <span class="summary-val">${escapeHtml(orderData.customerEmail)}</span>
                        </div>` : ''}
                        <div class="summary-row">
                            <span class="summary-label">Live Status:</span>
                            <span id="summary-status-badge" class="status-badge-pending">⏳ Reviewing Fresh Stock</span>
                        </div>
                    </div>
                </div>

                <!-- 💬 INBOUND CUSTOMER SUPPORT BUTTON -->
                <div class="success-support-card">
                    <div class="support-info-text">
                        <h4 class="support-heading">Need help with your order?</h4>
                        <p class="support-desc">Have a question about timing, customization, or delivery? Chat directly with our florist on WhatsApp.</p>
                    </div>
                    <a href="${supportWaUrl}" target="_blank" rel="noopener noreferrer" class="btn-whatsapp-support" id="btn-whatsapp-support">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        <span>Need help? WhatsApp Us</span>
                    </a>
                </div>

                <!-- 🛒 ACTIONS ROW -->
                <div class="success-actions-row">
                    <a href="/catalog" class="btn btn-browse-more">
                        <span>Browse More Bouquets</span>
                    </a>
                </div>

            </div>
        `;

        // Update floating WhatsApp button if present on page
        const globalFloat = document.querySelector('.whatsapp-float');
        if (globalFloat) {
            globalFloat.href = supportWaUrl;
            globalFloat.setAttribute('title', 'Need help? WhatsApp Us');
        }

        // Smooth scroll to top of success screen
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Start live polling every 10 seconds for the order status
        this.startLiveStatusPolling(savedOrder.id, orderData);
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
