// js/pages.js

window.Pages = {
    renderHomePage(container) {
        document.title = "Flower Delivery in Ghaziabad | Fresh Bouquets – Rose n Petals";

        const bouquets = Store.getAllProducts();
        const bestSellers = bouquets.filter(b => b.is_best_seller).slice(0, 8);
        const occasionTags = ["All", ...Store.getAllOccasionTags(), "Under ₹499"];

        const stepsData = [
            { title: "Browse Bouquets", description: "Explore our fresh handmade arrangements online or WhatsApp us your idea." },
            { title: "WhatsApp Your Order", description: "Send us your bouquet choice, delivery address in Ghaziabad, and preferred time." },
            { title: "Delivered in Under 1 Hour", description: "We confirm your order and deliver fresh to your door — anywhere in Ghaziabad." }
        ];

        let html = `
            <!-- Hero Section -->
            <section class="hero-section">
                <div class="hero-content container">
                    <span class="hero-label">🌹 Ghaziabad's Best Florist</span>
                    <h1 class="hero-title" style="color: #1A1A1A;">Fresh Flower Delivery in Ghaziabad</h1>
                    <p class="hero-subtitle" style="color: #555555; font-size: 16px;">Handmade bouquets delivered to your door in under 1 hour.<br>Serving Kavi Nagar, Raj Nagar, Indirapuram, Vaishali & more.</p>
                    <p style="font-size: 14px; color: #CC0000; margin-bottom: 28px; font-weight: 500;">Starting from ₹200 · No app needed · Easy WhatsApp order</p>
                    <div class="hero-buttons">
                        <a href="https://wa.me/917289996804?text=Hi%2C%20I%20want%20to%20order%20a%20bouquet%20from%20Rose%20n%20Petals.%20Please%20help%20me." target="_blank" rel="noopener noreferrer" class="hero-btn-primary" style="background: #CC0000; color: white; border-radius: 8px; padding: 14px 28px; font-size: 15px; font-weight: 600; display: inline-block; box-sizing: border-box;">Order on WhatsApp</a>
                        <a href="/catalog" class="hero-btn-secondary" style="background: white; color: #CC0000; border: 2px solid #CC0000; border-radius: 8px; padding: 12px 28px; font-size: 15px; font-weight: 600; display: inline-block; box-sizing: border-box;">Browse Bouquets</a>
                    </div>
                </div>
            </section>
            
            <!-- Category Strip -->
            <section class="category-strip">
                <h2>Shop by Occasion</h2>
                <div class="category-cards">
                    <a href="/catalog?filter=Birthday" class="category-card">
                        <img src="https://res.cloudinary.com/dlg6d4qbh/image/upload/v1779475822/Carnival_Mix_d2c4cl.png" alt="Birthday flowers delivered in Ghaziabad">
                        <span>Birthday</span>
                    </a>
                    <a href="/catalog?filter=Anniversary" class="category-card">
                        <img src="https://res.cloudinary.com/dlg6d4qbh/image/upload/v1779516704/Harmony_Blush_bpdbwl.png" alt="Anniversary flower bouquet Ghaziabad">
                        <span>Anniversary</span>
                    </a>
                    <a href="/catalog?filter=Celebration" class="category-card">
                        <img src="https://res.cloudinary.com/dlg6d4qbh/image/upload/v1779505186/Royal_Sunflower_z1zf1o.png" alt="Celebration flowers Ghaziabad">
                        <span>Celebration</span>
                    </a>
                    <a href="/catalog?filter=Romantic" class="category-card">
                        <img src="https://res.cloudinary.com/dlg6d4qbh/image/upload/v1779505954/blush_carnation_jecbzq.png" alt="Romantic flowers Ghaziabad">
                        <span>Romantic</span>
                    </a>
                    <a href="/catalog?filter=Get%20Well%20Soon" class="category-card">
                        <img src="https://res.cloudinary.com/dlg6d4qbh/image/upload/v1779504779/Tulip_Charm_qi8hg1.png" alt="Get well soon flowers Ghaziabad">
                        <span>Get Well Soon</span>
                    </a>
                    <a href="/catalog?filter=Sorry" class="category-card">
                        <img src="https://res.cloudinary.com/dlg6d4qbh/image/upload/v1779506580/Vitage_Tale_n6pxuo.png" alt="Sorry flowers Ghaziabad">
                        <span>Sorry</span>
                    </a>
                    <a href="/catalog?filter=Same%20Day" class="category-card">
                        <img src="https://res.cloudinary.com/dlg6d4qbh/image/upload/v1779467296/Sunflower_Burst_Bouquet_rkp5xf.png" alt="Same day flower delivery Ghaziabad">
                        <span>Same Day</span>
                    </a>
                    <a href="/catalog?filter=Sympathy" class="category-card">
                        <img src="https://res.cloudinary.com/dlg6d4qbh/image/upload/v1779476670/Ocean_MIst_vcnm4j.png" alt="Sympathy flowers Ghaziabad">
                        <span>Sympathy</span>
                    </a>
                </div>
            </section>
            
            <!-- Trust Signals Bar -->
            <div class="trust-bar">
                <div class="trust-container">
                    <div class="trust-item">✦ Delivered in Under 1 Hour</div>
                    <div class="trust-item">✦ Fresh Handmade Bouquets Daily</div>
                    <div class="trust-item">✦ Starting from ₹200</div>
                    <div class="trust-item">✦ Order on WhatsApp — No App Needed</div>
                </div>
            </div>
            
            <!-- Delivery Area -->
            <section class="delivery-area-section">
                <span style="font-size: 12px; color: rgba(255,255,255,0.7); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px; display: block;">📍 Where We Deliver</span>
                <h2 style="font-size: 28px; color: white; font-weight: 700; margin-bottom: 8px;">We Deliver Across All of Ghaziabad</h2>
                <p style="font-size: 15px; color: rgba(255,255,255,0.85); margin-bottom: 32px;">Fresh bouquets to your door in under 1 hour</p>
                <div class="area-cards-grid">
                    <div class="area-card"><span class="area-emoji">🏡</span>Kavi Nagar</div>
                    <div class="area-card"><span class="area-emoji">🌿</span>Raj Nagar</div>
                    <div class="area-card"><span class="area-emoji">🏙️</span>Indirapuram</div>
                    <div class="area-card"><span class="area-emoji">🌸</span>Vaishali</div>
                    <div class="area-card"><span class="area-emoji">🌳</span>Vasundhara</div>
                    <div class="area-card"><span class="area-emoji">🏘️</span>Mohan Nagar</div>
                    <div class="area-card"><span class="area-emoji">🌻</span>Vijay Nagar</div>
                    <div class="area-card"><span class="area-emoji">🏗️</span>Crossing Republik</div>
                </div>
                <p style="color: rgba(255,255,255,0.8); font-size: 14px; margin-bottom: 20px;">Not sure if we deliver to your area?<br>Just WhatsApp us — we will reach you!</p>
                <a href="https://wa.me/917289996804?text=Hi%2C%20I%20want%20to%20order%20a%20bouquet%20from%20Rose%20n%20Petals.%20Please%20help%20me." target="_blank" rel="noopener noreferrer" class="hero-btn-primary" style="background: white; color: #CC0000; border-radius: 8px; padding: 14px 32px; font-size: 15px; font-weight: 700; box-shadow: 0 4px 16px rgba(0,0,0,0.2); display: inline-block; transition: all 0.2s ease;">Order on WhatsApp Now</a>
            </section>
            
            <!-- Shop by Occasion -->
            <section class="section container">
                <h2 class="section-title">Shop by occasion</h2>
                ${Components.createFilterChips(occasionTags, 'All')}
            </section>
            
            <!-- Best Sellers -->
            <section class="section section-light">
                <div class="container">
                    <h2 class="section-title">Best Sellers</h2>
                    <div class="product-grid">
                        ${bestSellers.map((b, i) => Components.createProductCard(b, i)).join('')}
                    </div>
                    ${bestSellers.length === 0 ? '<p class="text-center text-muted">No best sellers found currently.</p>' : ''}
                </div>
            </section>
            
            <!-- Custom Bouquet Banner -->
            <section class="section container" style="padding-top: 0;">
                ${Components.createCustomBouquetBanner()}
            </section>
            
            <!-- How it works -->
            <section id="how-it-works" class="section container">
                <h2 class="section-title">How it works</h2>
                ${Components.createSteps(stepsData)}
            </section>
            
            <!-- About Rose n Petals — Since 1999 -->
            <section class="section section-light">
                <div class="container">
                    <div class="about-card p-4" style="background: white; padding: 32px;">
                        <h2 class="section-title text-left mb-4" style="text-align: left;">About Rose n Petals</h2>

                        <h3 style="font-size:19px;font-weight:600;color:#1a1a1a;margin-bottom:12px;">Ghaziabad's Neighbourhood Florist — Since 1999</h3>
                        <p style="font-size:16px;color:#444;line-height:1.75;margin-bottom:16px;">Rose n Petals has been handcrafting flower bouquets in Ghaziabad since 1999. What started as a small flower shop in Kavi Nagar has grown into one of the most trusted names for flower delivery across Ghaziabad and the NCR. We are not a website that outsources your order to whoever is available. We are a family-run shop — and every bouquet that leaves our hands has been made by us, with flowers we picked that morning.</p>

                        <h3 style="font-size:19px;font-weight:600;color:#1a1a1a;margin-top:28px;margin-bottom:12px;">Fresh Flowers, Every Single Day</h3>
                        <p style="font-size:16px;color:#444;line-height:1.75;margin-bottom:16px;">We source our flowers daily from wholesale flower markets. Roses, lilies, sunflowers, carnations, gerberas — whatever is freshest that morning is what goes into your bouquet. We never use flowers that are more than 24 hours old in our arrangements. This is why customers who order from us come back — because the flowers last, and they look exactly as good in person as they do in the photos.</p>

                        <h3 style="font-size:19px;font-weight:600;color:#1a1a1a;margin-top:28px;margin-bottom:12px;">Delivery Across All of Ghaziabad in Under 1 Hour</h3>
                        <p style="font-size:16px;color:#444;line-height:1.75;margin-bottom:16px;">We deliver to every part of Ghaziabad — Kavi Nagar, Raj Nagar, Indirapuram, Vaishali, Vasundhara, Mohan Nagar, Vijay Nagar, and Crossing Republik. Our average delivery time is under 1 hour from the moment you place your order. For urgent orders — last-minute birthdays, forgotten anniversaries — WhatsApp us and we will do our best to get it to you as fast as possible. We have been doing this for 26 years. We know how to move quickly.</p>

                        <h3 style="font-size:19px;font-weight:600;color:#1a1a1a;margin-top:28px;margin-bottom:12px;">Custom Bouquets for Every Occasion</h3>
                        <p style="font-size:16px;color:#444;line-height:1.75;margin-bottom:16px;">Birthdays, anniversaries, graduations, weddings, housewarmings, hospital visits, condolence flowers — we make arrangements for every occasion and every budget. Our bouquets start at ₹200 and go up to premium custom designs. If you have a specific flower, colour, or style in mind, just tell us. Custom orders are one of the things we do best — after 26 years, we have made every type of arrangement you can imagine.</p>

                        <h3 style="font-size:19px;font-weight:600;color:#1a1a1a;margin-top:28px;margin-bottom:12px;">Why Order From a Neighbourhood Florist?</h3>
                        <p style="font-size:16px;color:#444;line-height:1.75;margin-bottom:16px;">Large national flower delivery platforms charge high delivery fees, use franchise florists with inconsistent quality, and have no accountability once your order is placed. When you order from Rose n Petals, you are talking directly to the people making your bouquet. If something is not right, you call us — not a customer service centre. We have a 26-year reputation in this city to uphold, and we take that seriously with every single order.</p>

                        <h3 style="font-size:19px;font-weight:600;color:#1a1a1a;margin-top:28px;margin-bottom:12px;">How to Order — Simple WhatsApp Process</h3>
                        <p style="font-size:16px;color:#444;line-height:1.75;margin-bottom:16px;">Browse our bouquets on this website or on our Instagram. When you have found something you like, WhatsApp us at +91 7289996804 with the bouquet name, your delivery address in Ghaziabad, and your preferred time. We will confirm your order within minutes and deliver fresh flowers to your door. No app needed, no complicated checkout, no waiting. Just a simple conversation and a beautiful bouquet on its way.</p>

                        <div class="mt-4" style="border-top: 1px solid #eee; padding-top: 16px;">
                            <p style="font-size:15px;color:#444;">KD Market, Block D, Sector 18, Kavi Nagar, Ghaziabad – 201002</p>
                            <p style="font-size:15px;color:#444;">Phone: <a href="tel:+919810244455" style="color:#CC0000;">+91 9810244455</a></p>
                            <p style="font-size:15px;color:#444;">WhatsApp: <a href="https://wa.me/917289996804?text=Hi%2C%20I%20want%20to%20order%20a%20bouquet%20from%20Rose%20n%20Petals.%20Please%20help%20me." target="_blank" rel="noopener noreferrer" style="color:#CC0000;">+91 7289996804</a></p>
                            <p style="font-size:15px;color:#444;">Hours: Every day, 8 AM – 10 PM</p>
                        </div>
                    </div>
                </div>
            </section>
            
            <!-- FAQ Section -->
            <section class="section">
                <div class="container">
                    <h2 class="section-title">Frequently Asked Questions</h2>
                    <div class="faq-accordion" style="max-width: 800px; margin: 0 auto;">

                        <details style="border-bottom: 1px solid #efefef; padding: 16px 0;">
                            <summary style="font-weight:600;font-size:15px;cursor:pointer;color:#1a1a1a;list-style:none;">Do you deliver on Sundays and public holidays?</summary>
                            <p style="margin-top:10px;font-size:15px;color:#555;line-height:1.6;">Yes. We are open every day of the year, 8 AM to 10 PM. Sundays, national holidays, festival days — the shop runs regardless. If you need flowers on Diwali morning or on New Year's Day, we are here.</p>
                        </details>

                        <details style="border-bottom: 1px solid #efefef; padding: 16px 0;">
                            <summary style="font-weight:600;font-size:15px;cursor:pointer;color:#1a1a1a;list-style:none;">Can I add a personal note with the bouquet?</summary>
                            <p style="margin-top:10px;font-size:15px;color:#555;line-height:1.6;">Yes. When you message us on WhatsApp, simply include the note text. We will handwrite it on a card and include it with the bouquet. There is no extra charge for the note.</p>
                        </details>

                        <details style="border-bottom: 1px solid #efefef; padding: 16px 0;">
                            <summary style="font-weight:600;font-size:15px;cursor:pointer;color:#1a1a1a;list-style:none;">What if I need flowers in under 30 minutes?</summary>
                            <p style="margin-top:10px;font-size:15px;color:#555;line-height:1.6;">For areas close to our Kavi Nagar shop — including Kavi Nagar itself, parts of Vijay Nagar, and nearby Raj Nagar — delivery in under 30 minutes is often possible. WhatsApp us at +91 7289996804 immediately. We will tell you honestly whether we can make it. We do not promise what we cannot deliver.</p>
                        </details>

                        <details style="border-bottom: 1px solid #efefef; padding: 16px 0;">
                            <summary style="font-weight:600;font-size:15px;cursor:pointer;color:#1a1a1a;list-style:none;">Can I place a same-day order?</summary>
                            <p style="margin-top:10px;font-size:15px;color:#555;line-height:1.6;">Yes. We accept same-day orders until 9 PM for most areas, with delivery by 10 PM. For urgent situations, contact us on WhatsApp and we will confirm what is possible given your location and the current time.</p>
                        </details>

                        <details style="border-bottom: 1px solid #efefef; padding: 16px 0;">
                            <summary style="font-weight:600;font-size:15px;cursor:pointer;color:#1a1a1a;list-style:none;">What payment methods do you accept?</summary>
                            <p style="margin-top:10px;font-size:15px;color:#555;line-height:1.6;">We accept UPI and bank transfer only. No cash on delivery, no credit card payment at the door. Payment is confirmed before the bouquet enters preparation, which is why delivery is faster — we are not waiting on a payment upon arrival.</p>
                        </details>

                        <details style="border-bottom: 1px solid #efefef; padding: 16px 0;">
                            <summary style="font-weight:600;font-size:15px;cursor:pointer;color:#1a1a1a;list-style:none;">What bouquets do you have under ₹500?</summary>
                            <p style="margin-top:10px;font-size:15px;color:#555;line-height:1.6;">Our range starts at ₹200 and includes rose bouquets, carnation arrangements, gerbera bunches, and mixed combinations. Under ₹500, you can get a clean, well-arranged bouquet suitable for birthdays, housewarmings, get well visits, or a simple gesture of affection. Send us a WhatsApp message with your budget and occasion — we will show you what we have.</p>
                        </details>

                        <details style="border-bottom: 1px solid #efefef; padding: 16px 0;">
                            <summary style="font-weight:600;font-size:15px;cursor:pointer;color:#1a1a1a;list-style:none;">How quickly do you respond on WhatsApp?</summary>
                            <p style="margin-top:10px;font-size:15px;color:#555;line-height:1.6;">We respond within 5 to 15 minutes during shop hours. For urgent orders, write URGENT in your first message and we will prioritise your order immediately.</p>
                        </details>

                        <details style="padding: 16px 0;">
                            <summary style="font-weight:600;font-size:15px;cursor:pointer;color:#1a1a1a;list-style:none;">Can I customise a bouquet?</summary>
                            <p style="margin-top:10px;font-size:15px;color:#555;line-height:1.6;">Yes. WhatsApp us with your idea — flowers, colours, budget, occasion — and we will create it for you starting from ₹200. Custom orders are one of the things we do best. After 26 years, we have made every type of arrangement you can imagine.</p>
                        </details>

                    </div>
                </div>
            </section>
        `;

        container.innerHTML = html;
        this.setupChipListeners('/catalog?filter=');
    },

    renderCatalogPage(container, activeFilterParam) {
        document.title = "Catalog - Rose n Petals";

        const decodedFilter = decodeURIComponent(activeFilterParam);
        const occasionTags = ["All", ...Store.getAllOccasionTags(), "Under ₹499"];
        const filteredProducts = Store.getProductsByOccasion(decodedFilter);

        let html = `
            <div class="page-header section-light">
                <div class="container">
                    <h1 class="mb-2">Our Bouquets</h1>
                    <p class="text-muted">Fresh, hand-arranged flowers for every moment.</p>
                </div>
            </div>
            
            <section class="section container">
                <!-- Filters -->
                <div class="mb-4">
                    ${Components.createFilterChips(occasionTags, decodedFilter)}
                </div>
                
                <!-- Grid -->
                <div class="product-grid">
                    ${filteredProducts.length > 0
                ? filteredProducts.map((b, i) => Components.createProductCard(b, i)).join('')
                : '<div class="empty-state"><p>No bouquets found for this occasion. Please try another filter.</p></div>'
            }
                </div>
                
                <!-- Custom Bouquet Banner -->
                ${Components.createCustomBouquetBanner()}
            </section>
        `;

        container.innerHTML = html;
        this.setupChipListeners('/catalog?filter=');
    },

    renderBouquetDetailPage(container, slug) {
        const decodedSlug = decodeURIComponent(slug);
        const bouquet = Store.getProductBySlug(decodedSlug);

        if (!bouquet) {
            container.innerHTML = `<div class="container section"><h2 class="text-center">Bouquet not found</h2><div class="text-center"><a href="/catalog" class="btn btn-primary mt-4">Back to Catalog</a></div></div>`;
            return;
        }

        document.title = `${bouquet.name} - Rose n Petals`;

        // Pick 4 related bouquets
        const related = Store.getAllProducts()
            .filter(p => p.id !== bouquet.id && p.occasion_tags.some(t => bouquet.occasion_tags.includes(t)))
            .slice(0, 4);

        // Fallback to any 4 if not enough related tags
        if (related.length < 4) {
            const others = Store.getAllProducts().filter(p => p.id !== bouquet.id && !related.find(r => r.id === p.id));
            related.push(...others.slice(0, 4 - related.length));
        }

        const tagsHtml = bouquet.occasion_tags.map(t => `<span class="badge detail-badge">${t}</span>`).join('');

        const detailImageHtml = bouquet.image_url
            ? `<img src="${bouquet.image_url}" alt="${bouquet.name}" class="detail-image">`
            : `<div class="detail-image placeholder-image"><span>Image coming soon</span></div>`;

        let html = `
            <!-- Product Detail Section -->
            <section class="section container detail-section">
                <div class="detail-grid">
                    <div class="detail-image-wrapper">
                        ${detailImageHtml}
                    </div>
                    <div class="detail-info">
                        <div class="detail-tags mb-2">${tagsHtml}</div>
                        <h1 class="detail-title">${bouquet.name}</h1>
                        <p class="detail-price mt-2 mb-4">₹${bouquet.price}</p>
                        
                        <div class="detail-desc mb-4">
                            <p>${bouquet.short_description}</p>
                        </div>
                        
                        <div class="local-promise-box mb-4">
                            <h4>🛡️ Local Promise</h4>
                            <ul class="promise-list">
                                <li>Local delivery available in Kavi Nagar & Raj Nagar</li>
                                <li>Custom message card available</li>
                                <li>Fresh flowers arranged to order</li>
                            </ul>
                        </div>
                        
                        <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:20px;">
                          <button 
                            class="btn btn-primary" 
                            style="width:100%;padding:14px;font-size:15px;font-weight:700;"
                            onclick="document.getElementById('bouquet-order-form').scrollIntoView({behavior:'smooth',block:'start'})">
                            Order this Bouquet
                          </button>
                          <button 
                            class="btn-add-cart-detail"
                            style="width:100%;padding:12px;font-size:14px;font-weight:600;background:white;color:#CC0000;border:2px solid #CC0000;border-radius:8px;cursor:pointer;"
                            onclick="window.CartUI.addItem('${bouquet.id}')">
                            + Add to Cart
                          </button>
                        </div>

                        <!-- Embedded Order Form -->
                        <div id="inline-order-form">
                            ${Components.createOrderForm(bouquet)}
                        </div>
                    </div>
                </div>
            </section>
            
            <!-- Related Bouquets -->
            ${related.length > 0 ? `
            <section class="section section-light">
                <div class="container">
                    <h2 class="section-title">You might also like</h2>
                    <div class="product-grid">
                        ${related.map(b => Components.createProductCard(b)).join('')}
                    </div>
                </div>
            </section>
            ` : ''}
            
            <!-- Sticky Mobile CTA -->
            <div class="mobile-sticky-cta">
                <div class="sticky-price-row">
                    <span>Total:</span>
                    <strong>₹${bouquet.price}</strong>
                </div>
                <div style="display:flex;flex-direction:column;gap:10px;margin-top:10px;width:100%;">
                  <button 
                    class="btn btn-primary" 
                    style="width:100%;padding:14px;font-size:15px;font-weight:700;"
                    onclick="document.getElementById('bouquet-order-form').scrollIntoView({behavior:'smooth',block:'start'})">
                    Order this Bouquet
                  </button>
                  <button 
                    class="btn-add-cart-detail"
                    style="width:100%;padding:12px;font-size:14px;font-weight:600;background:white;color:#CC0000;border:2px solid #CC0000;border-radius:8px;cursor:pointer;"
                    onclick="window.CartUI.addItem('${bouquet.id}')">
                    + Add to Cart
                  </button>
                </div>
            </div>
        `;

        container.innerHTML = html;

        // Initialize WhatsApp form listener
        WhatsApp.initFormListener();
    },

    // Helper to handle client-side filtering via chip clicks
    setupChipListeners(baseUrl) {
        document.querySelectorAll('.filter-chip').forEach(chip => {
            chip.addEventListener('click', (e) => {
                const filterValue = e.target.getAttribute('data-filter');
                const newUrl = baseUrl + encodeURIComponent(filterValue);
                window.history.pushState(null, '', newUrl);
                if (window.App) window.App.handleRouting();
            });
        });
    },
    // New SEO page: "flower delivery Ghaziabad"
    renderFlowerDeliveryGhaziabad(container) {
        document.title = "Flower Delivery in Ghaziabad | Rose n Petals";

        container.innerHTML = `
            <section class="section container">
                <div class="section-title">
                    <h1>Fresh Flower Delivery in Ghaziabad – Starting ₹200</h1>
                    <p class="text-muted">
                        Handmade bouquets with same-day delivery across Ghaziabad.
                        Order in 2 minutes on WhatsApp.
                    </p>
                    <a
                      href="https://api.whatsapp.com/send?phone=917289996804&text=${encodeURIComponent(
            "Hi, I want to order a bouquet for delivery in Ghaziabad."
        )}"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="btn btn-primary mt-3"
                    >
                      Order on WhatsApp
                    </a>
                </div>
            </section>

            <section class="section container">
                <h2 class="section-title">Why order from Rose n Petals?</h2>
                <ul class="feature-list">
                    <li><strong>Fresh handmade bouquets</strong><br/>Every order is made to order from our Kavi Nagar & Raj Nagar units.</li>
                    <li><strong>Same‑day delivery</strong><br/>Order before 6 PM for same‑day delivery in most parts of Ghaziabad.</li>
                    <li><strong>Starting at ₹200</strong><br/>Options for every budget and occasion.</li>
                    <li><strong>Easy WhatsApp ordering</strong><br/>No complex checkout – just message and confirm.</li>
                </ul>
            </section>

            <section class="section section-light">
                <div class="container">
                    <h2 class="section-title">Areas we deliver in Ghaziabad</h2>
                    <p class="text-muted">
                        We currently cover these areas for regular and same‑day deliveries:
                    </p>
                    <ul class="pill-list">
                        <li>Kavi Nagar</li>
                        <li>Raj Nagar</li>
                        <li>Indirapuram</li>
                        <li>Vaishali</li>
                        <li>Vasundhara</li>
                        <li>Mohan Nagar</li>
                        <li>Vijay Nagar</li>
                        <li>Crossing Republik</li>
                    </ul>
                </div>
            </section>

            <section class="section container">
                <h2 class="section-title">How to order in 3 steps</h2>
                <ol class="steps-list">
                    <li>
                        <strong>Step 1 – Choose a bouquet</strong><br/>
                        Browse our catalog or ask us for suggestions on WhatsApp.
                    </li>
                    <li>
                        <strong>Step 2 – Send details</strong><br/>
                        Share bouquet name, delivery address, date, time and message card text.
                    </li>
                    <li>
                        <strong>Step 3 – We deliver</strong><br/>
                        We confirm on WhatsApp and deliver your bouquet fresh in Ghaziabad.
                    </li>
                </ol>
            </section>

            <section class="section container">
                <h2 class="section-title">Frequently asked questions</h2>
                <details>
                    <summary>Do you offer same‑day flower delivery in Ghaziabad?</summary>
                    <p>Yes, for most areas we offer same‑day delivery if you place the order before 6 PM.</p>
                </details>
                <details>
                    <summary>Which areas in Ghaziabad do you cover?</summary>
                    <p>We cover Kavi Nagar, Raj Nagar, Indirapuram, Vaishali, Vasundhara and nearby localities. Message us if you are not sure.</p>
                </details>
                <details>
                    <summary>How can I place an order?</summary>
                    <p>Tap the WhatsApp button on this page, send us your bouquet choice and address, and we will confirm your slot.</p>
                </details>
                <details>
                    <summary>What payment methods do you accept?</summary>
                    <p>We currently accept UPI and bank transfer. No cash‑on‑delivery at the moment.</p>
                </details>
            </section>

            <section class="section section-light">
                <div class="container section-title">
                    <h2>Ready to order flowers in Ghaziabad?</h2>
                    <p class="text-muted">
                        Tap the button below to chat with us on WhatsApp and confirm your bouquet.
                    </p>
                    <a
                      href="https://api.whatsapp.com/send?phone=917289996804&text=${encodeURIComponent(
            "Hi, I want to order a bouquet for delivery in Ghaziabad."
        )}"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="btn btn-primary btn-lg mt-3"
                    >
                      Order on WhatsApp
                    </a>
                </div>
            </section>
        `;
    }
};
