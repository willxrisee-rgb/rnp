// js/pages.js

window.Pages = {
    renderHomePage(container) {
        document.title = "Rose n Petals - Home";

        const bouquets = Store.getAllProducts();
        const bestSellers = bouquets.filter(b => b.is_best_seller).slice(0, 8);
        const occasionTags = ["All", ...Store.getAllOccasionTags(), "Under ₹499"];

        const stepsData = [
            { title: "Choose a bouquet", description: "Browse our curated collections for every occasion." },
            { title: "Fill your details", description: "Enter delivery address, date, time, and message card text." },
            { title: "Confirm on WhatsApp", description: "We confirm availability and payment via UPI or bank transfer, then deliver." }
        ];

        let html = `
            <!-- Hero Section -->
            <section class="hero-section">
                <div class="hero-content container">
                    <h1 class="hero-title">Fresh bouquets in Kavi Nagar & Raj Nagar</h1>
                    <p class="hero-subtitle">Hand‑picked premium flowers for your special moments. Local delivery available.</p>
                    <div class="hero-actions">
                        <a href="#/catalog" class="btn btn-primary btn-lg">View Bouquets</a>
                    </div>
                    <div class="hero-badges">
                        <span class="badge">✓ 2‑hour delivery available (where possible)</span>
                        <span class="badge">✓ Loved by locals in Ghaziabad</span>
                    </div>
                </div>
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
                        ${bestSellers.map(b => Components.createProductCard(b)).join('')}
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
            
            <!-- About & Contact Strip -->
            <section class="section section-light">
                <div class="container about-contact-container">
                    <div class="about-card">
                        <h3>About our shop</h3>
                        <p>Rose n Petals is a local family‑run florist in Kavi Nagar & Raj Nagar, dedicated to making your special moments bloom with carefully selected fresh flowers.</p>
                        <ul class="highlight-stats">
                            <li><strong>✓</strong> Years of local experience</li>
                            <li><strong>✓</strong> Hundreds of happy customers</li>
                        </ul>
                    </div>
                    <div class="contact-card" id="contact">
                        <h3>Contact Rose n Petals</h3>
                        <p class="mb-4">Need help choosing? Reach out to us directly.</p>
                        <div class="contact-buttons">
                            <a href="https://api.whatsapp.com/send?phone=917289996804" target="_blank" class="btn btn-primary mb-2">Chat on WhatsApp</a>
                            <a href="tel:+919810244455" class="btn btn-outline">Call now (+91 9810244455)</a>
                        </div>
                    </div>
                </div>
            </section>
        `;

        container.innerHTML = html;
        this.setupChipListeners('#/catalog?filter=');
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
                ? filteredProducts.map(b => Components.createProductCard(b)).join('')
                : '<div class="empty-state"><p>No bouquets found for this occasion. Please try another filter.</p></div>'
            }
                </div>
                
                <!-- Custom Bouquet Banner -->
                ${Components.createCustomBouquetBanner()}
            </section>
        `;

        container.innerHTML = html;
        this.setupChipListeners('#/catalog?filter=');
    },

    renderBouquetDetailPage(container, id) {
        const decodedId = decodeURIComponent(id);
        const bouquet = Store.getProductById(decodedId);

        if (!bouquet) {
            container.innerHTML = `<div class="container section"><h2 class="text-center">Bouquet not found</h2><div class="text-center"><a href="#/catalog" class="btn btn-primary mt-4">Back to Catalog</a></div></div>`;
            return;
        }

        document.title = `${bouquet.name} - Rose n Petals`;

        // Pick 4 related bouquets
        const related = Store.getAllProducts()
            .filter(p => p.id !== id && p.occasion_tags.some(t => bouquet.occasion_tags.includes(t)))
            .slice(0, 4);

        // Fallback to any 4 if not enough related tags
        if (related.length < 4) {
            const others = Store.getAllProducts().filter(p => p.id !== id && !related.find(r => r.id === p.id));
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
                <button class="btn btn-primary" onclick="document.getElementById('bouquet-order-form').scrollIntoView({behavior: 'smooth', block: 'start'})">
                    Order this bouquet
                </button>
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
                window.location.hash = baseUrl + encodeURIComponent(filterValue);
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
                      class="btn btn-primary btn-lg mt-3"
                    >
                      Order on WhatsApp
                    </a>
                </div>
            </section>
        `;
    }
};
