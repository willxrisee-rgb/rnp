// js/store.js

window.Store = {
    products: [],

    // Using CSV export endpoint for Google Sheets directly
    sheetsUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTHd0751qQ03HhhAmQhVE32BlLZXOO1g40tqB3XPv_9WZCUwW4iQwZ6mNWUnf0Pvf0aD1HkRBAuOQQu/pub?output=csv',

    async fetchProducts() {
        try {
            // Check if there is a Node.js backend providing environment variables
            try {
                const configRes = await fetch('/api/config');
                if (configRes.ok) {
                    const config = await configRes.json();
                    if (config.sheetUrl) {
                        this.sheetsUrl = config.sheetUrl;
                    }
                }
            } catch (e) {
                console.log("No dynamic backend config detected, using hardcoded static config.");
            }

            const response = await fetch(this.sheetsUrl);
            const csvText = await response.text();

            // Check if it's actually CSV or an HTML error page
            if (csvText.trim().startsWith('<')) {
                throw new Error("Received HTML instead of CSV from Google Sheets");
            }

            this.products = this.parseCSVText(csvText);
            
            // Cache products for fallback
            if (this.products.length > 0) {
                localStorage.setItem('rnp_products_cache', JSON.stringify(this.products));
            }
            
            console.log(`Loaded ${this.products.length} active bouquets from Google Sheets.`);
            return this.products;
        } catch (error) {
            console.error("Error fetching data from Google Sheets:", error);
            const cached = localStorage.getItem('rnp_products_cache');
            if (cached) {
                console.log("Using cached products due to fetch error.");
                this.products = JSON.parse(cached);
                return this.products;
            }
            throw error;
        }
    },

    parseCSVText(text) {
        const rows = this.csvToArray(text);
        if (rows.length < 2) return [];

        const headers = rows[0].map(h => h.toLowerCase().trim());
        const products = [];

        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            if (row.length < headers.length) continue;

            const rowData = {};
            headers.forEach((h, idx) => {
                if (h) rowData[h] = row[idx] ? row[idx].trim() : '';
            });

            // Map the parsed row to our app's Object model according to rnp.md
            const idVal = rowData['product no.'] || rowData['id'];
            const nameVal = rowData['product name'] || rowData['name'];
            const priceVal = rowData['price (₹)'] || rowData['price'];
            const imgVal = rowData['image url'] || rowData['image_url'];
            const descVal = rowData['description'] || rowData['short_description'];
            const occVal = rowData['occasion'] || rowData['occasion_tags'];
            const statusVal = rowData['status'];
            const bestSellerVal = rowData['is_best_seller'] || rowData['bestseller'] || rowData['is best seller'] || rowData['best seller'];

            if (idVal) {
                // Parse occasion tags correctly (comma-separated, trimmed)
                const occasionTags = occVal ? occVal.split(',').map(t => t.trim()) : [];

                // Parse is_best_seller logic:
                // 1) Explicit boolean match from column (true, yes, 1) if provided
                // 2) Fallback to checking if "Best Sellers" is in the occasion tags if column is missing
                const isBSStr = bestSellerVal ? String(bestSellerVal).trim().toLowerCase() : '';

                let isBestSeller = false;
                if (isBSStr) {
                    isBestSeller = (isBSStr === 'true' || isBSStr === 'yes' || isBSStr === '1');
                } else {
                    isBestSeller = occasionTags.some(tag => tag.toLowerCase() === 'best sellers');
                }

                // Transform Google Drive links to bypass ORB blocks securely
                let finalImageUrl = imgVal ? imgVal.trim() : '';
                if (finalImageUrl.includes('drive.google.com')) {
                    const match = finalImageUrl.match(/id=([a-zA-Z0-9_-]+)/);
                    if (match && match[1]) {
                        finalImageUrl = `https://lh3.googleusercontent.com/d/${match[1]}`;
                    }
                }

                const bouquet = {
                    id: idVal,
                    name: nameVal || '',
                    price: parseFloat(priceVal) || 0,
                    image_url: finalImageUrl,
                    status: statusVal ? statusVal.toLowerCase() : 'out-of-stock',
                    occasion_tags: occasionTags,
                    short_description: descVal || '',
                    is_best_seller: isBestSeller
                };

                // Only expose in-stock products
                if (bouquet.status.includes('in') && bouquet.status.includes('stock')) {
                    products.push(bouquet);
                }
            }
        }

        return products;
    },

    csvToArray(str) {
        const arr = [];
        let quote = false;
        for (let row = 0, col = 0, c = 0; c < str.length; c++) {
            let cc = str[c], nc = str[c + 1];
            arr[row] = arr[row] || [];
            arr[row][col] = arr[row][col] || '';
            if (cc == '"' && quote && nc == '"') { arr[row][col] += cc; ++c; continue; }
            if (cc == '"') { quote = !quote; continue; }
            if (cc == ',' && !quote) { ++col; continue; }
            if (cc == '\r' && nc == '\n' && !quote) { ++row; col = 0; ++c; continue; }
            if (cc == '\n' && !quote) { ++row; col = 0; continue; }
            if (cc == '\r' && !quote) { ++row; col = 0; continue; }
            arr[row][col] += cc;
        }
        return arr;
    },

    getAllProducts() {
        return this.products;
    },

    getBestSellers() {
        return this.products.filter(p => p.is_best_seller);
    },

    getProductById(id) {
        return this.products.find(p => p.id === id);
    },

    getProductsByOccasion(occasion) {
        if (!occasion || occasion.toLowerCase() === 'all') return this.products;

        if (occasion.toLowerCase().includes('under ₹499')) {
            return this.products.filter(p => p.price < 499);
        }

        return this.products.filter(p =>
            p.occasion_tags.some(tag => tag.toLowerCase() === occasion.toLowerCase())
        );
    },

    getAllOccasionTags() {
        const tags = new Set();
        this.products.forEach(p => {
            p.occasion_tags.forEach(tag => tags.add(tag));
        });
        return Array.from(tags).sort();
    }
};

window.CartStore = {
    cartKey: 'rnp_cart',
    
    getCart() {
        const data = localStorage.getItem(this.cartKey);
        return data ? JSON.parse(data) : [];
    },

    saveCart(cart) {
        localStorage.setItem(this.cartKey, JSON.stringify(cart));
        // Dispatch custom event to notify components that cart changed
        window.dispatchEvent(new Event('cartUpdated'));
    },

    addToCart(product) {
        const cart = this.getCart();
        const existing = cart.find(item => item.id === product.id);
        
        if (existing) {
            existing.quantity = Math.min(existing.quantity + 1, 10);
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.image_url,
                quantity: 1
            });
        }
        
        this.saveCart(cart);
    },

    updateQuantity(id, quantity) {
        let cart = this.getCart();
        const existing = cart.find(item => item.id === id);
        
        if (existing) {
            if (quantity <= 0) {
                this.removeFromCart(id);
            } else {
                existing.quantity = Math.min(quantity, 10);
                this.saveCart(cart);
            }
        }
    },

    removeFromCart(id) {
        let cart = this.getCart();
        cart = cart.filter(item => item.id !== id);
        this.saveCart(cart);
    },

    clearCart() {
        localStorage.removeItem(this.cartKey);
        window.dispatchEvent(new Event('cartUpdated'));
    },

    getTotalItems() {
        return this.getCart().reduce((sum, item) => sum + item.quantity, 0);
    },

    getSubtotal() {
        return this.getCart().reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }
};
