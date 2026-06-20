(()=>{window.Store={products:[],sheetsUrl:"https://docs.google.com/spreadsheets/d/e/2PACX-1vTHd0751qQ03HhhAmQhVE32BlLZXOO1g40tqB3XPv_9WZCUwW4iQwZ6mNWUnf0Pvf0aD1HkRBAuOQQu/pub?output=csv",async fetchProducts(){if(window.__SSR_PRODUCTS__&&window.__SSR_PRODUCTS__.length>0)return this.products=window.__SSR_PRODUCTS__.map(a=>({...a,image_url:a.imageurl||a.image_url,short_description:a.shortdescription||a.short_description,occasion_tags:a.occasiontags||a.occasion_tags,is_best_seller:a.isbestseller||a.is_best_seller})),window.__SSR_PRODUCTS__=null,window.__SSR_HYDRATED__=!0,console.log(`[Store] Using ${this.products.length} SSR-injected products.`),this.products;try{try{let e=await fetch("/api/config");if(e.ok){let t=await e.json();t.sheetUrl&&(this.sheetsUrl=t.sheetUrl)}}catch{console.log("No dynamic backend config detected, using hardcoded static config.")}let r=await(await fetch(this.sheetsUrl)).text();if(r.trim().startsWith("<"))throw new Error("Received HTML instead of CSV from Google Sheets");return this.products=this.parseCSVText(r),this.products.length>0&&localStorage.setItem("rnp_products_cache",JSON.stringify(this.products)),console.log(`Loaded ${this.products.length} active bouquets from Google Sheets.`),this.products}catch(a){console.error("Error fetching data from Google Sheets:",a);let r=localStorage.getItem("rnp_products_cache");if(r)return console.log("Using cached products due to fetch error."),this.products=JSON.parse(r),this.products;throw a}},parseCSVText(a){let r=this.csvToArray(a);if(r.length<2)return[];let e=r[0].map(i=>i.toLowerCase().trim()),t=[];for(let i=1;i<r.length;i++){let d=r[i];if(d.length<e.length)continue;let n={};e.forEach((b,m)=>{b&&(n[b]=d[m]?d[m].trim():"")});let l=n["product no."]||n.id;if(!l)continue;let u=(n["product name"]||n.name||l).toString().toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,""),o=n["product name"]||n.name,p=n["price (\u20B9)"]||n.price,g=n["image url"]||n.image_url,c=n.description||n.short_description,y=n.occasion||n.occasion_tags,s=n.status,h=n.is_best_seller||n.bestseller||n["is best seller"]||n["best seller"];if(l){let b=y?y.split(",").map(w=>w.trim()):[],m=h?String(h).trim().toLowerCase():"",v=!1;m?v=m==="true"||m==="yes"||m==="1":v=b.some(w=>w.toLowerCase()==="best sellers");let A=g?g.trim():"";if(A.includes("drive.google.com")){let w=A.match(/id=([a-zA-Z0-9_-]+)/);w&&w[1]&&(A=`https://lh3.googleusercontent.com/d/${w[1]}`)}let _={id:l,slug:u,name:o||"",price:parseFloat(p)||0,image_url:A,status:s?s.toLowerCase():"out-of-stock",occasion_tags:b,short_description:c||"",is_best_seller:v};_.status.includes("in")&&_.status.includes("stock")&&t.push(_)}}return t},csvToArray(a){let r=[],e=!1;for(let t=0,i=0,d=0;d<a.length;d++){let n=a[d],l=a[d+1];if(r[t]=r[t]||[],r[t][i]=r[t][i]||"",n=='"'&&e&&l=='"'){r[t][i]+=n,++d;continue}if(n=='"'){e=!e;continue}if(n==","&&!e){++i;continue}if(n=="\r"&&l==`
`&&!e){++t,i=0,++d;continue}if(n==`
`&&!e){++t,i=0;continue}if(n=="\r"&&!e){++t,i=0;continue}r[t][i]+=n}return r},getAllProducts(){return this.products},getBestSellers(){return this.products.filter(a=>a.is_best_seller)},getProductById(a){return this.products.find(r=>r.id===a)},getProductBySlug(a){return this.products.find(r=>r.slug===a)},getProductsByOccasion(a){return!a||a.toLowerCase()==="all"?this.products:a.toLowerCase().includes("under \u20B9499")?this.products.filter(r=>r.price<499):this.products.filter(r=>r.occasion_tags.some(e=>e.toLowerCase()===a.toLowerCase()))},getAllOccasionTags(){let a=new Set;return this.products.forEach(r=>{r.occasion_tags.forEach(e=>a.add(e))}),Array.from(a).sort()}};window.CartStore={cartKey:"rnp_cart",getCart(){let a=localStorage.getItem(this.cartKey);return a?JSON.parse(a):[]},saveCart(a){localStorage.setItem(this.cartKey,JSON.stringify(a)),window.dispatchEvent(new Event("cartUpdated"))},addToCart(a){let r=this.getCart(),e=r.find(t=>t.id===a.id);e?e.quantity=Math.min(e.quantity+1,10):r.push({id:a.id,name:a.name,price:a.price,imageUrl:a.image_url,quantity:1}),this.saveCart(r)},updateQuantity(a,r){let e=this.getCart(),t=e.find(i=>i.id===a);t&&(r<=0?this.removeFromCart(a):(t.quantity=Math.min(r,10),this.saveCart(e)))},removeFromCart(a){let r=this.getCart();r=r.filter(e=>e.id!==a),this.saveCart(r)},clearCart(){localStorage.removeItem(this.cartKey),window.dispatchEvent(new Event("cartUpdated"))},getTotalItems(){return this.getCart().reduce((a,r)=>a+r.quantity,0)},getSubtotal(){return this.getCart().reduce((a,r)=>a+r.price*r.quantity,0)}};window.WhatsApp={SHOP_PHONE:"917289996804",initFormListener(){let a=document.getElementById("bouquet-order-form");a&&a.addEventListener("submit",r=>{r.preventDefault(),this.buildAndRedirect()})},buildAndRedirect(){let a=new FormData(document.getElementById("bouquet-order-form")),r=a.get("fullName").trim(),e=a.get("mobileNumber").trim(),t=a.get("address").trim(),i=a.get("area"),d=a.get("deliveryDate"),n=a.get("deliverySlot"),l=a.get("cardMessage")?a.get("cardMessage").trim():"None";l.length===0&&(l="None");let u=a.get("paymentMethod"),o="";if(window._pendingCartOrder){let{cart:c,subtotal:y,discount:s,couponStr:h,total:b}=window._pendingCartOrder;o=`Hi! I want to place an order from Rose n Petals.

ORDER DETAILS:
`,c.forEach((m,v)=>{o+=`${v+1}. ${m.name} (x${m.quantity}) \u2014 \u20B9${m.price*m.quantity}
`}),o+=`
Subtotal: \u20B9${y}`,h&&(o+=h),o+=`
Total: \u20B9${b}

`,o+=`DELIVERY DETAILS:
`,o+=`Name: ${r}
`,o+=`Phone: ${e}
`,o+=`Address: ${t}
`,o+=`Area: ${i}
`,o+=`Date: ${d}
`,o+=`Time: ${n}
`,o+=`Message on card: ${l}
`,o+=`Payment: ${u}`,window._pendingCartOrder=null}else{let c=document.getElementById("bouquetId").value,y=document.getElementById("bouquetName").value,s=document.getElementById("bouquetPrice").value;o=`Hi, I want to order a bouquet from Rose n Petals.
Name: ${r}
Phone: ${e}
Bouquet: ${y} (${c})
Price: \u20B9${s}
Address: ${t}
Area: ${i}
Delivery time: ${d} \u2013 ${n}
Message on card: "${l}"
Payment method: ${u}`}let p=encodeURIComponent(o),g=`https://api.whatsapp.com/send?phone=${this.SHOP_PHONE}&text=${p}`;window.gtag&&window.gtag("event","whatsapp_order_click",{event_category:"Order Intent",bouquet_name:bouquetName}),window.location.href=g}};window.Components={createProductCard(a,r=0){let t=r<2?'loading="eager" fetchpriority="high"':'loading="lazy"',i=a.occasion_tags.length>0?a.occasion_tags[0]:"",d=a.is_best_seller?'<span class="product-card__badge bestseller">BEST SELLER</span>':i?`<span class="product-card__badge occasion">${i}</span>`:"",n=a.image_url?`<img src="${a.image_url}"
         alt="${a.name} \u2014 Flower Bouquet for Delivery in Ghaziabad"
         class="card-image" ${t} width="400" height="400">`:'<div class="card-image placeholder-image text-center p-4"><span>Image coming soon</span></div>',l=(a.name||"").replace(/'/g,"\\'");return`
            <article class="product-card">
                <a href="/bouquet/${a.slug}" class="product-card__image" onclick="if(window.gtag) gtag('event', 'bouquet_view', { event_category: 'Engagement', bouquet_name: '${l}' });">
                    ${n}
                    ${d}
                </a>
                <div class="product-card__content">
                    <h3 class="product-card__title">
                        <a href="/bouquet/${a.slug}" onclick="if(window.gtag) gtag('event', 'bouquet_view', { event_category: 'Engagement', bouquet_name: '${l}' });">
                            ${a.name}
                        </a>
                    </h3>
                    <p class="product-card__desc">${a.short_description}</p>
                    <div class="product-card__price-row" style="display:flex; flex-direction:column; gap:8px;">
                        <span class="product-card__price">\u20B9${a.price}</span>
                        <div style="display:flex; gap:8px;">
                            <a href="https://api.whatsapp.com/send?phone=917289996804&text=${encodeURIComponent(`Hi! I'd like to order the ${a.name} bouquet.`)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm product-card__btn" onclick="if(window.gtag) gtag('event', 'whatsapp_order_click', { event_category: 'Order Intent', bouquet_name: '${l}' });">Order now</a>
                            <button class="btn-add-cart" onclick="if(window.CartUI && window.CartUI.addItem){window.CartUI.addItem('${a.id}')} else {console.warn('CartUI not ready yet')}">Add to Cart</button>
                        </div>
                    </div>
                </div>
            </article>
        `},createFilterChips(a,r){return`
            <div class="filter-chips-wrapper">
                <div class="filter-chips-container scroll-hide">
                    ${a.map(t=>`<button class="filter-chip ${t.toLowerCase()===r.toLowerCase()?"active":""}" data-filter="${t}">${t}</button>`).join("")}
                </div>
            </div>
        `},createSteps(a){return`
            <div class="steps-container">
                ${a.map((r,e)=>`
                    <div class="step-item">
                        <div class="step-number">${e+1}</div>
                        <div class="step-content">
                            <h4 class="step-title">${r.title}</h4>
                            <p class="step-desc">${r.description}</p>
                        </div>
                    </div>
                `).join("")}
            </div>
        `},createOrderForm(a){return`
            <div class="order-form-container">
                <h3 class="form-title">Order Details</h3>
                <form id="bouquet-order-form" class="order-form">
                    <input type="hidden" id="bouquetId" value="${a.id}">
                    <input type="hidden" id="bouquetName" value="${a.name}">
                    <input type="hidden" id="bouquetPrice" value="${a.price}">
                    
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
                            <input type="date" id="deliveryDate" name="deliveryDate" required min="${new Date().toISOString().split("T")[0]}">
                        </div>
                        <div class="form-group">
                            <label for="deliverySlot">Time Slot <span class="required">*</span></label>
                            <select id="deliverySlot" name="deliverySlot" required>
                                <option value="">Select time...</option>
                                <option value="10 AM \u2013 1 PM">10 AM \u2013 1 PM</option>
                                <option value="1 PM \u2013 4 PM">1 PM \u2013 4 PM</option>
                                <option value="4 PM \u2013 8 PM">4 PM \u2013 8 PM</option>
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
                    
                    <div class="delivery-info-block">
                        <p>\u{1F550} Delivered in under 1 hour after confirmation</p>
                        <p>\u{1F4E6} Delivered by our third-party delivery partner</p>
                        <p>\u{1F4AC} WhatsApp reply within 15\u201330 minutes (8 AM\u201310 PM)</p>
                        <p>\u2705 Same-day delivery available before 9 PM</p>
                    </div>
                    
                    <button type="submit" class="btn btn-primary btn-block btn-lg">Confirm on WhatsApp</button>
                    <p class="form-note">Next step opens WhatsApp with your order details.</p>
                </form>
            </div>
        `},createCustomBouquetBanner(){return`
            <div class="custom-bouquet-banner" style="background: linear-gradient(135deg, var(--accent-light) 0%, var(--accent-gray) 100%); border-radius: var(--border-radius-lg); padding: var(--spacing-2xl) var(--spacing-lg); text-align: center; margin-top: var(--spacing-2xl); box-shadow: var(--shadow-sm); border: 1px solid var(--border-color);">
                <h2 style="color: var(--primary-color); margin-bottom: var(--spacing-sm);">Can't Find What You're Looking For?</h2>
                <p style="font-size: 1.1rem; color: var(--text-main); margin-bottom: var(--spacing-lg); max-width: 600px; margin-left: auto; margin-right: auto;">We make custom bouquets starting from \u20B9200.<br>Tell us your occasion, preferred flowers, colour, and budget \u2014 and we will create something beautiful just for you.</p>
                <a href="https://api.whatsapp.com/send?phone=917289996804&text=Hi%2C%20I%20want%20to%20order%20a%20custom%20bouquet.%20Can%20you%20help%20me%3F" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-lg" style="display: inline-block;" onclick="if(window.gtag) gtag('event', 'whatsapp_order_click', { event_category: 'Order Intent', bouquet_name: 'Custom' });">Order a Custom Bouquet on WhatsApp</a>
            </div>
        `}};window.CartUI={couponApplied:null,init(){document.body.insertAdjacentHTML("beforeend",`
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
                        <div class="summary-row"><span>Subtotal:</span> <span id="cart-subtotal">\u20B90</span></div>
                        <div class="summary-row" id="cart-discount-row" style="display:none; color: #2e7d32;"><span>Discount:</span> <span id="cart-discount">-\u20B90</span></div>
                        <div class="summary-row" style="font-size:12px; color:#666;"><span>Delivery:</span> <span>Communicated on WhatsApp</span></div>
                        <div class="summary-row" style="font-weight:700; font-size:16px; margin-top:8px;"><span>Total:</span> <span id="cart-total">\u20B90</span></div>
                    </div>
                    <button class="btn btn-continue" id="cart-continue-btn" style="width:100%; background:white; color:#CC0000; border:2px solid #CC0000; border-radius:8px; padding:12px; font-size:14px; cursor:pointer; margin-bottom:8px;">Continue Shopping</button>
                    <button class="btn btn-checkout" id="cart-checkout-btn" style="width:100%; background:#CC0000; color:white; border:none; border-radius:8px; padding:14px; font-size:14px; font-weight:700; cursor:pointer;">Proceed to Order on WhatsApp</button>
                </div>
            </div>
        `),document.getElementById("cart-overlay").addEventListener("click",()=>this.close()),document.getElementById("cart-close").addEventListener("click",()=>this.close()),document.getElementById("cart-continue-btn").addEventListener("click",()=>this.close()),document.getElementById("apply-coupon-btn").addEventListener("click",()=>this.applyCoupon()),document.getElementById("coupon-input").addEventListener("input",r=>{r.target.value=r.target.value.toUpperCase()}),document.getElementById("cart-checkout-btn").addEventListener("click",()=>this.checkout()),window.addEventListener("cartUpdated",this.render.bind(this)),this.render()},open(){document.getElementById("cart-overlay").classList.add("active"),document.getElementById("cart-drawer").classList.add("active")},close(){document.getElementById("cart-overlay").classList.remove("active"),document.getElementById("cart-drawer").classList.remove("active")},addItem(a){if(!window.Store||!window.CartStore)return;let r=window.Store.getProductById(a);r&&(window.CartStore.addToCart(r),this.open())},async applyCoupon(){let a=document.getElementById("coupon-input").value.trim(),r=document.getElementById("coupon-msg");if(!a){this.couponApplied=null,r.textContent="",this.render();return}let e=window.CartStore.getSubtotal();try{let i=await(await fetch("/api/coupons/validate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({code:a,cartTotal:e})})).json();i.valid?(this.couponApplied={code:a,discount:i.discountAmount},r.textContent=i.message,r.style.color="#2e7d32"):(this.couponApplied=null,r.textContent=i.message,r.style.color="#c62828")}catch{this.couponApplied=null,r.textContent="Error validating coupon.",r.style.color="#c62828"}this.render()},render(){if(!window.CartStore)return;let a=document.querySelectorAll(".cart-badge"),r=window.CartStore.getTotalItems();a.forEach(o=>{r>0?(o.textContent=r,o.style.display="flex"):o.style.display="none"});let e=window.CartStore.getCart(),t=document.getElementById("cart-content"),i=document.getElementById("cart-footer");if(e.length===0){t.innerHTML=`
                <div style="text-align:center; padding: 40px 20px;">
                    <p style="margin-bottom: 20px; color:#666;">Your cart is empty.<br>Browse our bouquets and add something beautiful.</p>
                    <a href="/catalog" class="btn btn-primary" onclick="window.CartUI.close()">Browse Bouquets</a>
                </div>
            `,i.style.display="none",this.couponApplied=null;return}i.style.display="block";let d="";e.forEach(o=>{d+=`
                <div class="cart-item" style="display:flex; gap:12px; margin-bottom: 16px; align-items:center;">
                    <img src="${o.imageUrl}" style="width:60px; height:60px; border-radius:8px; object-fit:cover;">
                    <div style="flex:1;">
                        <div style="font-size:14px; font-weight:600; margin-bottom:4px;">${o.name}</div>
                        <div style="font-size:13px; color:#CC0000; margin-bottom:8px;">\u20B9${o.price}</div>
                        <div style="display:flex; align-items:center; gap:8px;">
                            <button onclick="window.CartStore.updateQuantity('${o.id}', ${o.quantity-1})" style="width:28px; height:28px; border:1px solid #eee; background:white; border-radius:4px; cursor:pointer;">-</button>
                            <span style="font-size:14px;">${o.quantity}</span>
                            <button onclick="window.CartStore.updateQuantity('${o.id}', ${o.quantity+1})" style="width:28px; height:28px; border:1px solid #eee; background:white; border-radius:4px; cursor:pointer;">+</button>
                        </div>
                    </div>
                    <button onclick="window.CartStore.removeFromCart('${o.id}')" style="background:none; border:none; cursor:pointer; padding:8px; display:flex;" title="Remove item">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="cart-trash-icon"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
            `}),t.innerHTML=d;let n=window.CartStore.getSubtotal();document.getElementById("cart-subtotal").textContent=`\u20B9${n}`;let l=0;this.couponApplied&&this.couponApplied.discount?(l=Math.min(this.couponApplied.discount,n),document.getElementById("cart-discount-row").style.display="flex",document.getElementById("cart-discount-row").style.justifyContent="space-between",document.getElementById("cart-discount").textContent=`-\u20B9${l}`):document.getElementById("cart-discount-row").style.display="none";let u=n-l;document.getElementById("cart-total").textContent=`\u20B9${u}`,document.querySelectorAll(".cart-trash-icon").forEach(o=>{o.addEventListener("mouseenter",()=>o.style.stroke="#CC0000"),o.addEventListener("mouseleave",()=>o.style.stroke="#999")})},checkout(){let a=window.CartStore.getCart();if(a.length===0)return;let r=window.CartStore.getSubtotal(),e=0,t="";this.couponApplied&&(e=Math.min(this.couponApplied.discount,r),t=`
Coupon: ${this.couponApplied.code} (-\u20B9${e})`);let i=r-e;window._pendingCartOrder={cart:a,subtotal:r,discount:e,couponStr:t,total:i},this.close();let d=()=>{let n=document.getElementById("inline-order-form");if(n){if(!document.getElementById("cart-notice")){let u=document.createElement("div");u.id="cart-notice",u.style.cssText="background: #fff3cd; color: #856404; padding: 12px; border-radius: 8px; margin-bottom: 15px; font-weight: bold; border: 1px solid #ffeeba;",u.textContent="Complete your delivery details below to confirm your cart order.",n.parentNode.insertBefore(u,n)}let l=document.getElementById("bouquet-order-form");l&&l.scrollIntoView({behavior:"smooth",block:"start"})}};if(window.location.pathname.startsWith("/bouquet/"))d();else{let n=a[0],l=window.Store?window.Store.getProductById(n.id):null,u=l?l.slug:n.id;window.history.pushState(null,"",`/bouquet/${u}`),typeof App<"u"&&App.handleRouting(),setTimeout(d,300)}}};window.SHARED_BENEFITS=window.SHARED_BENEFITS||[{icon:"\u{1F339}",title:"Fresh & Handmade",text:"Every bouquet made to order daily"},{icon:"\u26A1",title:"Same-day Delivery",text:"Order by 6 PM, delivered today"},{icon:"\u{1F4B0}",title:"Starting \u20B9200",text:"Bouquets for every budget"},{icon:"\u{1F4F2}",title:"WhatsApp Order",text:"Simple, personal, fast"}];window.SHARED_AREAS=window.SHARED_AREAS||["Kavi Nagar","Raj Nagar","Indirapuram","Vaishali","Vasundhara","Mohan Nagar","Vijay Nagar","Crossing Republik"];window.SHARED_STEPS=window.SHARED_STEPS||[{number:"01",title:"Browse & Pick",text:"Choose your bouquet from our catalog or Instagram"},{number:"02",title:"WhatsApp Us",text:"Send your choice + delivery address on WhatsApp"},{number:"03",title:"We Deliver",text:"Fresh bouquet delivered to your door, same day"}];window.WA_NUMBER=window.WA_NUMBER||"917289996804";window.CorePagesData={"flower-delivery-ghaziabad":{pageTitle:"Flower Delivery in Ghaziabad | Rose n Petals",mainKeyword:"flower delivery Ghaziabad",headline:"Fresh Flower Delivery in Ghaziabad \u2013 Starting \u20B9200",subheadline:"Handmade bouquets with same-day delivery across Ghaziabad. Order in 2 minutes on WhatsApp.",benefits:window.SHARED_BENEFITS,areas:window.SHARED_AREAS,steps:window.SHARED_STEPS,faqs:[{q:"Which areas in Ghaziabad do you deliver to?",a:"We deliver to Kavi Nagar, Raj Nagar, Indirapuram, Vaishali, Vasundhara, Mohan Nagar, Vijay Nagar, Crossing Republik and nearby localities. Message us on WhatsApp if your area is not listed \u2014 we'll do our best to cover it."},{q:"Do you offer same-day flower delivery in Ghaziabad?",a:"Yes. Place your order before 6 PM and we deliver the same day across most parts of Ghaziabad."},{q:"How do I place a flower delivery order?",a:'Tap the "Order on WhatsApp" button on this page, share your bouquet choice and delivery address, and we will confirm your slot within minutes.'},{q:"What payment methods do you accept?",a:"We accept UPI and bank transfer. Cash-on-delivery is not available at this time."}],ctaText:"Order on WhatsApp",whatsappNumber:window.WA_NUMBER,whatsappMessage:"Hi! I want to order a bouquet for delivery in Ghaziabad."},"online-flower-delivery-ghaziabad":{pageTitle:"Online Flower Delivery in Ghaziabad | Rose n Petals",mainKeyword:"online flower delivery Ghaziabad",headline:"Online Flower Delivery in Ghaziabad \u2013 Order from Home",subheadline:"Skip the traffic. Browse bouquets online, order on WhatsApp, and we deliver fresh flowers to any address in Ghaziabad.",benefits:window.SHARED_BENEFITS,areas:window.SHARED_AREAS,steps:window.SHARED_STEPS,faqs:[{q:"How does online flower delivery work in Ghaziabad?",a:"Browse our bouquets on this page or our Instagram, pick the one you like, and send us your order on WhatsApp. We arrange it fresh and deliver the same day."},{q:"Can I order flowers online for someone else in Ghaziabad?",a:"Absolutely. Just share the recipient's address and preferred time slot on WhatsApp, and we will deliver directly to them."},{q:"Is there a minimum order value?",a:"Our bouquets start at \u20B9200. There is no hidden delivery charge for areas we cover in Ghaziabad."},{q:"Do I need to download any app to order?",a:"No app needed. You order directly through WhatsApp \u2014 it is the simplest way to get flowers delivered in Ghaziabad."}],ctaText:"Order Online via WhatsApp",whatsappNumber:window.WA_NUMBER,whatsappMessage:"Hi! I want to order flowers online for delivery in Ghaziabad."},"bouquet-delivery-ghaziabad":{pageTitle:"Bouquet Delivery in Ghaziabad | Rose n Petals",mainKeyword:"bouquet delivery Ghaziabad",headline:"Beautiful Bouquet Delivery in Ghaziabad \u2013 From \u20B9200",subheadline:"Hand-arranged bouquets for birthdays, anniversaries, or just because. Same-day delivery across Ghaziabad.",benefits:window.SHARED_BENEFITS,areas:window.SHARED_AREAS,steps:window.SHARED_STEPS,faqs:[{q:"What types of bouquets can I get delivered in Ghaziabad?",a:"We offer rose bouquets, mixed flower arrangements, premium bouquets, and custom designs. Tell us your budget and occasion on WhatsApp and we will suggest the best option."},{q:"Can I add a message card with my bouquet?",a:"Yes, every bouquet can include a free handwritten message card. Just share the text when you place your order on WhatsApp."},{q:"How fresh are the bouquets you deliver?",a:"Every bouquet is made to order on the day of delivery from our Kavi Nagar and Raj Nagar units. We never deliver pre-made or stored arrangements."},{q:"Can I schedule a bouquet delivery for a specific time?",a:"Yes, we offer time slots \u2014 morning (10 AM\u20131 PM), afternoon (1\u20134 PM), and evening (4\u20138 PM). Let us know your preference on WhatsApp."}],ctaText:"Order a Bouquet on WhatsApp",whatsappNumber:window.WA_NUMBER,whatsappMessage:"Hi! I want to get a bouquet delivered in Ghaziabad."},"send-flowers-ghaziabad":{pageTitle:"Send Flowers to Ghaziabad | Rose n Petals",mainKeyword:"send flowers to Ghaziabad",headline:"Send Flowers to Ghaziabad \u2013 Delivered Fresh, Same Day",subheadline:"Living outside Ghaziabad? Send a stunning bouquet to your loved ones \u2014 we handle the delivery while you handle the surprise.",benefits:window.SHARED_BENEFITS,areas:window.SHARED_AREAS,steps:window.SHARED_STEPS,faqs:[{q:"Can I send flowers to Ghaziabad from another city?",a:"Yes. Many of our customers order from Delhi, Noida, or even other states. Just WhatsApp us the recipient's address in Ghaziabad and we will deliver."},{q:"Will the recipient know the sender's name?",a:"Only if you want them to. You can include a custom message card with your name or keep it anonymous \u2014 just let us know."},{q:"What if the recipient is not home at the time of delivery?",a:"We coordinate the delivery time with you on WhatsApp. If the recipient is unavailable, we will reschedule at no extra cost."},{q:"How do I pay if I am ordering from outside Ghaziabad?",a:"We accept UPI and bank transfer \u2014 both work from anywhere in India. No cash-on-delivery at this time."}],ctaText:"Send Flowers via WhatsApp",whatsappNumber:window.WA_NUMBER,whatsappMessage:"Hi! I want to send flowers to someone in Ghaziabad."},"order-flowers-online-ghaziabad":{pageTitle:"Order Flowers Online in Ghaziabad | Rose n Petals",mainKeyword:"order flowers online Ghaziabad",headline:"Order Flowers Online in Ghaziabad \u2013 Quick & Easy",subheadline:"No app downloads, no complicated checkout. Pick a bouquet, WhatsApp us, and your flowers are on the way.",benefits:window.SHARED_BENEFITS,areas:window.SHARED_AREAS,steps:window.SHARED_STEPS,faqs:[{q:"How quickly can I get flowers after ordering online?",a:"If you order before 6 PM, we deliver the same day. Most deliveries reach within 2\u20134 hours of confirmation."},{q:"Do I need to create an account to order?",a:"No accounts, no sign-ups. You order directly on WhatsApp. It is the fastest way to get flowers in Ghaziabad."},{q:"Can I customise the bouquet I order online?",a:"Yes. Tell us your budget, preferred flowers, and colour scheme on WhatsApp and we will create a custom arrangement for you."},{q:"Is there an extra charge for online ordering?",a:"No. The price you see is the price you pay. Delivery within our service areas in Ghaziabad is included."}],ctaText:"Order Flowers on WhatsApp",whatsappNumber:window.WA_NUMBER,whatsappMessage:"Hi! I want to order flowers online in Ghaziabad."},"florist-ghaziabad":{pageTitle:"Trusted Florist in Ghaziabad | Rose n Petals",mainKeyword:"florist in Ghaziabad",headline:"Your Trusted Local Florist in Ghaziabad",subheadline:"Rose n Petals is a family-run florist in Kavi Nagar, serving all of Ghaziabad with fresh, handmade bouquets starting at \u20B9200.",benefits:window.SHARED_BENEFITS,areas:window.SHARED_AREAS,steps:window.SHARED_STEPS,faqs:[{q:"Where is Rose n Petals located in Ghaziabad?",a:"Our shop is at KD 14 Market, Block D, Sector 18, Kavi Nagar, Ghaziabad 201002. We also deliver across Ghaziabad."},{q:"What makes Rose n Petals different from other florists?",a:"We are a local, family-run shop. Every bouquet is hand-arranged fresh on the day of delivery. We focus on quality and personal service, not mass production."},{q:"Can I visit your shop and pick up flowers directly?",a:"Yes, walk-ins are welcome at our Kavi Nagar shop between 9 AM and 9 PM, every day."},{q:"Do you do bulk orders for events or weddings?",a:"Yes, we handle bulk and event orders. WhatsApp us your requirements at least 2\u20133 days in advance so we can source the best flowers."}],ctaText:"Chat with Your Florist",whatsappNumber:window.WA_NUMBER,whatsappMessage:"Hi! I am looking for a florist in Ghaziabad. Can you help?"},"flower-shop-ghaziabad":{pageTitle:"Flower Shop in Ghaziabad | Rose n Petals",mainKeyword:"flower shop in Ghaziabad",headline:"Rose n Petals \u2013 Your Go-To Flower Shop in Ghaziabad",subheadline:"Fresh flowers, beautiful arrangements, and same-day delivery from our Kavi Nagar shop to anywhere in Ghaziabad.",benefits:window.SHARED_BENEFITS,areas:window.SHARED_AREAS,steps:window.SHARED_STEPS,faqs:[{q:"What are your shop timings?",a:"We are open every day from 9 AM to 9 PM at KD 14 Market, Block D, Sector 18, Kavi Nagar, Ghaziabad."},{q:"Do you only sell bouquets or loose flowers too?",a:"We primarily specialise in bouquets and arrangements starting at \u20B9200. For loose flowers or bulk requirements, WhatsApp us and we will check availability."},{q:"Can I order from your shop for delivery to another area?",a:"Yes. You can visit our shop or order via WhatsApp, and we deliver to Kavi Nagar, Raj Nagar, Indirapuram, Vaishali, Vasundhara and other areas."},{q:"Do you offer gift wrapping?",a:"Every bouquet comes beautifully wrapped at no extra charge. We also offer premium packaging for special occasions."}],ctaText:"Order from Our Shop",whatsappNumber:window.WA_NUMBER,whatsappMessage:"Hi! I found your flower shop online. I want to place an order."},"fresh-flowers-ghaziabad":{pageTitle:"Fresh Flowers in Ghaziabad | Rose n Petals",mainKeyword:"fresh flowers Ghaziabad",headline:"Guaranteed Fresh Flowers in Ghaziabad \u2013 Made to Order",subheadline:"No pre-made bouquets sitting in storage. Every arrangement is crafted fresh on the day you order, using hand-picked flowers.",benefits:window.SHARED_BENEFITS,areas:window.SHARED_AREAS,steps:window.SHARED_STEPS,faqs:[{q:"How do you ensure the flowers are fresh?",a:"We source flowers daily and make every bouquet to order. Nothing sits overnight. Your bouquet is arranged within hours of delivery."},{q:"What if the flowers I receive are not fresh?",a:"This has not happened yet \u2014 but if it ever does, WhatsApp us a photo and we will replace the bouquet at no extra cost."},{q:"Which flowers are available year-round in Ghaziabad?",a:"Roses, gerberas, carnations, and chrysanthemums are available throughout the year. Lilies and orchids are seasonal \u2014 check with us on WhatsApp for availability."},{q:"How long do your fresh flowers last?",a:"With proper care (clean water, cool spot, trim stems every 2 days), most of our bouquets last 5\u20137 days easily."}],ctaText:"Get Fresh Flowers Today",whatsappNumber:window.WA_NUMBER,whatsappMessage:"Hi! I want fresh flowers delivered in Ghaziabad."},"rose-bouquet-delivery-ghaziabad":{pageTitle:"Rose Bouquet Delivery in Ghaziabad | Rose n Petals",mainKeyword:"rose bouquet delivery Ghaziabad",headline:"Rose Bouquet Delivery in Ghaziabad \u2013 Handmade with Love",subheadline:"Red, pink, yellow, or white \u2014 choose your favourite roses and we will craft a stunning bouquet delivered to your door in Ghaziabad.",benefits:window.SHARED_BENEFITS,areas:window.SHARED_AREAS,steps:window.SHARED_STEPS,faqs:[{q:"What types of rose bouquets do you offer?",a:"We offer red rose bouquets, pink rose arrangements, mixed-colour rose bunches, and premium long-stem rose bouquets. Starting at \u20B9200."},{q:"Can I choose the number of roses in my bouquet?",a:"Yes. WhatsApp us with the number you want (6, 12, 24, 50, or 100 roses) and we will give you the exact price."},{q:"Are your roses locally sourced?",a:"We source roses from trusted suppliers daily to ensure freshness. Depending on the season, they come from local growers or premium flower markets."},{q:"Can I combine roses with other flowers?",a:"Absolutely. Mixed arrangements with roses, gerberas, carnations, or fillers are very popular. Tell us your preference on WhatsApp."}],ctaText:"Order Rose Bouquet",whatsappNumber:window.WA_NUMBER,whatsappMessage:"Hi! I want a rose bouquet delivered in Ghaziabad."},"mixed-flower-bouquet-ghaziabad":{pageTitle:"Mixed Flower Bouquet in Ghaziabad | Rose n Petals",mainKeyword:"mixed flower bouquet Ghaziabad",headline:"Mixed Flower Bouquets in Ghaziabad \u2013 Colourful & Fresh",subheadline:"A vibrant mix of roses, gerberas, carnations, and seasonal fillers \u2014 hand-arranged and delivered same day across Ghaziabad.",benefits:window.SHARED_BENEFITS,areas:window.SHARED_AREAS,steps:window.SHARED_STEPS,faqs:[{q:"What flowers are included in a mixed bouquet?",a:"Our mixed bouquets typically include roses, gerberas, carnations, and seasonal fillers. The exact mix depends on the freshest flowers available that day."},{q:"Can I request specific flowers in my mixed bouquet?",a:"Yes. WhatsApp us your preferred flowers and colours and we will customise the arrangement for you, subject to availability."},{q:"What is the price range for mixed flower bouquets?",a:"Mixed bouquets start at \u20B9200 for a simple arrangement and go up to \u20B92,000+ for premium large bouquets. Share your budget and we will suggest the best option."},{q:"Are mixed bouquets suitable for all occasions?",a:"Absolutely. Mixed flower bouquets work beautifully for birthdays, anniversaries, get-well wishes, congratulations, or just to brighten someone's day."}],ctaText:"Order Mixed Bouquet",whatsappNumber:window.WA_NUMBER,whatsappMessage:"Hi! I want a mixed flower bouquet delivered in Ghaziabad."}};window.CoreServiceRoutes={SLUGS:["flower-delivery-ghaziabad","online-flower-delivery-ghaziabad","bouquet-delivery-ghaziabad","send-flowers-ghaziabad","order-flowers-online-ghaziabad","florist-ghaziabad","flower-shop-ghaziabad","fresh-flowers-ghaziabad","rose-bouquet-delivery-ghaziabad","mixed-flower-bouquet-ghaziabad"],isCorePage(a){return this.SLUGS.includes(a)},render(a,r){let e=window.CorePagesData?window.CorePagesData[r]:null;if(!e){let o=r.split("-").map(p=>p.charAt(0).toUpperCase()+p.slice(1)).join(" ");e={pageTitle:`${o} | Rose n Petals`,mainKeyword:o,headline:`${o} \u2013 Fresh & Fast Delivery`,subheadline:"Order fresh, handmade bouquets delivered to your door in Ghaziabad. Quick and easy on WhatsApp.",benefits:[{icon:"\u{1F339}",title:"Fresh & Handmade",text:"Every bouquet made to order"},{icon:"\u26A1",title:"Fast Delivery",text:"Delivered fresh to your door"},{icon:"\u{1F4B0}",title:"Starting \u20B9200",text:"Bouquets for every budget"},{icon:"\u{1F4F2}",title:"WhatsApp Order",text:"Simple, personal, fast"}],areas:["Kavi Nagar","Raj Nagar","Indirapuram","Vaishali","Vasundhara","Mohan Nagar"],steps:[{number:"01",title:"Browse & Pick",text:"Choose your bouquet from our catalog"},{number:"02",title:"WhatsApp Us",text:"Send your choice + delivery address"},{number:"03",title:"We Deliver",text:"Fresh flowers to your door, same day"}],faqs:[],ctaText:"Order on WhatsApp",whatsappNumber:"917289996804",whatsappMessage:`Hi! I want to inquire about ${o}.`}}document.title=e.pageTitle;let t=`https://api.whatsapp.com/send?phone=${e.whatsappNumber}&text=${encodeURIComponent(e.whatsappMessage||"Hi! I want to order a bouquet.")}`,i="",d="";if(window.Store&&window.Store.getAllProducts){let o=window.Store.getAllProducts().filter(p=>p.image_url);if(o.length>0){let p=o[Math.floor(Math.random()*o.length)];i=p.image_url,d=`${p.name} bouquet in Ghaziabad`}}let n="";if(window.Store&&window.Store.getAllProducts&&window.Store.getAllProducts().length>0){let o=window.Store.getAllProducts().filter(p=>p.is_best_seller).slice(0,6);o.length>0&&window.Components&&(n=`
                    <section class="section section-light">
                        <div class="container">
                            <h2 class="section-title">Our Most-Loved Bouquets in Ghaziabad</h2>
                            <div class="product-grid">
                                ${o.map(p=>window.Components.createProductCard(p)).join("")}
                            </div>
                        </div>
                    </section>
                `)}let l="";e.faqs&&e.faqs.length>0&&(l=`
                <section class="rnp-section rnp-faqs" aria-labelledby="faqs-h2">
                    <h2 id="faqs-h2" class="rnp-section__h2">Frequently Asked Questions</h2>
                    <dl class="rnp-faqs__list">
                        ${e.faqs.map(o=>`
                            <details class="rnp-faqs__item">
                                <summary class="rnp-faqs__q">${o.q}</summary>
                                <dd class="rnp-faqs__a">${o.a}</dd>
                            </details>
                        `).join("")}
                    </dl>
                </section>
            `);let u=e.mainKeyword.includes("rose")?"Order Rose Bouquets in Ghaziabad Today":e.mainKeyword.includes("bouquet")?"Order a Beautiful Bouquet in Ghaziabad Today":e.mainKeyword.includes("florist")||e.mainKeyword.includes("shop")?"Visit Rose n Petals \u2014 Your Ghaziabad Florist":"Order Fresh Flowers in Ghaziabad Today";a.innerHTML=`
            <main class="rnp-page rnp-page--core">

                <!-- \u2500\u2500 HERO \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->
                <section class="rnp-hero" aria-label="Hero">
                    <div class="rnp-hero__copy">
                        <h1 class="rnp-hero__h1">${e.headline}</h1>
                        <p class="rnp-hero__sub">${e.subheadline}</p>
                        <p class="rnp-hero__price">Starting at <strong>\u20B9200</strong></p>
                        <a class="rnp-btn rnp-btn--wa rnp-btn--lg"
                           href="${t}"
                           target="_blank"
                           rel="noopener noreferrer"
                           aria-label="${e.ctaText} \u2014 opens WhatsApp"
                           onclick="if(window.gtag) gtag('event', 'whatsapp_seo_click', { event_category: 'SEO Page', page_slug: '${r}' });">
                            ${e.ctaText}
                        </a>
                    </div>
                    <div class="rnp-hero__media" aria-hidden="${i?"false":"true"}">
                        ${i?`<img class="rnp-hero__img" src="${i}" alt="${d}" loading="lazy">`:'<div class="rnp-placeholder rnp-placeholder--hero">\u{1F338} Fresh Bouquets</div>'}
                    </div>
                </section>

                <!-- \u2500\u2500 TRUST BAR \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->
                <section class="rnp-trust-bar" aria-label="Why Rose n Petals">
                    <ul class="rnp-trust-bar__list" role="list">
                        ${e.benefits.map(o=>`
                            <li class="rnp-trust-bar__item">
                                <span class="rnp-trust-bar__icon" aria-hidden="true">${o.icon}</span>
                                <span>
                                    <strong class="rnp-trust-bar__title">${o.title}</strong>
                                    <span class="rnp-trust-bar__text">${o.text}</span>
                                </span>
                            </li>
                        `).join("")}
                    </ul>
                </section>

                <!-- \u2500\u2500 BEST SELLERS (if loaded) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->
                ${n}

                <!-- \u2500\u2500 AREAS COVERED \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->
                <section class="rnp-section rnp-areas" aria-labelledby="areas-h2">
                    <h2 id="areas-h2" class="rnp-section__h2">We Deliver Flowers Across Ghaziabad</h2>
                    <p class="rnp-areas__intro">
                        From Kavi Nagar to Crossing Republik \u2014 we cover all major areas of Ghaziabad for same-day flower delivery.
                    </p>
                    <ul class="rnp-areas__grid" role="list">
                        ${e.areas.map(o=>`<li class="rnp-areas__pill">${o}</li>`).join("")}
                    </ul>
                </section>

                <!-- \u2500\u2500 HOW IT WORKS \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->
                <section class="rnp-section rnp-steps" aria-labelledby="steps-h2" id="how-it-works">
                    <h2 id="steps-h2" class="rnp-section__h2">Order Flowers in 3 Easy Steps</h2>
                    <ol class="rnp-steps__list" role="list">
                        ${e.steps.map(o=>`
                            <li class="rnp-steps__item">
                                <span class="rnp-steps__num" aria-hidden="true">${o.number}</span>
                                <div>
                                    <h3 class="rnp-steps__title">${o.title}</h3>
                                    <p class="rnp-steps__text">${o.text}</p>
                                </div>
                            </li>
                        `).join("")}
                    </ol>
                </section>

                <!-- \u2500\u2500 FAQs \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->
                ${l}

                <!-- \u2500\u2500 BOTTOM CTA \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->
                <section class="rnp-section rnp-cta-block" aria-label="Order now">
                    <h2 class="rnp-cta-block__h2">${u}</h2>
                    <p class="rnp-cta-block__sub">
                        Same-day delivery available \xB7 Starting \u20B9200 \xB7 Easy WhatsApp ordering
                    </p>
                    <a class="rnp-btn rnp-btn--wa rnp-btn--lg"
                       href="${t}"
                       target="_blank"
                       rel="noopener noreferrer"
                       onclick="if(window.gtag) gtag('event', 'whatsapp_seo_click', { event_category: 'SEO Page CTA Bottom', page_slug: '${r}' });">
                        ${e.ctaText}
                    </a>
                </section>

            </main>
        `}};window.URGENCY_AREAS=window.URGENCY_AREAS||["Kavi Nagar","Raj Nagar","Indirapuram","Vaishali","Vasundhara","Mohan Nagar","Vijay Nagar","Crossing Republik"];window.URGENCY_BENEFITS=window.URGENCY_BENEFITS||[{icon:"\u{1F339}",title:"Fresh, Not Pre-made",text:"Every bouquet arranged on the day of delivery"},{icon:"\u26A1",title:"Priority Dispatch",text:"Urgent orders are our top priority"},{icon:"\u{1F4B0}",title:"No Express Surcharge",text:"Same price as standard \u2014 starting \u20B9200"},{icon:"\u{1F4F2}",title:"Confirm on WhatsApp",text:"Slot confirmed within 10 minutes of your message"}];window.URGENCY_SPEED_PROOF=window.URGENCY_SPEED_PROOF||[{icon:"\u26A1",stat:"Under 1 hr",label:"Delivery from confirmation",note:"Across Ghaziabad"},{icon:"\u{1F4E6}",stat:"8 PM",label:"Same-day order cut-off",note:"7 days a week"},{icon:"\u{1F319}",stat:"10 PM",label:"Midnight delivery cut-off",note:"With advance booking"}];window.WA_NUMBER=window.WA_NUMBER||"917289996804";window.UrgencyPagesData={"same-day-flower-delivery-ghaziabad":{pageTitle:"Same Day Flower Delivery in Ghaziabad | Rose n Petals",mainKeyword:"same day flower delivery Ghaziabad",urgencyType:"same-day",deliveryPromise:"Order by 8 PM \u2192 Delivered Today",cutoffTime:"Order before 8 PM for same-day delivery in Ghaziabad",guaranteeText:"If we cannot make your slot, we will call you immediately. No hidden delays.",headline:"Same Day Flower Delivery in Ghaziabad",subheadline:"Order by 8 PM and your fresh bouquet arrives today. Hand-arranged, not pre-packaged. Starting \u20B9200.",benefits:window.URGENCY_BENEFITS,speedProof:window.URGENCY_SPEED_PROOF,areas:window.URGENCY_AREAS,steps:[{number:"01",title:"WhatsApp Your Order",text:"Send us your bouquet choice, delivery address, and preferred time slot on WhatsApp.",time:"Takes 2 minutes"},{number:"02",title:"We Confirm Your Slot",text:"We confirm availability and freshness for your requested time and start preparing your bouquet.",time:"Within 10 minutes"},{number:"03",title:"Delivered to Your Door",text:"Your fresh bouquet is delivered to your address in Ghaziabad within under an hour of confirmation.",time:"Under 1 hour from confirmation"}],faqs:[{q:"What is the cut-off time for same-day flower delivery in Ghaziabad?",a:"Order before 8 PM and we deliver the same day to most areas of Ghaziabad."},{q:"Is there an extra charge for same-day delivery?",a:"No. Our bouquets start at \u20B9200 with no express surcharge for same-day delivery within our service areas."},{q:"What if I order after 8 PM?",a:"We will attempt delivery the same evening if your area is close by. Otherwise, we will schedule a first-thing-next-morning delivery and confirm with you on WhatsApp."},{q:"Can I choose a specific delivery time for same-day orders?",a:"Yes. We offer morning (10 AM\u20131 PM), afternoon (1\u20134 PM), and evening (4\u20138 PM) slots. Mention your preferred window when you WhatsApp us."},{q:"Which areas in Ghaziabad get same-day delivery?",a:"We cover Kavi Nagar, Raj Nagar, Indirapuram, Vaishali, Vasundhara, Mohan Nagar, Vijay Nagar, and Crossing Republik. WhatsApp us if you are unsure about your area."}],ctaText:"Order Same-Day on WhatsApp",whatsappNumber:window.WA_NUMBER,whatsappMessage:"Hi! I need same-day flower delivery in Ghaziabad today.",relatedUrgency:[{label:"Under 1 Hour Delivery",href:"#/2-hour-flower-delivery-ghaziabad"},{label:"Express Delivery",href:"#/express-flower-delivery-ghaziabad"},{label:"Midnight Delivery",href:"#/midnight-flower-delivery-ghaziabad"}]},"express-flower-delivery-ghaziabad":{pageTitle:"Express Flower Delivery in Ghaziabad | Rose n Petals",mainKeyword:"express flower delivery Ghaziabad",urgencyType:"express",deliveryPromise:"Express Delivery \u2014 Flowers in Under 1 Hour",cutoffTime:"Order before 8 PM for express same-day delivery",guaranteeText:"We prioritise express orders. You get a WhatsApp confirmation within 10 minutes.",headline:"Express Flower Delivery in Ghaziabad \u2014 Under 1 Hour",subheadline:"No waiting. Order now, we prepare fresh, and your bouquet is at the door in under an hour of confirmation. Starting \u20B9200.",benefits:window.URGENCY_BENEFITS,speedProof:window.URGENCY_SPEED_PROOF,areas:window.URGENCY_AREAS,steps:[{number:"01",title:"WhatsApp Us Now",text:"Share your bouquet choice, address, and the time by which you need it delivered.",time:"Takes 2 minutes"},{number:"02",title:"Slot Confirmed Fast",text:"We confirm your express slot within 10 minutes and start arranging your bouquet immediately.",time:"Within 10 minutes"},{number:"03",title:"Express Delivery Done",text:"Your fresh bouquet is delivered to your Ghaziabad address in under 1 hour of confirmation.",time:"Under 1 hour from confirmation"}],faqs:[{q:"How fast is express flower delivery in Ghaziabad?",a:"Our express delivery typically reaches you in under 1 hour of confirming your order on WhatsApp."},{q:"Do you charge extra for express delivery?",a:"No extra charge. Express delivery within our Ghaziabad service areas is included in the bouquet price, starting at \u20B9200."},{q:"What is the latest I can order for express delivery today?",a:"Order before 8 PM and we can deliver the same day. WhatsApp us your slot preference and we confirm within 10 minutes."},{q:"Can I get express delivery for a specific occasion?",a:"Yes \u2014 birthdays, anniversaries, apologies, anything. Just tell us the occasion and your time constraint on WhatsApp."},{q:"What if there is a delay in my express order?",a:"We will call you immediately if any delay looks likely. This is rare, but we believe in being upfront rather than surprising you."}],ctaText:"Order Express Delivery on WhatsApp",whatsappNumber:window.WA_NUMBER,whatsappMessage:"Hi! I need express flower delivery in Ghaziabad \u2014 as fast as possible.",relatedUrgency:[{label:"Same Day Delivery",href:"#/same-day-flower-delivery-ghaziabad"},{label:"Under 1 Hour Delivery",href:"#/2-hour-flower-delivery-ghaziabad"},{label:"Midnight Delivery",href:"#/midnight-flower-delivery-ghaziabad"}]},"2-hour-flower-delivery-ghaziabad":{pageTitle:"Under 1 Hour Flower Delivery in Ghaziabad | Rose n Petals",mainKeyword:"2 hour flower delivery Ghaziabad",urgencyType:"2-hour",deliveryPromise:"Flowers at Your Door in Under 1 Hour",cutoffTime:"Available till 8 PM \u2014 order now to guarantee your under-1-hour slot",guaranteeText:"We confirm your delivery slot on WhatsApp within 10 minutes. If we cannot meet it, we tell you immediately.",headline:"Under 1 Hour Flower Delivery in Ghaziabad \u2014 Ultra Fast",subheadline:"Need flowers fast? WhatsApp us now and we will arrange a fresh bouquet and deliver to your door in Ghaziabad in under 1 hour of confirmation. Starting \u20B9200.",benefits:[{icon:"\u26A1",title:"Under 1 Hour Delivery",text:"Fastest delivery option in Ghaziabad"},{icon:"\u{1F339}",title:"Made Fresh On Demand",text:"Arranged right after you confirm your order"},{icon:"\u{1F4B0}",title:"No Rush Surcharge",text:"Same pricing from \u20B9200 \u2014 no extra fees"},{icon:"\u{1F4F2}",title:"WhatsApp Slot Booking",text:"Slot confirmed within 10 minutes"}],speedProof:[{icon:"\u26A1",stat:"Under 1 hr",label:"Delivery from confirmation",note:"Within Ghaziabad service areas"},{icon:"\u{1F4E6}",stat:"8 PM",label:"Fast-slot booking cut-off",note:"7 days a week"},{icon:"\u2705",stat:"10 min",label:"Slot confirmation time",note:"Via WhatsApp"}],areas:URGENCY_AREAS,steps:[{number:"01",title:"WhatsApp Right Now",text:"Tell us your bouquet preference, delivery address, and that you need fastest delivery.",time:"Takes 2 minutes"},{number:"02",title:"We Confirm Your Fast Slot",text:"We check availability and confirm your under-1-hour delivery slot on WhatsApp within 10 minutes.",time:"Within 10 minutes"},{number:"03",title:"Fresh Bouquet Delivered",text:"Your bouquet is arranged fresh and delivered to your Ghaziabad address in under 1 hour.",time:"Under 1 hour from confirmation"}],faqs:[{q:"How fast is your fastest flower delivery in Ghaziabad?",a:"We deliver in under 1 hour of confirming your order. WhatsApp us now and we will check the slot for your area."},{q:"What time do I need to order by for under-1-hour delivery?",a:"Book your fast slot before 8 PM. WhatsApp us your order and we confirm within 10 minutes."},{q:"Do you charge extra for this fast delivery?",a:"No \u2014 our pricing starts at \u20B9200 and does not include a rush fee for areas we regularly serve."},{q:"How do I confirm my fast delivery slot?",a:"Just WhatsApp us with your order details. We reply with a slot confirmation within 10 minutes."},{q:"Can I get this fast delivery for a surprise birthday or anniversary?",a:"Absolutely. Many of our customers use this for last-minute surprises. Just message us and we will make it happen."}],ctaText:"Book Your Fast Slot on WhatsApp",whatsappNumber:window.WA_NUMBER,whatsappMessage:"Hi! I need the fastest flower delivery in Ghaziabad \u2014 under 1 hour if possible.",relatedUrgency:[{label:"Same Day Delivery",href:"#/same-day-flower-delivery-ghaziabad"},{label:"Express Delivery",href:"#/express-flower-delivery-ghaziabad"},{label:"Midnight Delivery",href:"#/midnight-flower-delivery-ghaziabad"}]},"midnight-flower-delivery-ghaziabad":{pageTitle:"Midnight Flower Delivery in Ghaziabad | Rose n Petals",mainKeyword:"midnight flower delivery Ghaziabad",urgencyType:"midnight",deliveryPromise:"Midnight Delivery \u2014 Surprise Them at 12 AM",cutoffTime:"Book your midnight slot before 10 PM \u2014 advance booking recommended",guaranteeText:"Midnight slots are limited. Book early and we confirm your exact delivery window on WhatsApp.",headline:"Midnight Flower Delivery in Ghaziabad \u2014 Surprise at 12 AM",subheadline:"Make their birthday or anniversary unforgettable. Fresh bouquets delivered between 11 PM and 1 AM in Ghaziabad. Starting \u20B9200.",benefits:[{icon:"\u{1F319}",title:"Midnight Slots Available",text:"Delivery between 11 PM and 1 AM in Ghaziabad"},{icon:"\u{1F339}",title:"Fresh, Not Pre-arranged",text:"Bouquet prepared fresh on the delivery day"},{icon:"\u{1F4B0}",title:"Starting \u20B9200",text:"Affordable surprise delivery \u2014 no midnight premium"},{icon:"\u{1F4F2}",title:"WhatsApp Slot Booking",text:"Confirm your midnight slot in advance via WhatsApp"}],speedProof:[{icon:"\u{1F319}",stat:"11 PM\u20131 AM",label:"Midnight delivery window",note:"Ghaziabad service areas"},{icon:"\u{1F4E6}",stat:"10 PM",label:"Last booking time for midnight",note:"Advance booking preferred"},{icon:"\u2705",stat:"Limited",label:"Midnight slots per night",note:"Book early to secure yours"}],areas:URGENCY_AREAS,steps:[{number:"01",title:"Book in Advance",text:"WhatsApp us by 10 PM with your bouquet choice, address, and the midnight delivery time you want.",time:"Book by 10 PM"},{number:"02",title:"Slot Confirmed on WhatsApp",text:"We confirm your midnight slot and payment. Slots are limited, so booking early is highly recommended.",time:"Within 30 minutes of booking"},{number:"03",title:"Delivered at Midnight",text:"Your fresh bouquet is delivered to the recipient between 11 PM and 1 AM \u2014 the perfect surprise.",time:"11 PM \u2013 1 AM"}],faqs:[{q:"Is midnight flower delivery available every night in Ghaziabad?",a:"We offer midnight delivery most nights, but slots are limited. We recommend booking at least a day in advance, or by 10 PM on the day you want delivery."},{q:"What time exactly does midnight delivery happen?",a:"Deliveries are made between 11 PM and 1 AM depending on your area and slot availability. We will confirm the exact window on WhatsApp."},{q:"Do you charge extra for midnight delivery?",a:"Our bouquets start at \u20B9200. There may be a small convenience charge for midnight slots in certain areas \u2014 we will tell you upfront when you book."},{q:"How do I book a midnight delivery slot?",a:"WhatsApp us with the recipient's address, your bouquet choice, and the midnight date. We will confirm your slot and share payment details."},{q:"Can I get midnight delivery for birthdays and anniversaries?",a:"Yes \u2014 midnight delivery is most popular for birthdays and anniversaries. It makes for an unforgettable surprise. Book early to get your preferred slot."}],ctaText:"Book Midnight Delivery on WhatsApp",whatsappNumber:window.WA_NUMBER,whatsappMessage:"Hi! I want to book midnight flower delivery in Ghaziabad.",relatedUrgency:[{label:"Same Day Delivery",href:"#/same-day-flower-delivery-ghaziabad"},{label:"Express Delivery",href:"#/express-flower-delivery-ghaziabad"},{label:"Urgent Delivery",href:"#/urgent-flower-delivery-ghaziabad"}]},"urgent-flower-delivery-ghaziabad":{pageTitle:"Urgent Flower Delivery in Ghaziabad | Rose n Petals",mainKeyword:"urgent flower delivery Ghaziabad",urgencyType:"express",deliveryPromise:"Urgent Order? We Prioritise You \u2014 Under 1 Hour Delivery",cutoffTime:"WhatsApp us before 8 PM \u2014 urgent orders are handled on priority",guaranteeText:"Urgent orders jump the queue. We confirm your slot within 10 minutes on WhatsApp.",headline:"Urgent Flower Delivery in Ghaziabad \u2014 Handled on Priority",subheadline:"No time to plan? No problem. WhatsApp us your urgent flower delivery request and we deliver in under 1 hour of confirmation. Starting \u20B9200.",benefits:window.URGENCY_BENEFITS,speedProof:window.URGENCY_SPEED_PROOF,areas:window.URGENCY_AREAS,steps:[{number:"01",title:"Message Us Right Now",text:"Send your bouquet choice, address, and how urgently you need it \u2014 we respond within minutes.",time:"Response in 5\u201310 minutes"},{number:"02",title:"Priority Slot Confirmed",text:"We prioritise urgent orders and confirm your delivery slot on WhatsApp before we start preparing.",time:"Within 10 minutes"},{number:"03",title:"Delivered in Under 1 Hour",text:"Your fresh bouquet is dispatched on priority and delivered to your Ghaziabad address.",time:"Under 1 hour from confirmation"}],faqs:[{q:"Can you really handle urgent flower orders in Ghaziabad?",a:"Yes. Urgent orders are our top priority. WhatsApp us now and we will tell you the fastest slot available for your area."},{q:"How quickly can you deliver if I order right now?",a:"For most areas of Ghaziabad, we can deliver in under 1 hour of confirming your order, provided it is before 8 PM."},{q:"Do urgent orders cost more?",a:"No extra charge for urgency. Our bouquets start at \u20B9200 with no rush premium for areas within our normal coverage."},{q:"What is the latest I can place an urgent order for same-day delivery?",a:"WhatsApp us before 8 PM and we will get your bouquet delivered the same day. We confirm availability within 10 minutes."},{q:"Can I send an urgent flower delivery to someone else in Ghaziabad?",a:"Yes. Many urgent orders are sent by people outside Ghaziabad to someone in the city. Just share the recipient's address and we handle the rest."}],ctaText:"Place Urgent Order on WhatsApp Now",whatsappNumber:window.WA_NUMBER,whatsappMessage:"Hi! I need urgent flower delivery in Ghaziabad \u2014 please help ASAP.",relatedUrgency:[{label:"Same Day Delivery",href:"#/same-day-flower-delivery-ghaziabad"},{label:"Under 1 Hour Delivery",href:"#/2-hour-flower-delivery-ghaziabad"},{label:"Express Delivery",href:"#/express-flower-delivery-ghaziabad"}]},"last-minute-flower-delivery-ghaziabad":{pageTitle:"Last Minute Flower Delivery in Ghaziabad | Rose n Petals",mainKeyword:"last minute flower delivery Ghaziabad",urgencyType:"express",deliveryPromise:"Last Minute? We Have Got You \u2014 Under 1 Hour Delivery",cutoffTime:"Order before 8 PM \u2014 we handle last-minute requests every day",guaranteeText:"Last-minute orders handled without fuss. WhatsApp us now and we sort it out.",headline:"Last Minute Flower Delivery in Ghaziabad \u2014 We Will Sort It",subheadline:"Forgot a birthday or anniversary? It happens. WhatsApp us now and we will get fresh flowers to your loved one in Ghaziabad in under 1 hour of confirmation. Starting \u20B9200.",benefits:[{icon:"\u{1F339}",title:"No Judgment, Just Flowers",text:"We handle last-minute requests every single day"},{icon:"\u26A1",title:"Under 1 Hour Delivery",text:"Fresh bouquet at the door in under an hour of confirmation"},{icon:"\u{1F4B0}",title:"Starting \u20B9200",text:"No premium for last-minute bookings"},{icon:"\u{1F4F2}",title:"WhatsApp Ordering",text:"Quickest way to place a last-minute order"}],speedProof:window.URGENCY_SPEED_PROOF,areas:window.URGENCY_AREAS,steps:[{number:"01",title:"WhatsApp Us Immediately",text:"Tell us what you need, where it needs to go, and how urgently \u2014 we do not judge last-minute requests.",time:"Takes 2 minutes"},{number:"02",title:"We Confirm Fast",text:"We check the fastest available slot for your area and confirm it on WhatsApp within 10 minutes.",time:"Within 10 minutes"},{number:"03",title:"Delivered Under 1 Hour",text:"Your bouquet is arranged fresh and delivered to the address in Ghaziabad in under 1 hour of confirmation.",time:"Under 1 hour from confirmation"}],faqs:[{q:"Can I really get last-minute flower delivery in Ghaziabad?",a:"Yes. Last-minute orders are something we handle every day. WhatsApp us \u2014 if we can make it, we will. If not, we will be upfront."},{q:"What is the latest I can place a last-minute order?",a:"Order before 8 PM for same-day last-minute delivery. For very late evening, WhatsApp us and we will check what is possible."},{q:"Will it cost more because it is last minute?",a:"No. Our pricing starts at \u20B9200 with no last-minute premium. What you see is what you pay."},{q:"Can I write a message card for a last-minute order?",a:"Yes \u2014 every bouquet includes a free handwritten message card. Just share the text when you WhatsApp us."},{q:"What if the recipient is not home when the last-minute delivery arrives?",a:"We coordinate delivery time with you on WhatsApp. If the recipient is unavailable, we will call you and reschedule at no extra cost."}],ctaText:"Place Last-Minute Order on WhatsApp",whatsappNumber:window.WA_NUMBER,whatsappMessage:"Hi! I need last-minute flower delivery in Ghaziabad today \u2014 please help!",relatedUrgency:[{label:"Same Day Delivery",href:"#/same-day-flower-delivery-ghaziabad"},{label:"Express Delivery",href:"#/express-flower-delivery-ghaziabad"},{label:"Urgent Delivery",href:"#/urgent-flower-delivery-ghaziabad"}]},"flower-delivery-today-ghaziabad":{pageTitle:"Flower Delivery Today in Ghaziabad | Rose n Petals",mainKeyword:"flower delivery today Ghaziabad",urgencyType:"same-day",deliveryPromise:"Order Today, Delivered in Under 1 Hour \u2014 Starting \u20B9200",cutoffTime:"Order before 8 PM for delivery today in Ghaziabad",guaranteeText:"If you order today before 8 PM, your bouquet is delivered today in under 1 hour of confirmation. That is our commitment.",headline:"Flower Delivery Today in Ghaziabad \u2014 Order Now",subheadline:"Need flowers delivered in Ghaziabad today? Order before 8 PM and we deliver in under 1 hour of confirmation. Fresh, handmade, starting \u20B9200.",benefits:window.URGENCY_BENEFITS,speedProof:window.URGENCY_SPEED_PROOF,areas:window.URGENCY_AREAS,steps:[{number:"01",title:"WhatsApp Your Order Now",text:"Choose a bouquet from our catalog or describe what you want. Send it to us on WhatsApp with your delivery address.",time:"Takes 2 minutes"},{number:"02",title:"We Confirm Today's Slot",text:"We check same-day availability for your area and confirm your delivery slot within 10 minutes.",time:"Within 10 minutes"},{number:"03",title:"Flowers Delivered Today",text:"Your fresh bouquet reaches your address in Ghaziabad in under 1 hour of confirmation \u2014 as promised.",time:"Under 1 hour from confirmation"}],faqs:[{q:"Can I get flower delivery today in Ghaziabad?",a:"Yes. Order before 8 PM and we deliver the same day to most areas of Ghaziabad in under 1 hour of confirmation. WhatsApp us to confirm your area."},{q:"What time should I order by for today's delivery?",a:"Order before 8 PM for same-day delivery. WhatsApp us your slot preference and we confirm within 10 minutes."},{q:"Is there an extra charge for delivery today?",a:"No extra charge. Our bouquets start at \u20B9200 with no same-day premium for areas within our service zone."},{q:"How do I know my order will arrive today?",a:"Once we confirm your slot on WhatsApp, your delivery is locked in. We only confirm when we are certain we can deliver."},{q:"Can someone else receive the flower delivery today on my behalf?",a:"Yes. Just share the recipient's name and address on WhatsApp. They do not need to know it is coming from you unless you want them to."}],ctaText:"Order for Today's Delivery on WhatsApp",whatsappNumber:window.WA_NUMBER,whatsappMessage:"Hi! I need flower delivery in Ghaziabad today. Can you help?",relatedUrgency:[{label:"Same Day Delivery",href:"#/same-day-flower-delivery-ghaziabad"},{label:"Express Delivery",href:"#/express-flower-delivery-ghaziabad"},{label:"Under 1 Hour Delivery",href:"#/2-hour-flower-delivery-ghaziabad"}]},"emergency-flower-delivery-ghaziabad":{pageTitle:"Emergency Flower Delivery in Ghaziabad | Rose n Petals",mainKeyword:"emergency flower delivery Ghaziabad",urgencyType:"express",deliveryPromise:"Emergency Flower Delivery \u2014 We Act Fast",cutoffTime:"WhatsApp us now \u2014 emergency orders get immediate attention",guaranteeText:"Emergency orders are escalated immediately. We reply within 5 minutes during business hours.",headline:"Emergency Flower Delivery in Ghaziabad \u2014 Act Now",subheadline:"Forgot a birthday, need to apologise, or got an urgent occasion? WhatsApp us now and we will handle your emergency flower delivery in Ghaziabad today. Starting \u20B9200.",benefits:[{icon:"\u{1F6A8}",title:"Emergency Priority",text:"Your order is escalated the moment we receive it"},{icon:"\u{1F339}",title:"Fresh in an Emergency",text:"Even emergency orders get fresh, hand-arranged flowers"},{icon:"\u{1F4B0}",title:"No Emergency Premium",text:"Same honest pricing from \u20B9200 \u2014 no panic pricing"},{icon:"\u{1F4F2}",title:"Reply in 5 Minutes",text:"WhatsApp us and we respond within 5 minutes in business hours"}],speedProof:[{icon:"\u{1F6A8}",stat:"5 min",label:"Response time on WhatsApp",note:"During business hours (9 AM\u20139 PM)"},{icon:"\u26A1",stat:"Under 1 hr",label:"Emergency delivery from confirmation",note:"Across Ghaziabad service areas"},{icon:"\u{1F4E6}",stat:"8 PM",label:"Same-day emergency order cut-off",note:"7 days a week"}],areas:URGENCY_AREAS,steps:[{number:"01",title:"WhatsApp Us Right Now",text:"Tell us your emergency \u2014 what you need, where it needs to go, and how fast. We take it from there.",time:"Response in 5 minutes"},{number:"02",title:"Emergency Slot Confirmed",text:"We check the fastest delivery possible for your location and confirm on WhatsApp without delay.",time:"Within 10 minutes"},{number:"03",title:"Delivered in Under 1 Hour",text:"We prepare your bouquet fresh and dispatch immediately \u2014 reaching your Ghaziabad address in under 1 hour.",time:"Under 1 hour from confirmation"}],faqs:[{q:"What counts as an emergency flower delivery?",a:"Anything urgent \u2014 a forgotten birthday, a surprise gone wrong, a last-minute apology, or flowers needed right away. If it is urgent to you, it is urgent to us."},{q:"How quickly do you respond to emergency orders?",a:"We reply on WhatsApp within 5 minutes during business hours (9 AM\u20139 PM). Outside hours, message us and we will respond first thing."},{q:"Do you charge extra for emergency flower delivery?",a:"No. Our pricing starts at \u20B9200 with no emergency or panic premium. Honest pricing no matter how urgent."},{q:"How fast is your emergency delivery?",a:"We deliver in under 1 hour of confirming your order for most Ghaziabad areas. WhatsApp us now and we will confirm your slot immediately."},{q:"What if my emergency falls outside your business hours?",a:"For emergencies after 9 PM, please WhatsApp us anyway. For midnight slots (11 PM\u20131 AM), we may be able to help if you book in advance."}],ctaText:"Send Emergency Order on WhatsApp Now",whatsappNumber:window.WA_NUMBER,whatsappMessage:"Hi! I have an emergency \u2014 I need flower delivery in Ghaziabad as soon as possible!",relatedUrgency:[{label:"Same Day Delivery",href:"#/same-day-flower-delivery-ghaziabad"},{label:"Urgent Delivery",href:"#/urgent-flower-delivery-ghaziabad"},{label:"Express Delivery",href:"#/express-flower-delivery-ghaziabad"}]}};window.UrgencyServiceRoutes={SLUGS:["same-day-flower-delivery-ghaziabad","express-flower-delivery-ghaziabad","2-hour-flower-delivery-ghaziabad","midnight-flower-delivery-ghaziabad","urgent-flower-delivery-ghaziabad","last-minute-flower-delivery-ghaziabad","flower-delivery-today-ghaziabad","emergency-flower-delivery-ghaziabad"],isUrgencyPage(a){return this.SLUGS.includes(a)},render(a,r){let e=window.UrgencyPagesData?window.UrgencyPagesData[r]:null;if(!e){let s=r.split("-").map(h=>h.charAt(0).toUpperCase()+h.slice(1)).join(" ");e={pageTitle:`${s} | Rose n Petals`,mainKeyword:s,urgencyType:"express",deliveryPromise:"Order Now \u2192 Delivered Today",cutoffTime:"Order before 8 PM for same-day delivery in Ghaziabad",guaranteeText:"We confirm your slot on WhatsApp before we start.",headline:`${s} \u2013 Fast & Fresh`,subheadline:"Fresh handmade bouquets delivered fast across Ghaziabad. WhatsApp us to place your order now.",benefits:[{icon:"\u{1F339}",title:"Fresh & Handmade",text:"Every bouquet made to order"},{icon:"\u26A1",title:"Priority Dispatch",text:"Urgent orders handled first"},{icon:"\u{1F4B0}",title:"Starting \u20B9200",text:"No express surcharge"},{icon:"\u{1F4F2}",title:"WhatsApp Booking",text:"Slot confirmed in 10 minutes"}],speedProof:[{icon:"\u26A1",stat:"Under 1 hr",label:"Delivery from confirmation",note:"Across Ghaziabad"},{icon:"\u{1F4E6}",stat:"8 PM",label:"Same-day cut-off",note:"7 days a week"},{icon:"\u2705",stat:"10 min",label:"Slot confirmation time",note:"Via WhatsApp"}],areas:["Kavi Nagar","Raj Nagar","Indirapuram","Vaishali","Vasundhara","Mohan Nagar"],steps:[{number:"01",title:"WhatsApp Us",text:"Share your bouquet choice and delivery address.",time:"Takes 2 minutes"},{number:"02",title:"Slot Confirmed",text:"We confirm your delivery slot on WhatsApp.",time:"Within 10 minutes"},{number:"03",title:"Delivered to Your Door",text:"Fresh bouquet delivered same day to your Ghaziabad address in under 1 hour.",time:"Under 1 hour from confirmation"}],faqs:[],ctaText:"Order on WhatsApp Now",whatsappNumber:"917289996804",whatsappMessage:`Hi! I need ${s} \u2014 please help.`,relatedUrgency:[]}}document.title=e.pageTitle;let t=`https://api.whatsapp.com/send?phone=${e.whatsappNumber}&text=${encodeURIComponent(e.whatsappMessage||"Hi! I need urgent flower delivery in Ghaziabad.")}`,i="",d="";if(window.Store&&window.Store.getAllProducts){let s=window.Store.getAllProducts().filter(h=>h.image_url);if(s.length>0){let h=s[Math.floor(Math.random()*s.length)];i=h.image_url,d=`${h.name} \u2014 available for express delivery in Ghaziabad`}}let n=(e.speedProof||[]).map(s=>`
            <li class="rnp-speed-proof__item">
                <span class="rnp-speed-proof__icon" aria-hidden="true">${s.icon}</span>
                <strong class="rnp-speed-proof__stat">${s.stat}</strong>
                <span class="rnp-speed-proof__label">${s.label}</span>
                <span class="rnp-speed-proof__note">${s.note}</span>
            </li>
        `).join(""),l="";if(window.Store&&window.Store.getAllProducts&&window.Store.getAllProducts().length>0){let s=window.Store.getAllProducts().filter(h=>h.is_best_seller).slice(0,6);s.length>0&&window.Components&&(l=`
                    <section class="section section-light">
                        <div class="container">
                            <h2 class="section-title">Bouquets Available for Fast Delivery in Ghaziabad</h2>
                            <div class="product-grid">
                                ${s.map(h=>window.Components.createProductCard(h)).join("")}
                            </div>
                        </div>
                    </section>
                `)}let u=(e.benefits||[]).map(s=>`
            <li class="rnp-trust-bar__item">
                <span class="rnp-trust-bar__icon" aria-hidden="true">${s.icon}</span>
                <span>
                    <strong class="rnp-trust-bar__title">${s.title}</strong>
                    <span class="rnp-trust-bar__text">${s.text}</span>
                </span>
            </li>
        `).join(""),o=(e.steps||[]).map(s=>`
            <li class="rnp-steps__item">
                <span class="rnp-steps__num" aria-hidden="true">${s.number}</span>
                <div>
                    <h3 class="rnp-steps__title">${s.title}</h3>
                    <p class="rnp-steps__text">${s.text}</p>
                    ${s.time?`<span class="rnp-steps__time-badge">\u23F1 ${s.time}</span>`:""}
                </div>
            </li>
        `).join(""),p=(e.areas||[]).map(s=>`<li class="rnp-areas__pill">${s}</li>`).join(""),g="";e.faqs&&e.faqs.length>0&&(g=`
                <section class="rnp-section rnp-faqs" aria-labelledby="faqs-h2">
                    <h2 id="faqs-h2" class="rnp-section__h2">Express Delivery \u2014 Common Questions</h2>
                    <dl class="rnp-faqs__list">
                        ${e.faqs.map(s=>`
                            <details class="rnp-faqs__item">
                                <summary class="rnp-faqs__q">${s.q}</summary>
                                <dd class="rnp-faqs__a">${s.a}</dd>
                            </details>
                        `).join("")}
                    </dl>
                </section>
            `);let c="";e.relatedUrgency&&e.relatedUrgency.length>0&&(c=`
                <section class="rnp-section rnp-related" aria-labelledby="related-h2">
                    <h2 id="related-h2" class="rnp-section__h2">Other Delivery Options</h2>
                    <ul class="rnp-related__list" role="list">
                        ${e.relatedUrgency.map(s=>`
                            <li>
                                <a class="rnp-btn rnp-btn--ghost rnp-btn--sm" href="${s.href}">\u26A1 ${s.label}</a>
                            </li>
                        `).join("")}
                    </ul>
                </section>
            `);let y=e.urgencyType==="midnight"?"Book Midnight Flower Delivery in Ghaziabad":e.urgencyType==="2-hour"?"Order Under 1 Hour Flower Delivery in Ghaziabad Now":`Order ${e.mainKeyword.split(" ").map(s=>s.charAt(0).toUpperCase()+s.slice(1)).join(" ")} \u2014 Act Fast`;a.innerHTML=`
            <main class="rnp-page rnp-page--urgency">

                <!-- \u2500\u2500 HERO \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->
                <section class="rnp-hero rnp-hero--urgency" aria-label="Hero">
                    <div class="rnp-hero__copy">
                        <div class="rnp-hero__promise-badge" role="status">
                            \u26A1 ${e.deliveryPromise}
                        </div>
                        <h1 class="rnp-hero__h1">${e.headline}</h1>
                        <p class="rnp-hero__sub">${e.subheadline}</p>
                        <p class="rnp-hero__price">Starting at <strong>\u20B9200</strong></p>
                        <a class="rnp-btn rnp-btn--wa rnp-btn--lg"
                           href="${t}"
                           target="_blank"
                           rel="noopener noreferrer"
                           aria-label="${e.ctaText} \u2014 opens WhatsApp"
                           onclick="if(window.gtag) gtag('event', 'whatsapp_urgency_click', { event_category: 'Urgency SEO Page', page_slug: '${r}' });">
                            ${e.ctaText}
                        </a>
                        ${e.cutoffTime?`<p class="rnp-hero__cutoff">\u23F0 ${e.cutoffTime}</p>`:""}
                    </div>
                    <div class="rnp-hero__media" aria-hidden="${i?"false":"true"}">
                        ${i?`<img class="rnp-hero__img" src="${i}" alt="${d}" loading="lazy">`:'<div class="rnp-placeholder rnp-placeholder--hero">\u{1F338} Fresh Bouquets</div>'}
                    </div>
                </section>

                <!-- \u2500\u2500 SPEED PROOF STRIP \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->
                <section class="rnp-speed-proof" aria-label="Delivery speed proof">
                    <ul class="rnp-speed-proof__list" role="list">
                        ${n}
                    </ul>
                    ${e.guaranteeText?`<p class="rnp-speed-proof__guarantee">\u2705 ${e.guaranteeText}</p>`:""}
                </section>

                <!-- \u2500\u2500 BEST SELLERS (if loaded) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->
                ${l}

                <!-- \u2500\u2500 TRUST BAR \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->
                <section class="rnp-trust-bar" aria-label="Why our express delivery is reliable">
                    <ul class="rnp-trust-bar__list" role="list">
                        ${u}
                    </ul>
                </section>

                <!-- \u2500\u2500 HOW FAST ORDERING WORKS \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->
                <section class="rnp-section rnp-steps rnp-steps--urgency" aria-labelledby="steps-h2" id="how-it-works">
                    <h2 id="steps-h2" class="rnp-section__h2">How Express Ordering Works \u2014 Step by Step</h2>
                    <ol class="rnp-steps__list" role="list">
                        ${o}
                    </ol>
                </section>

                <!-- \u2500\u2500 AREAS COVERED \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->
                <section class="rnp-section rnp-areas" aria-labelledby="areas-h2">
                    <h2 id="areas-h2" class="rnp-section__h2">Express Delivery Available Across Ghaziabad</h2>
                    <p class="rnp-areas__intro">
                        We cover all major localities in Ghaziabad for same-day and express flower delivery.
                    </p>
                    <ul class="rnp-areas__grid" role="list">
                        ${p}
                    </ul>
                </section>

                <!-- \u2500\u2500 FAQs \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->
                ${g}

                <!-- \u2500\u2500 RELATED URGENCY CROSS-LINKS \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->
                ${c}

                <!-- \u2500\u2500 BOTTOM CTA \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->
                <section class="rnp-section rnp-cta-block rnp-cta-block--urgency" aria-label="Order now">
                    <div class="rnp-cta-block__promise">${e.deliveryPromise}</div>
                    <h2 class="rnp-cta-block__h2">${y}</h2>
                    <p class="rnp-cta-block__sub">
                        ${e.cutoffTime?`${e.cutoffTime} \xB7 `:""}Starting \u20B9200 \xB7 Easy WhatsApp order
                    </p>
                    <a class="rnp-btn rnp-btn--wa rnp-btn--lg"
                       href="${t}"
                       target="_blank"
                       rel="noopener noreferrer"
                       onclick="if(window.gtag) gtag('event', 'whatsapp_urgency_click', { event_category: 'Urgency SEO Page CTA Bottom', page_slug: '${r}' });">
                        ${e.ctaText}
                    </a>
                </section>

            </main>
        `}};window.OCCASION_AREAS=window.OCCASION_AREAS||["Kavi Nagar","Raj Nagar","Indirapuram","Vaishali","Vasundhara","Mohan Nagar","Vijay Nagar","Crossing Republik"];window.OccasionPagesData={"birthday-flowers-ghaziabad":{pageTitle:"Birthday Flower Delivery in Ghaziabad | Rose n Petals",mainKeyword:"birthday flowers Ghaziabad",occasionName:"Birthday",occasionEmoji:"\u{1F382}",headline:"Surprise Them with a Birthday Bouquet in Ghaziabad",subheadline:"Make their day special. Order before 8 PM to get under 1 hour delivery from confirmation. Starting \u20B9200.",startingPrice:"\u20B9200",ctaText:"Order Birthday Flowers on WhatsApp",whatsappNumber:"917289996804",whatsappMessage:"Hi! I want to order a birthday bouquet for delivery in Ghaziabad.",occasionSection:{headline:"Make Their Birthday One to Remember",text:"A birthday is the perfect time to show how much you care. Our fresh, vibrant birthday bouquets are designed to bring a big smile to their face.",callout:"Delivered fresh. On time. Every time."},productSectionHeadline:"Our Best Birthday Bouquets",deliveryNote:"Under 1 hour delivery from confirmation available.",benefits:[{icon:"\u{1F338}",title:"Fresh Birthday Blooms",text:"Handmade just for their special day"},{icon:"\u26A1",title:"Under 1 Hour Delivery",text:"Fast delivery from confirmation in Ghaziabad"},{icon:"\u{1F4B0}",title:"Starting \u20B9200",text:"Beautiful options for every budget"},{icon:"\u{1F4F2}",title:"WhatsApp Confirmation",text:"Slot confirmed in about 10 minutes"}],areas:window.OCCASION_AREAS,steps:[{number:"01",title:"Message Us",text:"Tell us your budget, preferred flowers, and delivery details."},{number:"02",title:"Slot Confirmed",text:"WhatsApp confirmation in about 10 minutes."},{number:"03",title:"Surprise Delivered",text:"Fresh flowers reach their door in under 1 hour from confirmation."}],featuredProducts:[{name:"Red Roses Delight",desc:"A classic arrangement of fresh red roses, perfect for birthdays.",image:"https://lh3.googleusercontent.com/d/1cpJMck3YEYANy_4uBPE2Ej1t8K68b-4N"},{name:"Mixed Vibrant Blooms",desc:"A colourful mix of seasonal flowers to brighten their day.",image:"https://res.cloudinary.com/dlg6d4qbh/image/upload/v1779475822/Carnival_Mix_d2c4cl.png"},{name:"Orchid Elegance",desc:"Premium purple orchids for a sophisticated birthday surprise.",image:"https://lh3.googleusercontent.com/d/1bu6hIhMX4d-IHIjnmFVG7OkNz6Dx74t1"}],faqs:[{q:"Can I get same-day delivery for birthday flowers in Ghaziabad?",a:"Yes! Order before 8 PM to get under 1 hour delivery from confirmation."},{q:"Can I include a personal birthday message?",a:"Absolutely. Every bouquet comes with a free handwritten card. Just share your message on WhatsApp."},{q:"Do you offer midnight birthday delivery?",a:"Yes, we do. Please book in advance so we can reserve a midnight slot for you."},{q:"Can I customise the bouquet with their favourite flowers?",a:"Yes, let us know their favourite flowers on WhatsApp and we will create a custom arrangement."},{q:"What happens if they are not home?",a:"We will coordinate with you via WhatsApp to ensure a safe and timely delivery."}],relatedOccasions:[{label:"Anniversary Flowers",href:"#/anniversary-flowers-ghaziabad"},{label:"Romance Flowers",href:"#/romantic-flowers-ghaziabad"}],heroImage:"https://res.cloudinary.com/dlg6d4qbh/image/upload/v1779475822/Carnival_Mix_d2c4cl.png",heroImageAlt:"Birthday bouquet in Ghaziabad"},"anniversary-flowers-ghaziabad":{pageTitle:"Anniversary Flower Delivery in Ghaziabad | Rose n Petals",mainKeyword:"anniversary flowers Ghaziabad",occasionName:"Anniversary",occasionEmoji:"\u{1F496}",headline:"Celebrate Your Love with Anniversary Flowers in Ghaziabad",subheadline:"Show them how much they mean to you. Order before 8 PM to get under 1 hour delivery from confirmation. Starting \u20B9200.",startingPrice:"\u20B9200",ctaText:"Order Anniversary Flowers on WhatsApp",whatsappNumber:"917289996804",whatsappMessage:"Hi! I want to order an anniversary bouquet for delivery in Ghaziabad.",occasionSection:{headline:'Say "I Love You" Like Never Before',text:"Anniversaries are milestones meant to be celebrated. Whether it is your 1st or 50th, our romantic bouquets express what words sometimes cannot.",callout:"Premium romantic blooms for your special day."},productSectionHeadline:"Romantic Anniversary Bouquets",deliveryNote:"Under 1 hour delivery from confirmation available.",benefits:[{icon:"\u{1F339}",title:"Romantic Arrangements",text:"Designed specifically to celebrate love"},{icon:"\u26A1",title:"Under 1 Hour Delivery",text:"Fast delivery from confirmation in Ghaziabad"},{icon:"\u{1F4B0}",title:"Starting \u20B9200",text:"Honest pricing for premium quality"},{icon:"\u{1F4F2}",title:"WhatsApp Confirmation",text:"Slot confirmed in about 10 minutes"}],areas:window.OCCASION_AREAS,steps:[{number:"01",title:"Message Us",text:"Tell us your budget, preferred flowers, and delivery details."},{number:"02",title:"Slot Confirmed",text:"WhatsApp confirmation in about 10 minutes."},{number:"03",title:"Surprise Delivered",text:"Fresh flowers reach their door in under 1 hour from confirmation."}],featuredProducts:[{name:"100 Red Roses Premium Box",desc:"The ultimate romantic gesture with handpicked premium red roses.",image:"https://lh3.googleusercontent.com/d/1_pEGn0sH9qo6zuhQKRj4k62KbZeKXK2V"},{name:"Pink Lily & Rose Combo",desc:"A soft, romantic blend of pink lilies and elegant roses.",image:"https://lh3.googleusercontent.com/d/1V48ZJQ1Q0y39kubUK3Z3dzGXCx-5Lx0k"},{name:"Classic Love Bouquet",desc:"A timeless arrangement of mixed romantic blooms and foliage.",image:"https://res.cloudinary.com/dlg6d4qbh/image/upload/v1779505954/blush_carnation_jecbzq.png"}],faqs:[{q:"Can you deliver anniversary flowers to a restaurant in Ghaziabad?",a:"Yes! Just provide the restaurant name, address, and your reservation time when you WhatsApp us."},{q:"How fast can you deliver anniversary flowers?",a:"Order before 8 PM to get under 1 hour delivery from confirmation."},{q:"Do you offer midnight anniversary delivery?",a:"Yes! Midnight delivery is very popular for anniversaries. Please book ahead of time."},{q:"Can I add chocolates to my anniversary bouquet?",a:"Yes, we can add chocolates or other small add-ons. Mention it when you order on WhatsApp."}],relatedOccasions:[{label:"Romance Flowers",href:"#/romantic-flowers-ghaziabad"},{label:"Birthday Flowers",href:"#/birthday-flowers-ghaziabad"}],heroImage:"https://lh3.googleusercontent.com/d/1_pEGn0sH9qo6zuhQKRj4k62KbZeKXK2V",heroImageAlt:"Romantic red rose bouquet in Ghaziabad"},"get-well-soon-flowers-ghaziabad":{pageTitle:"Get Well Soon Flowers Delivery in Ghaziabad | Rose n Petals",mainKeyword:"get well soon flowers Ghaziabad",occasionName:"Get Well Soon",occasionEmoji:"\u{1F33B}",headline:"Send Get Well Soon Flowers in Ghaziabad",subheadline:"Brighten their recovery. Order before 8 PM to get under 1 hour delivery from confirmation. Starting \u20B9200.",startingPrice:"\u20B9200",ctaText:"Send Get Well Flowers on WhatsApp",whatsappNumber:"917289996804",whatsappMessage:"Hi! I want to send get well soon flowers to someone in Ghaziabad.",occasionSection:{headline:"Send Warm Wishes for a Speedy Recovery",text:'A cheerful bouquet can do wonders for someone feeling under the weather. Our bright and fresh flowers are the perfect way to say "get well soon".',callout:"Delivering sunshine and positive vibes."},productSectionHeadline:"Bright & Cheerful Bouquets",deliveryNote:"Under 1 hour delivery from confirmation available.",benefits:[{icon:"\u{1F33B}",title:"Cheerful Blooms",text:"Bright colors to lift their spirits"},{icon:"\u26A1",title:"Under 1 Hour Delivery",text:"Fast delivery from confirmation in Ghaziabad"},{icon:"\u{1F3E5}",title:"Hospital Delivery",text:"We deliver to homes and hospitals"},{icon:"\u{1F4F2}",title:"WhatsApp Confirmation",text:"Slot confirmed in about 10 minutes"}],areas:window.OCCASION_AREAS,steps:[{number:"01",title:"Message Us",text:"Choose a cheerful bouquet and send us the delivery details."},{number:"02",title:"Slot Confirmed",text:"WhatsApp confirmation in about 10 minutes."},{number:"03",title:"Flowers Delivered",text:"Fresh flowers reach them in under 1 hour from confirmation."}],featuredProducts:[{name:"Sunshine Yellow Daisies",desc:"Bright yellow blooms guaranteed to bring a smile.",image:"https://res.cloudinary.com/dlg6d4qbh/image/upload/v1779467296/Sunflower_Burst_Bouquet_rkp5xf.png"},{name:"Vibrant Mix Bouquet",desc:"A colorful assortment of fresh, mood-lifting flowers.",image:"https://lh3.googleusercontent.com/d/1edFTn-jyEQVOujkgEP7bzWB-ipbAB--R"},{name:"Elegant White Lilies",desc:"Calming and elegant lilies for a peaceful recovery.",image:"https://res.cloudinary.com/dlg6d4qbh/image/upload/v1779506580/Vitage_Tale_n6pxuo.png"}],faqs:[{q:"Can you deliver get well soon flowers to hospitals in Ghaziabad?",a:"Yes, we deliver to most hospitals in our service areas. Please provide the ward and room number."},{q:"How quickly can you deliver?",a:"Order before 8 PM to get under 1 hour delivery from confirmation."},{q:"What are the best flowers for a get well soon gift?",a:"Bright flowers like daisies, sunflowers, and yellow roses are great for lifting spirits. Lilies are also good for a calming presence."},{q:"Can I include a get well card?",a:"Yes, a free handwritten card is included with every order."}],relatedOccasions:[{label:"Sympathy Flowers",href:"#/sympathy-flowers-ghaziabad"},{label:"Thinking of You",href:"#/romantic-flowers-ghaziabad"}],heroImage:"https://res.cloudinary.com/dlg6d4qbh/image/upload/v1779467296/Sunflower_Burst_Bouquet_rkp5xf.png",heroImageAlt:"Cheerful sunflower bouquet in Ghaziabad"},"congratulations-flowers-ghaziabad":{pageTitle:"Congratulations Flowers Delivery in Ghaziabad | Rose n Petals",mainKeyword:"congratulations flowers Ghaziabad",occasionName:"Congratulations",occasionEmoji:"\u{1F389}",headline:"Send Congratulations Flowers in Ghaziabad",subheadline:"Celebrate their big achievement. Order before 8 PM to get under 1 hour delivery from confirmation. Starting \u20B9200.",startingPrice:"\u20B9200",ctaText:"Send Congratulations Flowers on WhatsApp",whatsappNumber:"917289996804",whatsappMessage:"Hi! I want to send congratulations flowers to someone in Ghaziabad.",occasionSection:{headline:"Celebrate Their Success in Style",text:'Whether it is a new job, graduation, or a big promotion, success deserves to be celebrated. Our vibrant bouquets are the perfect way to say "well done".',callout:"Premium blooms for their proudest moments."},productSectionHeadline:"Celebratory Bouquets",deliveryNote:"Under 1 hour delivery from confirmation available.",benefits:[{icon:"\u{1F389}",title:"Celebratory Designs",text:"Vibrant, joyful arrangements"},{icon:"\u26A1",title:"Under 1 Hour Delivery",text:"Fast delivery from confirmation in Ghaziabad"},{icon:"\u{1F4B0}",title:"Starting \u20B9200",text:"Honest pricing for premium quality"},{icon:"\u{1F4F2}",title:"WhatsApp Confirmation",text:"Slot confirmed in about 10 minutes"}],areas:window.OCCASION_AREAS,steps:[{number:"01",title:"Message Us",text:"Choose a celebratory bouquet and send us the details."},{number:"02",title:"Slot Confirmed",text:"WhatsApp confirmation in about 10 minutes."},{number:"03",title:"Flowers Delivered",text:"Fresh flowers reach them in under 1 hour from confirmation."}],featuredProducts:[{name:"Vibrant Celebration Mix",desc:"A lively, colorful bouquet that screams success.",image:"https://res.cloudinary.com/dlg6d4qbh/image/upload/v1779475822/Carnival_Mix_d2c4cl.png"},{name:"Premium Pink Orchids",desc:"Elegant and long-lasting orchids for a classy congratulation.",image:"https://lh3.googleusercontent.com/d/1bu6hIhMX4d-IHIjnmFVG7OkNz6Dx74t1"},{name:"Bright Sunflower Assortment",desc:"Joyful sunflowers to match their happy moment.",image:"https://res.cloudinary.com/dlg6d4qbh/image/upload/v1779505186/Royal_Sunflower_z1zf1o.png"}],faqs:[{q:"How fast can you deliver congratulations flowers?",a:"Order before 8 PM to get under 1 hour delivery from confirmation."},{q:"Can I add a personalized message to the bouquet?",a:"Yes, we include a handwritten card with your custom message for free."},{q:"Can you deliver to an office in Ghaziabad?",a:"Absolutely. Just provide the office address and any delivery instructions when you order."},{q:"What is the best flower for congratulations?",a:"Bright, bold flowers like orchids, sunflowers, and mixed colorful roses are perfect for celebrating success."}],relatedOccasions:[{label:"Housewarming Flowers",href:"#/housewarming-flowers-ghaziabad"},{label:"New Baby Flowers",href:"#/new-baby-flowers-ghaziabad"}],heroImage:"https://lh3.googleusercontent.com/d/1owFZSTGRXuKYAEdTZkpZtFh_rAg2mqVV",heroImageAlt:"Premium celebration bouquet in Ghaziabad"},"sorry-flowers-ghaziabad":{pageTitle:"Apology & Sorry Flowers Delivery in Ghaziabad | Rose n Petals",mainKeyword:"sorry flowers Ghaziabad",occasionName:"Apology",occasionEmoji:"\u{1F64F}",heroImage:"https://res.cloudinary.com/dlg6d4qbh/image/upload/v1779506580/Vitage_Tale_n6pxuo.png",heroImageAlt:"Peaceful apology bouquet in Ghaziabad",headline:'Say "I am Sorry" with Flowers in Ghaziabad',subheadline:"Mend the bridge with a sincere bouquet. Order before 8 PM to get under 1 hour delivery from confirmation. Starting \u20B9200.",startingPrice:"\u20B9200",ctaText:"Send Apology Flowers on WhatsApp",whatsappNumber:"917289996804",whatsappMessage:"Hi! I want to send apology flowers to someone in Ghaziabad.",occasionSection:{headline:"A Sincere Gesture Goes a Long Way",text:"Sometimes words aren't enough. An elegant bouquet of fresh flowers shows genuine regret and care, helping you make things right.",callout:"Say it perfectly with fresh, beautiful blooms."},productSectionHeadline:"Elegant Apology Bouquets",deliveryNote:"Under 1 hour delivery from confirmation available.",benefits:[{icon:"\u{1F54A}\uFE0F",title:"Sincere Arrangements",text:"Elegant and calming flower choices"},{icon:"\u26A1",title:"Under 1 Hour Delivery",text:"Fast delivery from confirmation in Ghaziabad"},{icon:"\u{1F4B0}",title:"Starting \u20B9200",text:"Honest pricing for premium quality"},{icon:"\u{1F4F2}",title:"WhatsApp Confirmation",text:"Slot confirmed in about 10 minutes"}],areas:window.OCCASION_AREAS,steps:[{number:"01",title:"Message Us",text:"Tell us your budget and provide their delivery address."},{number:"02",title:"Slot Confirmed",text:"WhatsApp confirmation in about 10 minutes."},{number:"03",title:"Apology Delivered",text:"Fresh flowers reach their door in under 1 hour from confirmation."}],featuredProducts:[{name:"Peaceful White Lilies",desc:"Calming white lilies to show sincere apologies.",image:"https://res.cloudinary.com/dlg6d4qbh/image/upload/v1779476670/Ocean_MIst_vcnm4j.png"},{name:"Soft Pastel Mix",desc:`Gentle pastel hues for a tender "I'm sorry".`,image:"https://lh3.googleusercontent.com/d/1Zq_aPUFhFTMSij7OmpAUboS89w2CGR27"},{name:"Classic Yellow Roses",desc:"Symbolizing friendship and new beginnings.",image:"https://res.cloudinary.com/dlg6d4qbh/image/upload/v1779467296/Sunflower_Burst_Bouquet_rkp5xf.png"}],faqs:[{q:"What are the best flowers for an apology?",a:"White lilies, yellow roses (for friendship), and soft pastel mixed bouquets are ideal for saying sorry."},{q:"How fast can you deliver apology flowers?",a:"Order before 8 PM to get under 1 hour delivery from confirmation."},{q:"Will my apology message be included?",a:"Yes, we will carefully handwrite your apology message on a premium card to accompany the flowers."},{q:"Can you deliver anonymously if I want?",a:"Yes, we can keep the sender details private if you request it."}],relatedOccasions:[{label:"Romance Flowers",href:"#/romantic-flowers-ghaziabad"},{label:"Get Well Soon",href:"#/get-well-soon-flowers-ghaziabad"}]},"romantic-flowers-ghaziabad":{pageTitle:"Romantic Flowers Delivery in Ghaziabad | Rose n Petals",mainKeyword:"romantic flowers Ghaziabad",occasionName:"Romance",occasionEmoji:"\u{1F498}",heroImage:"https://lh3.googleusercontent.com/d/1cpJMck3YEYANy_4uBPE2Ej1t8K68b-4N",heroImageAlt:"Romantic red roses in Ghaziabad",headline:"Send Romantic Flowers in Ghaziabad",subheadline:"Just because they are on your mind. Order before 8 PM to get under 1 hour delivery from confirmation. Starting \u20B9200.",startingPrice:"\u20B9200",ctaText:"Send Romantic Flowers on WhatsApp",whatsappNumber:"917289996804",whatsappMessage:"Hi! I want to order a romantic bouquet for delivery in Ghaziabad.",occasionSection:{headline:"Keep the Romance Alive",text:`You don't need an occasion to show you care. Surprise them "just because" with a breathtaking arrangement of their favorite flowers.`,callout:"Spontaneous surprises make the best memories."},productSectionHeadline:'Romantic & "Just Because" Bouquets',deliveryNote:"Under 1 hour delivery from confirmation available.",benefits:[{icon:"\u{1F339}",title:"Romantic Blooms",text:"Handpicked fresh roses and exotic flowers"},{icon:"\u26A1",title:"Under 1 Hour Delivery",text:"Fast delivery from confirmation in Ghaziabad"},{icon:"\u{1F4B0}",title:"Starting \u20B9200",text:"Beautiful surprises for every budget"},{icon:"\u{1F4F2}",title:"WhatsApp Confirmation",text:"Slot confirmed in about 10 minutes"}],areas:window.OCCASION_AREAS,steps:[{number:"01",title:"Message Us",text:"Pick a romantic bouquet and send us the details."},{number:"02",title:"Slot Confirmed",text:"WhatsApp confirmation in about 10 minutes."},{number:"03",title:"Surprise Delivered",text:"Fresh flowers reach their door in under 1 hour from confirmation."}],featuredProducts:[{name:"Deep Red Roses Bouquet",desc:"The classic symbol of romance and deep love.",image:"https://lh3.googleusercontent.com/d/1cpJMck3YEYANy_4uBPE2Ej1t8K68b-4N"},{name:"Elegant Pink Carnations",desc:"Soft and romantic blooms for a gentle surprise.",image:"https://res.cloudinary.com/dlg6d4qbh/image/upload/v1779505954/blush_carnation_jecbzq.png"},{name:"Luxury Orchid Arrangement",desc:"Exotic and premium orchids for someone truly special.",image:"https://lh3.googleusercontent.com/d/1bu6hIhMX4d-IHIjnmFVG7OkNz6Dx74t1"}],faqs:[{q:"How quickly can I send a surprise bouquet?",a:"Order before 8 PM to get under 1 hour delivery from confirmation."},{q:"Do you deliver romantic flowers to offices?",a:"Yes, office deliveries are very popular for spontaneous romantic surprises."},{q:"Can I add a custom love note?",a:"Absolutely. Your note will be handwritten on a premium card and included with the flowers."},{q:"Do you guarantee freshness?",a:"Yes, all our romantic bouquets are arranged just before dispatch to ensure maximum freshness and impact."}],relatedOccasions:[{label:"Anniversary Flowers",href:"#/anniversary-flowers-ghaziabad"},{label:"Apology Flowers",href:"#/sorry-flowers-ghaziabad"}]},"new-baby-flowers-ghaziabad":{pageTitle:"New Baby Flowers Delivery in Ghaziabad | Rose n Petals",mainKeyword:"new baby flowers Ghaziabad",occasionName:"New Baby",occasionEmoji:"\u{1F37C}",headline:"Welcome the Little One with New Baby Flowers",subheadline:"Send your love to the new parents in Ghaziabad. Order before 8 PM to get under 1 hour delivery from confirmation. Starting \u20B9200.",startingPrice:"\u20B9200",ctaText:"Send New Baby Flowers on WhatsApp",whatsappNumber:"917289996804",whatsappMessage:"Hi! I want to send new baby flowers to a family in Ghaziabad.",occasionSection:{headline:"Celebrate the New Arrival",text:"A new baby brings endless joy. Congratulate the proud parents with a delicate and beautiful flower arrangement that brightens their home or hospital room.",callout:"Gentle, beautiful blooms for a beautiful moment."},productSectionHeadline:"New Baby & Welcome Bouquets",deliveryNote:"Under 1 hour delivery from confirmation available.",benefits:[{icon:"\u{1F37C}",title:"Baby-Friendly Blooms",text:"Gentle colors and lightly scented flowers"},{icon:"\u26A1",title:"Under 1 Hour Delivery",text:"Fast delivery from confirmation in Ghaziabad"},{icon:"\u{1F3E5}",title:"Hospital Delivery",text:"Safe and prompt delivery to maternity wards"},{icon:"\u{1F4F2}",title:"WhatsApp Confirmation",text:"Slot confirmed in about 10 minutes"}],areas:window.OCCASION_AREAS,steps:[{number:"01",title:"Message Us",text:"Choose a pastel or bright bouquet and share delivery details."},{number:"02",title:"Slot Confirmed",text:"WhatsApp confirmation in about 10 minutes."},{number:"03",title:"Delivered Fresh",text:"Fresh flowers reach the new parents in under 1 hour from confirmation."}],featuredProducts:[{name:"Soft Blue & White Mix",desc:"A gentle arrangement perfect for welcoming a baby boy.",image:"https://res.cloudinary.com/dlg6d4qbh/image/upload/v1779476670/Ocean_MIst_vcnm4j.png"},{name:"Delicate Pink Roses",desc:"Sweet pink blooms to celebrate a beautiful baby girl.",image:"https://lh3.googleusercontent.com/d/1Zq_aPUFhFTMSij7OmpAUboS89w2CGR27"},{name:"Joyful Yellow & Green Mix",desc:"A gender-neutral, vibrant bouquet of joy.",image:"https://res.cloudinary.com/dlg6d4qbh/image/upload/v1779505186/Royal_Sunflower_z1zf1o.png"}],faqs:[{q:"Can you deliver new baby flowers to hospitals in Ghaziabad?",a:"Yes, we can deliver directly to the maternity ward. Just provide the hospital name and room number."},{q:"How fast is the delivery?",a:"Order before 8 PM to get under 1 hour delivery from confirmation."},{q:"Are the flowers safe for a newborn's room?",a:"We recommend lightly scented flowers like roses or daisies to avoid overwhelming the baby."},{q:"Can I include a congratulations card?",a:"Yes, a handwritten welcome card is included for free."}],relatedOccasions:[{label:"Congratulations Flowers",href:"#/congratulations-flowers-ghaziabad"},{label:"Get Well Soon Flowers",href:"#/get-well-soon-flowers-ghaziabad"}],heroImage:"https://lh3.googleusercontent.com/d/1JTTaBprDopk8V8ws6rpg2VvGRt-GS5wB",heroImageAlt:"Soft new baby bouquet in Ghaziabad"},"housewarming-flowers-ghaziabad":{pageTitle:"Housewarming Flowers Delivery in Ghaziabad | Rose n Petals",mainKeyword:"housewarming flowers Ghaziabad",occasionName:"Housewarming",occasionEmoji:"\u{1F3E1}",headline:"Send Housewarming Flowers in Ghaziabad",subheadline:"Celebrate their new home. Order before 8 PM to get under 1 hour delivery from confirmation. Starting \u20B9200.",startingPrice:"\u20B9200",ctaText:"Order Housewarming Flowers on WhatsApp",whatsappNumber:"917289996804",whatsappMessage:"Hi! I want to send housewarming flowers to someone in Ghaziabad.",occasionSection:{headline:"Welcome Them to Their New Home",text:"A new home is a fresh start. Send a beautiful, elegant floral arrangement to bring warmth, color, and life to their new space.",callout:"Elegant centerpieces and bouquets for new beginnings."},productSectionHeadline:"Housewarming Centerpieces & Bouquets",deliveryNote:"Under 1 hour delivery from confirmation available.",benefits:[{icon:"\u{1F3E1}",title:"Home Decor Blooms",text:"Elegant arrangements perfect for a new living room"},{icon:"\u26A1",title:"Under 1 Hour Delivery",text:"Fast delivery from confirmation in Ghaziabad"},{icon:"\u{1F4B0}",title:"Starting \u20B9200",text:"Honest pricing for premium quality"},{icon:"\u{1F4F2}",title:"WhatsApp Confirmation",text:"Slot confirmed in about 10 minutes"}],areas:window.OCCASION_AREAS,steps:[{number:"01",title:"Message Us",text:"Choose a beautiful arrangement and send us the address."},{number:"02",title:"Slot Confirmed",text:"WhatsApp confirmation in about 10 minutes."},{number:"03",title:"Flowers Delivered",text:"Fresh flowers reach their new home in under 1 hour from confirmation."}],featuredProducts:[{name:"Elegant Lily Centerpiece",desc:"A sophisticated arrangement to grace their new dining table.",image:"https://lh3.googleusercontent.com/d/1V48ZJQ1Q0y39kubUK3Z3dzGXCx-5Lx0k"},{name:"Bright Mixed Garden",desc:"Colorful and vibrant flowers to bring joy to any room.",image:"https://res.cloudinary.com/dlg6d4qbh/image/upload/v1779475822/Carnival_Mix_d2c4cl.png"},{name:"Premium Orchid Pot",desc:"A long-lasting, luxury orchid arrangement for their new space.",image:"https://lh3.googleusercontent.com/d/1owFZSTGRXuKYAEdTZkpZtFh_rAg2mqVV"}],faqs:[{q:"How quickly can you deliver housewarming flowers?",a:"Order before 8 PM to get under 1 hour delivery from confirmation."},{q:"What kind of flowers are best for housewarming?",a:"Lilies, orchids, and bright mixed arrangements are great because they serve as elegant interior decor."},{q:"Can I deliver flowers on the day they move in?",a:"Yes! Just WhatsApp us the new address and preferred time slot, and we will handle the rest."},{q:"Is a greeting card included?",a:'Yes, we include a free handwritten card where you can write your "Welcome Home" wishes.'}],relatedOccasions:[{label:"Congratulations Flowers",href:"#/congratulations-flowers-ghaziabad"},{label:"Diwali Flowers",href:"#/diwali-flowers-ghaziabad"}],heroImage:"https://res.cloudinary.com/dlg6d4qbh/image/upload/v1779504779/Tulip_Charm_qi8hg1.png",heroImageAlt:"Elegant housewarming bouquet in Ghaziabad"},"sympathy-flowers-ghaziabad":{pageTitle:"Sympathy & Condolence Flowers Ghaziabad | Rose n Petals",mainKeyword:"sympathy flowers Ghaziabad",occasionName:"Sympathy & Condolence",occasionEmoji:"\u{1F54A}\uFE0F",headline:"Send Sympathy & Condolence Flowers in Ghaziabad",subheadline:"Express your deepest condolences with peaceful, elegant arrangements. Prompt delivery available. Starting \u20B9200.",startingPrice:"\u20B9200",ctaText:"Send Sympathy Flowers on WhatsApp",whatsappNumber:"917289996804",whatsappMessage:"Hi. I need to arrange sympathy/condolence flowers for delivery in Ghaziabad.",occasionSection:{headline:"A Respectful Tribute",text:"During difficult times, a serene arrangement of white and pastel blooms conveys your support and deepest sympathies respectfully and quietly.",callout:"Peaceful, elegant blooms delivered with care and respect."},productSectionHeadline:"Condolence & Sympathy Arrangements",deliveryNote:"Prompt and respectful delivery in Ghaziabad.",benefits:[{icon:"\u{1F54A}\uFE0F",title:"Respectful Arrangements",text:"Serene white lilies and calming blooms"},{icon:"\u{1F69A}",title:"Prompt Delivery",text:"Timely and quiet delivery to the family"},{icon:"\u{1F4B0}",title:"Starting \u20B9200",text:"Simple, elegant options available"},{icon:"\u{1F4F2}",title:"WhatsApp Confirmation",text:"Slot confirmed in about 10 minutes"}],areas:window.OCCASION_AREAS,steps:[{number:"01",title:"Message Us",text:"Select a serene bouquet and provide delivery details."},{number:"02",title:"Order Confirmed",text:"We confirm details quickly and respectfully."},{number:"03",title:"Quiet Delivery",text:"Flowers are delivered promptly and respectfully to the location."}],featuredProducts:[{name:"Serene White Lilies",desc:"A classic and peaceful arrangement representing purity and sympathy.",image:"https://res.cloudinary.com/dlg6d4qbh/image/upload/v1779506580/Vitage_Tale_n6pxuo.png"},{name:"Gentle White Roses",desc:"Soft white roses arranged respectfully for condolences.",image:"https://res.cloudinary.com/dlg6d4qbh/image/upload/v1779516704/Harmony_Blush_bpdbwl.png"},{name:"Peaceful White & Green Mix",desc:"A calming assortment of white blooms and fresh greens.",image:"https://res.cloudinary.com/dlg6d4qbh/image/upload/v1779476670/Ocean_MIst_vcnm4j.png"}],faqs:[{q:"How quickly can sympathy flowers be delivered?",a:"We prioritise sympathy orders and ensure prompt delivery. WhatsApp us for immediate assistance."},{q:"What are the appropriate flowers for condolences?",a:"White lilies, white roses, and carnations are traditionally the most respectful choices for sympathy."},{q:"Can you deliver to a specific venue or home?",a:"Yes, we can deliver to homes, halls, or any specified address in Ghaziabad quietly and respectfully."},{q:"Can I include a condolence message?",a:"Yes, we will carefully write your message on a simple, elegant card to accompany the flowers."}],relatedOccasions:[{label:"Get Well Soon Flowers",href:"#/get-well-soon-flowers-ghaziabad"},{label:"Apology Flowers",href:"#/sorry-flowers-ghaziabad"}],heroImage:"https://res.cloudinary.com/dlg6d4qbh/image/upload/v1779476670/Ocean_MIst_vcnm4j.png",heroImageAlt:"Serene sympathy bouquet in Ghaziabad"},"diwali-flowers-ghaziabad":{pageTitle:"Diwali & Festival Flowers Delivery Ghaziabad | Rose n Petals",mainKeyword:"diwali flowers Ghaziabad",occasionName:"Festival & Diwali",occasionEmoji:"\u{1FA94}",headline:"Brighten the Festivities with Diwali Flowers in Ghaziabad",subheadline:"Send festive joy to family and friends. Order before 8 PM to get under 1 hour delivery from confirmation. Starting \u20B9200.",startingPrice:"\u20B9200",ctaText:"Order Festive Flowers on WhatsApp",whatsappNumber:"917289996804",whatsappMessage:"Hi! I want to order flowers for Diwali/Festival delivery in Ghaziabad.",occasionSection:{headline:"Add Color to Their Celebrations",text:"Festivals are a time of joy, light, and togetherness. Send a vibrant, premium flower arrangement to share the festive spirit with your loved ones in Ghaziabad.",callout:"Vibrant, premium blooms to match the festive spirit."},productSectionHeadline:"Festive Special Bouquets",deliveryNote:"Under 1 hour delivery from confirmation available.",benefits:[{icon:"\u{1FA94}",title:"Festive Themes",text:"Bright, vibrant, and joyful arrangements"},{icon:"\u26A1",title:"Under 1 Hour Delivery",text:"Fast delivery from confirmation in Ghaziabad"},{icon:"\u{1F4B0}",title:"Starting \u20B9200",text:"Honest pricing for premium quality"},{icon:"\u{1F4F2}",title:"WhatsApp Confirmation",text:"Slot confirmed in about 10 minutes"}],areas:window.OCCASION_AREAS,steps:[{number:"01",title:"Message Us",text:"Choose a vibrant festive bouquet and send us the details."},{number:"02",title:"Slot Confirmed",text:"WhatsApp confirmation in about 10 minutes."},{number:"03",title:"Joy Delivered",text:"Fresh flowers reach them in under 1 hour from confirmation."}],featuredProducts:[{name:"Vibrant Yellow & Orange Mix",desc:"Marigolds and roses that capture the essence of Diwali.",image:"https://lh3.googleusercontent.com/d/1edFTn-jyEQVOujkgEP7bzWB-ipbAB--R"},{name:"Premium Festive Orchids",desc:"A sophisticated and long-lasting gift for festival greetings.",image:"https://lh3.googleusercontent.com/d/1bu6hIhMX4d-IHIjnmFVG7OkNz6Dx74t1"},{name:"Classic Red & Gold Arrangement",desc:"Rich, luxurious blooms perfect for festive celebrations.",image:"https://lh3.googleusercontent.com/d/1_pEGn0sH9qo6zuhQKRj4k62KbZeKXK2V"}],faqs:[{q:"Can I pre-book flowers for Diwali delivery?",a:"Yes! We highly recommend pre-booking as festival days get very busy. Secure your delivery slot via WhatsApp."},{q:"Do you offer same-day delivery during festivals?",a:"Yes, order before 8 PM to get under 1 hour delivery from confirmation, subject to slot availability on peak days."},{q:"Can I add sweets or chocolates to my festival order?",a:"Yes, we can include standard chocolates. Let us know your requirements on WhatsApp."},{q:"Are there special festive discounts?",a:"We maintain honest, flat pricing starting at \u20B9200 year-round, with no artificial price hikes during festivals."}],relatedOccasions:[{label:"Housewarming Flowers",href:"#/housewarming-flowers-ghaziabad"},{label:"Congratulations Flowers",href:"#/congratulations-flowers-ghaziabad"}],heroImage:"https://res.cloudinary.com/dlg6d4qbh/image/upload/v1779505186/Royal_Sunflower_z1zf1o.png",heroImageAlt:"Vibrant festive bouquet in Ghaziabad"}};window.OccasionRoutes={get SLUGS(){return window.OccasionPagesData?Object.keys(window.OccasionPagesData):[]},isOccasionPage(a){return this.SLUGS.includes(a)},render(a,r){let e=window.OccasionPagesData?window.OccasionPagesData[r]:null;if(!e)return;document.title=e.pageTitle;let t=`https://api.whatsapp.com/send?phone=${e.whatsappNumber}&text=${encodeURIComponent(e.whatsappMessage)}`,i="";e.featuredProducts&&e.featuredProducts.length>0&&(i=e.featuredProducts.map(c=>`
                <article class="product-card">
                    ${c.image?`
                    <a href="${t}" target="_blank" rel="noopener noreferrer" class="product-card__image">
                        <img src="${c.image}" alt="${c.name}" class="rnp-product-card-image" loading="lazy">
                    </a>
                    `:`
                    <div class="product-card__image" style="background: var(--rnp-bg-secondary, #fff5f8); display: flex; align-items: center; justify-content: center; min-height: 200px;">
                        <span style="font-size: 3rem;">${e.occasionEmoji}</span>
                    </div>
                    `}
                    <div class="product-card__content" style="flex: 1; display: flex; flex-direction: column;">
                        <h3 class="product-card__title">${c.name}</h3>
                        <p class="product-card__desc" style="flex: 1; margin-bottom: 1rem;">${c.desc}</p>
                        <div class="product-card__price-row" style="margin-top: auto; display: flex;">
                            <a href="${t}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm product-card__btn" style="width: 100%; text-align: center;">Order on WhatsApp</a>
                        </div>
                    </div>
                </article>
            `).join(""));let d=(e.benefits||[]).map(c=>`
            <li class="rnp-trust-bar__item">
                <span class="rnp-trust-bar__icon" aria-hidden="true">${c.icon}</span>
                <span>
                    <strong class="rnp-trust-bar__title">${c.title}</strong>
                    <span class="rnp-trust-bar__text">${c.text}</span>
                </span>
            </li>
        `).join(""),n=(e.steps||[]).map(c=>`
            <li class="rnp-steps__item">
                <span class="rnp-steps__num" aria-hidden="true">${c.number}</span>
                <div>
                    <h3 class="rnp-steps__title">${c.title}</h3>
                    <p class="rnp-steps__text">${c.text}</p>
                </div>
            </li>
        `).join(""),l=(e.areas||[]).map(c=>`<li class="rnp-areas__pill">${c}</li>`).join(""),u=(e.faqs||[]).map(c=>`
            <details class="rnp-faqs__item">
                <summary class="rnp-faqs__q">${c.q}</summary>
                <dd class="rnp-faqs__a">${c.a}</dd>
            </details>
        `).join(""),o="";e.relatedOccasions&&e.relatedOccasions.length>0&&(o=`
                <section class="rnp-section rnp-related" aria-labelledby="related-h2">
                    <h2 id="related-h2" class="rnp-section__h2">Shop by Occasion</h2>
                    <ul class="rnp-related__list" role="list">
                        ${e.relatedOccasions.map(c=>`
                            <li class="rnp-related__item">
                                <a class="rnp-btn rnp-btn--ghost rnp-btn--sm" href="${c.href}">${c.label} \u2192</a>
                            </li>
                        `).join("")}
                    </ul>
                </section>
            `);let g=`Order ${e.mainKeyword.split(" ").map(c=>c.charAt(0).toUpperCase()+c.slice(1)).join(" ")} Right Now`;a.innerHTML=`
            <main class="rnp-page rnp-page--occasion">

                <!-- \u2500\u2500 HERO \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->
                <section class="rnp-hero rnp-hero--occasion" aria-label="Hero">
                    <div class="rnp-hero__copy">
                        <span class="rnp-hero__occasion-badge" aria-hidden="true">
                            ${e.occasionEmoji} ${e.occasionName}
                        </span>
                        <h1 class="rnp-hero__h1">${e.headline}</h1>
                        <p class="rnp-hero__sub">${e.subheadline}</p>
                        <p class="rnp-hero__price">Starting at <strong>${e.startingPrice}</strong></p>
                        <a class="rnp-btn rnp-btn--wa rnp-btn--lg" href="${t}" target="_blank" rel="noopener noreferrer">
                            ${e.ctaText}
                        </a>
                        ${e.deliveryNote?`<p class="rnp-hero__delivery-note">\u{1F4E6} ${e.deliveryNote}</p>`:""}
                    </div>
                    <div class="rnp-hero__media" aria-hidden="true">
                        ${e.heroImage?`
                        <img src="${e.heroImage}" alt="${e.heroImageAlt||e.occasionName}" style="width: 100%; height: auto; object-fit: contain;">
                        `:`
                        <div class="rnp-placeholder rnp-placeholder--hero" style="background: var(--rnp-bg-dark); color: var(--rnp-pink); font-weight: 600;">${e.occasionName.toUpperCase()} BOUQUETS</div>
                        `}
                    </div>
                </section>

                <!-- \u2500\u2500 OCCASION EMOTIONAL SECTION \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->
                <section class="rnp-section rnp-occasion-block" aria-labelledby="occasion-h2">
                    <h2 id="occasion-h2" class="rnp-section__h2">${e.occasionSection.headline}</h2>
                    <p class="rnp-occasion-block__text">${e.occasionSection.text}</p>
                    ${e.occasionSection.callout?`<p class="rnp-occasion-block__callout">${e.occasionSection.callout}</p>`:""}
                </section>

                <!-- \u2500\u2500 PRODUCT GRID \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->
                <section class="rnp-section rnp-products" aria-labelledby="products-h2">
                    <h2 id="products-h2" class="rnp-section__h2">${e.productSectionHeadline}</h2>
                    <div class="product-grid" style="margin-top: 2rem;">
                        ${i}
                    </div>
                    <div class="rnp-section__footer" style="margin-top: 2rem; text-align: center;">
                        <a class="rnp-btn rnp-btn--ghost" href="#/catalog">Browse All Bouquets \u2192</a>
                    </div>
                </section>

                <!-- \u2500\u2500 TRUST BAR \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->
                <section class="rnp-trust-bar" aria-label="Why order ${e.occasionName} flowers from us">
                    <ul class="rnp-trust-bar__list" role="list">
                        ${d}
                    </ul>
                </section>

                <!-- \u2500\u2500 HOW IT WORKS \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->
                <section class="rnp-section rnp-steps" aria-labelledby="steps-h2" id="how-it-works">
                    <h2 id="steps-h2" class="rnp-section__h2">Order Your ${e.occasionName} Bouquet in 3 Steps</h2>
                    <ol class="rnp-steps__list" role="list">
                        ${n}
                    </ol>
                </section>

                <!-- \u2500\u2500 AREAS COVERED \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->
                <section class="rnp-section rnp-areas" aria-labelledby="areas-h2">
                    <h2 id="areas-h2" class="rnp-section__h2">${e.occasionName} Flower Delivery \u2014 All of Ghaziabad</h2>
                    <ul class="rnp-areas__grid" role="list">
                        ${l}
                    </ul>
                </section>

                <!-- \u2500\u2500 FAQs \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->
                <section class="rnp-section rnp-faqs" aria-labelledby="faqs-h2">
                    <h2 id="faqs-h2" class="rnp-section__h2">FAQs \u2014 ${e.occasionName} Flower Delivery</h2>
                    <dl class="rnp-faqs__list">
                        ${u}
                    </dl>
                </section>

                <!-- \u2500\u2500 RELATED OCCASIONS \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->
                ${o}

                <!-- \u2500\u2500 BOTTOM CTA \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->
                <section class="rnp-section rnp-cta-block" aria-label="Order now">
                    <h2 class="rnp-cta-block__h2">${g}</h2>
                    <p class="rnp-cta-block__sub">Order before 8 PM to get under 1 hour delivery \xB7 Starting ${e.startingPrice} \xB7 WhatsApp confirmation in about 10 minutes</p>
                    <a class="rnp-btn rnp-btn--wa rnp-btn--lg" href="${t}" target="_blank" rel="noopener noreferrer">${e.ctaText}</a>
                </section>

            </main>
        `}};window.SHARED_BENEFITS=window.SHARED_BENEFITS||[{icon:"\u{1F339}",title:"Fresh & Handmade",text:"Every bouquet made to order"},{icon:"\u26A1",title:"Fast Local Delivery",text:"Delivered in under 1 hour"},{icon:"\u{1F4B0}",title:"Starting \u20B9200",text:"Premium flowers at local prices"},{icon:"\u{1F4F2}",title:"Easy WhatsApp Order",text:"Slot confirmed in 10 minutes"}];window.SHARED_STEPS=window.SHARED_STEPS||[{number:"01",title:"Browse Bouquets",text:"Check out our fresh arrangements below."},{number:"02",title:"WhatsApp Us",text:"Send us your address in {areaName}."},{number:"03",title:"Fast Delivery",text:"We deliver fresh, on time, in under 1 hour."}];window.SHARED_NEARBY_AREAS=window.SHARED_NEARBY_AREAS||[{label:"Indirapuram",href:"#/flower-delivery-indirapuram"},{label:"Vaishali",href:"#/flower-delivery-vaishali-ghaziabad"},{label:"Vasundhara",href:"#/flower-delivery-vasundhara-ghaziabad"},{label:"Raj Nagar",href:"#/flower-delivery-raj-nagar-ghaziabad"},{label:"Kavi Nagar",href:"#/flower-delivery-kavi-nagar-ghaziabad"},{label:"Mohan Nagar",href:"#/flower-delivery-mohan-nagar-ghaziabad"},{label:"Vijay Nagar",href:"#/flower-delivery-vijay-nagar-ghaziabad"},{label:"Crossing Republik",href:"#/flower-delivery-crossing-republik-ghaziabad"}];function f(a){return window.SHARED_NEARBY_AREAS.filter(r=>r.label!==a).slice(0,5)}window.LocalAreaPagesData={"flower-delivery-indirapuram":{slug:"flower-delivery-indirapuram",pageTitle:"Flower Delivery in Indirapuram | Rose n Petals",metaDescription:"Fresh flower delivery in Indirapuram in under 1 hour. Order handmade bouquets starting from \u20B9200 on WhatsApp today.",canonicalUrl:"https://rosenpetals.com/#/flower-delivery-indirapuram",areaName:"Indirapuram",cityName:"Ghaziabad",headline:"Flower Delivery in Indirapuram \u2014 Fresh Bouquets from \u20B9200",subheadline:"Same-day delivery to Indirapuram \xB7 Handmade bouquets \xB7 WhatsApp order",startingPrice:"\u20B9200",deliveryTime:"under 1 hour",deliveryProof:[{icon:"\u{1F4CD}",text:"We deliver directly to Indirapuram from our Ghaziabad shop"},{icon:"\u23F1\uFE0F",text:"Average delivery time: Under 1 hour to Indirapuram"},{icon:"\u{1F4DE}",text:"Local WhatsApp support \u2014 call or chat anytime"}],benefits:window.SHARED_BENEFITS,nearbyAreas:f("Indirapuram"),steps:window.SHARED_STEPS,faqs:[{q:"Do you deliver to all parts of Indirapuram?",a:"Yes, we deliver everywhere in Indirapuram, including Ahinsa Khand, Nyay Khand, Niti Khand, Shakti Khand, Vaibhav Khand, Abhay Khand and Gyan Khand."},{q:"How long does delivery take to Indirapuram?",a:"Delivery typically takes under 1 hour from order confirmation."},{q:"Is same-day delivery available in Indirapuram?",a:"Yes! Order before 8 PM for guaranteed same-day delivery to any address in Indirapuram."},{q:"What is the minimum order for Indirapuram delivery?",a:"Our beautiful bouquets start from just \u20B9200, with no hidden express fees."}]},"flower-delivery-vaishali-ghaziabad":{slug:"flower-delivery-vaishali-ghaziabad",pageTitle:"Flower Delivery in Vaishali, Ghaziabad | Rose n Petals",metaDescription:"Fresh flower delivery in Vaishali in under 1 hour. Order handmade bouquets starting from \u20B9200 on WhatsApp today.",canonicalUrl:"https://rosenpetals.com/#/flower-delivery-vaishali-ghaziabad",areaName:"Vaishali",cityName:"Ghaziabad",headline:"Flower Delivery in Vaishali \u2014 Fresh Bouquets from \u20B9200",subheadline:"Same-day delivery to Vaishali \xB7 Handmade bouquets \xB7 WhatsApp order",startingPrice:"\u20B9200",deliveryTime:"under 1 hour",deliveryProof:[{icon:"\u{1F4CD}",text:"We deliver directly to Vaishali from our Ghaziabad shop"},{icon:"\u23F1\uFE0F",text:"Average delivery time: Under 1 hour to Vaishali"},{icon:"\u{1F4DE}",text:"Local WhatsApp support \u2014 call or chat anytime"}],benefits:window.SHARED_BENEFITS,nearbyAreas:f("Vaishali"),steps:window.SHARED_STEPS,faqs:[{q:"Do you deliver to all sectors of Vaishali?",a:"Yes, we deliver to all sectors in Vaishali, Ghaziabad, and nearby localities."},{q:"How long does delivery take to Vaishali?",a:"Delivery typically takes under 1 hour from order confirmation."},{q:"Is same-day delivery available in Vaishali?",a:"Yes! Order before 8 PM for guaranteed same-day delivery to any address in Vaishali."},{q:"What is the minimum order for Vaishali delivery?",a:"Our beautiful bouquets start from just \u20B9200, with no hidden express fees."}]},"flower-delivery-vasundhara-ghaziabad":{slug:"flower-delivery-vasundhara-ghaziabad",pageTitle:"Flower Delivery in Vasundhara, Ghaziabad | Rose n Petals",metaDescription:"Fresh flower delivery in Vasundhara in under 1 hour. Order handmade bouquets starting from \u20B9200 on WhatsApp today.",canonicalUrl:"https://rosenpetals.com/#/flower-delivery-vasundhara-ghaziabad",areaName:"Vasundhara",cityName:"Ghaziabad",headline:"Flower Delivery in Vasundhara \u2014 Fresh Bouquets from \u20B9200",subheadline:"Same-day delivery to Vasundhara \xB7 Handmade bouquets \xB7 WhatsApp order",startingPrice:"\u20B9200",deliveryTime:"under 1 hour",deliveryProof:[{icon:"\u{1F4CD}",text:"We deliver directly to Vasundhara from our Ghaziabad shop"},{icon:"\u23F1\uFE0F",text:"Average delivery time: Under 1 hour to Vasundhara"},{icon:"\u{1F4DE}",text:"Local WhatsApp support \u2014 call or chat anytime"}],benefits:window.SHARED_BENEFITS,nearbyAreas:f("Vasundhara"),steps:window.SHARED_STEPS,faqs:[{q:"Do you deliver to all sectors of Vasundhara?",a:"Yes, we deliver to all sectors in Vasundhara, Ghaziabad, right to your doorstep."},{q:"How long does delivery take to Vasundhara?",a:"Delivery typically takes under 1 hour from order confirmation."},{q:"Is same-day delivery available in Vasundhara?",a:"Yes! Order before 8 PM for guaranteed same-day delivery to any address in Vasundhara."},{q:"What is the minimum order for Vasundhara delivery?",a:"Our beautiful bouquets start from just \u20B9200, with no hidden express fees."}]},"flower-delivery-raj-nagar-ghaziabad":{slug:"flower-delivery-raj-nagar-ghaziabad",pageTitle:"Flower Delivery in Raj Nagar, Ghaziabad | Rose n Petals",metaDescription:"Fresh flower delivery in Raj Nagar in under 1 hour. Order handmade bouquets starting from \u20B9200 on WhatsApp today.",canonicalUrl:"https://rosenpetals.com/#/flower-delivery-raj-nagar-ghaziabad",areaName:"Raj Nagar",cityName:"Ghaziabad",headline:"Flower Delivery in Raj Nagar \u2014 Fresh Bouquets from \u20B9200",subheadline:"Same-day delivery to Raj Nagar \xB7 Handmade bouquets \xB7 WhatsApp order",startingPrice:"\u20B9200",deliveryTime:"under 1 hour",deliveryProof:[{icon:"\u{1F4CD}",text:"We deliver directly to Raj Nagar from our local Ghaziabad shop"},{icon:"\u23F1\uFE0F",text:"Average delivery time: Under 1 hour to Raj Nagar"},{icon:"\u{1F4DE}",text:"Local WhatsApp support \u2014 call or chat anytime"}],benefits:window.SHARED_BENEFITS,nearbyAreas:f("Raj Nagar"),steps:window.SHARED_STEPS,faqs:[{q:"Do you deliver to all parts of Raj Nagar?",a:"Yes, we deliver everywhere in Raj Nagar, Ghaziabad, and nearby areas."},{q:"How long does delivery take to Raj Nagar?",a:"Delivery typically takes under 1 hour from order confirmation."},{q:"Is same-day delivery available in Raj Nagar?",a:"Yes! Order before 8 PM for guaranteed same-day delivery to any address in Raj Nagar."},{q:"What is the minimum order for Raj Nagar delivery?",a:"Our beautiful bouquets start from just \u20B9200, with no hidden express fees."}]},"flower-delivery-kavi-nagar-ghaziabad":{slug:"flower-delivery-kavi-nagar-ghaziabad",pageTitle:"Flower Delivery in Kavi Nagar, Ghaziabad | Rose n Petals",metaDescription:"Fresh flower delivery in Kavi Nagar in under 1 hour. Order handmade bouquets starting from \u20B9200 on WhatsApp today.",canonicalUrl:"https://rosenpetals.com/#/flower-delivery-kavi-nagar-ghaziabad",areaName:"Kavi Nagar",cityName:"Ghaziabad",headline:"Flower Delivery in Kavi Nagar \u2014 Fresh Bouquets from \u20B9200",subheadline:"Same-day delivery to Kavi Nagar \xB7 Handmade bouquets \xB7 WhatsApp order",startingPrice:"\u20B9200",deliveryTime:"under 1 hour",deliveryProof:[{icon:"\u{1F4CD}",text:"We deliver directly to Kavi Nagar from our local shop"},{icon:"\u23F1\uFE0F",text:"Average delivery time: Under 1 hour to Kavi Nagar"},{icon:"\u{1F4DE}",text:"Local WhatsApp support \u2014 call or chat anytime"}],benefits:window.SHARED_BENEFITS,nearbyAreas:f("Kavi Nagar"),steps:window.SHARED_STEPS,faqs:[{q:"Do you deliver to all parts of Kavi Nagar?",a:"Yes, we deliver everywhere in Kavi Nagar, Ghaziabad, right to your doorstep."},{q:"How long does delivery take to Kavi Nagar?",a:"Delivery typically takes under 1 hour from order confirmation."},{q:"Is same-day delivery available in Kavi Nagar?",a:"Yes! Order before 8 PM for guaranteed same-day delivery to any address in Kavi Nagar."},{q:"What is the minimum order for Kavi Nagar delivery?",a:"Our beautiful bouquets start from just \u20B9200, with no hidden express fees."}]},"flower-delivery-mohan-nagar-ghaziabad":{slug:"flower-delivery-mohan-nagar-ghaziabad",pageTitle:"Flower Delivery in Mohan Nagar, Ghaziabad | Rose n Petals",metaDescription:"Fresh flower delivery in Mohan Nagar in under 1 hour. Order handmade bouquets starting from \u20B9200 on WhatsApp today.",canonicalUrl:"https://rosenpetals.com/#/flower-delivery-mohan-nagar-ghaziabad",areaName:"Mohan Nagar",cityName:"Ghaziabad",headline:"Flower Delivery in Mohan Nagar \u2014 Fresh Bouquets from \u20B9200",subheadline:"Same-day delivery to Mohan Nagar \xB7 Handmade bouquets \xB7 WhatsApp order",startingPrice:"\u20B9200",deliveryTime:"under 1 hour",deliveryProof:[{icon:"\u{1F4CD}",text:"We deliver directly to Mohan Nagar from our Ghaziabad shop"},{icon:"\u23F1\uFE0F",text:"Average delivery time: Under 1 hour to Mohan Nagar"},{icon:"\u{1F4DE}",text:"Local WhatsApp support \u2014 call or chat anytime"}],benefits:window.SHARED_BENEFITS,nearbyAreas:f("Mohan Nagar"),steps:window.SHARED_STEPS,faqs:[{q:"Do you deliver to all parts of Mohan Nagar?",a:"Yes, we deliver everywhere in Mohan Nagar, Ghaziabad, and the surrounding regions."},{q:"How long does delivery take to Mohan Nagar?",a:"Delivery typically takes under 1 hour from order confirmation."},{q:"Is same-day delivery available in Mohan Nagar?",a:"Yes! Order before 8 PM for guaranteed same-day delivery to any address in Mohan Nagar."},{q:"What is the minimum order for Mohan Nagar delivery?",a:"Our beautiful bouquets start from just \u20B9200, with no hidden express fees."}]},"flower-delivery-vijay-nagar-ghaziabad":{slug:"flower-delivery-vijay-nagar-ghaziabad",pageTitle:"Flower Delivery in Vijay Nagar, Ghaziabad | Rose n Petals",metaDescription:"Fresh flower delivery in Vijay Nagar in under 1 hour. Order handmade bouquets starting from \u20B9200 on WhatsApp today.",canonicalUrl:"https://rosenpetals.com/#/flower-delivery-vijay-nagar-ghaziabad",areaName:"Vijay Nagar",cityName:"Ghaziabad",headline:"Flower Delivery in Vijay Nagar \u2014 Fresh Bouquets from \u20B9200",subheadline:"Same-day delivery to Vijay Nagar \xB7 Handmade bouquets \xB7 WhatsApp order",startingPrice:"\u20B9200",deliveryTime:"under 1 hour",deliveryProof:[{icon:"\u{1F4CD}",text:"We deliver directly to Vijay Nagar from our Ghaziabad shop"},{icon:"\u23F1\uFE0F",text:"Average delivery time: Under 1 hour to Vijay Nagar"},{icon:"\u{1F4DE}",text:"Local WhatsApp support \u2014 call or chat anytime"}],benefits:window.SHARED_BENEFITS,nearbyAreas:f("Vijay Nagar"),steps:window.SHARED_STEPS,faqs:[{q:"Do you deliver to all sectors of Vijay Nagar?",a:"Yes, we deliver to all sectors in Vijay Nagar, Ghaziabad, right to your doorstep."},{q:"How long does delivery take to Vijay Nagar?",a:"Delivery typically takes under 1 hour from order confirmation."},{q:"Is same-day delivery available in Vijay Nagar?",a:"Yes! Order before 8 PM for guaranteed same-day delivery to any address in Vijay Nagar."},{q:"What is the minimum order for Vijay Nagar delivery?",a:"Our beautiful bouquets start from just \u20B9200, with no hidden express fees."}]},"flower-delivery-crossing-republik-ghaziabad":{slug:"flower-delivery-crossing-republik-ghaziabad",pageTitle:"Flower Delivery in Crossing Republik, Ghaziabad | Rose n Petals",metaDescription:"Fresh flower delivery in Crossing Republik in under 1 hour. Order handmade bouquets starting from \u20B9200 on WhatsApp today.",canonicalUrl:"https://rosenpetals.com/#/flower-delivery-crossing-republik-ghaziabad",areaName:"Crossing Republik",cityName:"Ghaziabad",headline:"Flower Delivery in Crossing Republik \u2014 Fresh Bouquets from \u20B9200",subheadline:"Same-day delivery to Crossing Republik \xB7 Handmade bouquets \xB7 WhatsApp order",startingPrice:"\u20B9200",deliveryTime:"under 1 hour",deliveryProof:[{icon:"\u{1F4CD}",text:"We deliver directly to Crossing Republik from our Ghaziabad shop"},{icon:"\u23F1\uFE0F",text:"Average delivery time: Under 1 hour to Crossing Republik"},{icon:"\u{1F4DE}",text:"Local WhatsApp support \u2014 call or chat anytime"}],benefits:window.SHARED_BENEFITS,nearbyAreas:f("Crossing Republik"),steps:window.SHARED_STEPS,faqs:[{q:"Do you deliver to all societies in Crossing Republik?",a:"Yes, we deliver to all residential societies and commercial areas in Crossing Republik, Ghaziabad."},{q:"How long does delivery take to Crossing Republik?",a:"Delivery typically takes under 1 hour from order confirmation."},{q:"Is same-day delivery available in Crossing Republik?",a:"Yes! Order before 8 PM for guaranteed same-day delivery to any address in Crossing Republik."},{q:"What is the minimum order for Crossing Republik delivery?",a:"Our beautiful bouquets start from just \u20B9200, with no hidden express fees."}]}};window.LocalAreaRoutes={get SLUGS(){return window.LocalAreaPagesData?Object.keys(window.LocalAreaPagesData):[]},isLocalAreaPage(a){return this.SLUGS.includes(a)},render(a,r){let e=window.LocalAreaPagesData?window.LocalAreaPagesData[r]:null;if(!e)return;document.title=e.pageTitle;let t=`Hi! I want flower delivery in ${e.areaName}.`,i=`https://api.whatsapp.com/send?phone=917289996804&text=${encodeURIComponent(t)}`,d=(e.deliveryProof||[]).map(s=>`
            <li class="rnp-local-proof__item">
                <span class="rnp-local-proof__icon" aria-hidden="true">${s.icon}</span>
                <span class="rnp-local-proof__text">${s.text}</span>
            </li>
        `).join(""),n="";if(window.Store&&window.Store.getAllProducts&&window.Store.getAllProducts().length>0){let s=window.Store.getAllProducts().filter(h=>h.is_best_seller).slice(0,6);s.length>0&&window.Components&&(n=`
                    <div class="product-grid">
                        ${s.map(h=>window.Components.createProductCard(h)).join("")}
                    </div>
                `)}n||(n='<div class="rnp-placeholder">[PRODUCT GRID COMPONENT]</div>');let l=(e.benefits||[]).map(s=>`
            <li class="rnp-trust-bar__item">
                <span class="rnp-trust-bar__icon" aria-hidden="true">${s.icon}</span>
                <span>
                    <strong class="rnp-trust-bar__title">${s.title}</strong>
                    <span class="rnp-trust-bar__text">${s.text}</span>
                </span>
            </li>
        `).join(""),u=s=>s.replace("{areaName}",e.areaName),o=(e.steps||[]).map(s=>`
            <li class="rnp-steps__item">
                <span class="rnp-steps__num" aria-hidden="true">${s.number}</span>
                <div>
                    <h3 class="rnp-steps__title">${s.title}</h3>
                    <p class="rnp-steps__text">${u(s.text)}</p>
                </div>
            </li>
        `).join(""),p=(e.faqs||[]).map(s=>`
            <details class="rnp-faqs__item">
                <summary class="rnp-faqs__q">${s.q}</summary>
                <dd class="rnp-faqs__a">${s.a}</dd>
            </details>
        `).join(""),g=(e.nearbyAreas||[]).map(s=>`
            <li class="rnp-nearby__item">
                <a class="rnp-btn rnp-btn--ghost rnp-btn--sm" href="${s.href}">\u{1F338} ${s.label}</a>
            </li>
        `).join(""),c="",y="";if(window.Store&&window.Store.getAllProducts){let s=window.Store.getAllProducts().filter(h=>h.image_url);if(s.length>0){let h=s[Math.floor(Math.random()*s.length)];c=h.image_url,y=`${h.name} delivered to ${e.areaName}`}}a.innerHTML=`
            <main class="rnp-page rnp-page--local">

                <!-- \u2500\u2500 HERO \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->
                <section class="rnp-hero rnp-hero--local" aria-label="Hero">
                    <div class="rnp-hero__copy">
                        <span class="rnp-hero__local-badge">
                            \u{1F4CD} Delivering to ${e.areaName} in ${e.deliveryTime}
                        </span>
                        <h1 class="rnp-hero__h1">${e.headline}</h1>
                        <p class="rnp-hero__sub">${e.subheadline}</p>
                        <p class="rnp-hero__price">Starting at <strong>${e.startingPrice}</strong></p>
                        <a class="rnp-btn rnp-btn--wa rnp-btn--lg" href="${i}" target="_blank" rel="noopener noreferrer">
                            Order on WhatsApp
                        </a>
                    </div>
                    <div class="rnp-hero__media" aria-hidden="${c?"false":"true"}">
                        ${c?`<img class="rnp-hero__img" src="${c}" alt="${y}" loading="lazy" style="width:100%;height:auto;border-radius:12px;">`:'<div class="rnp-placeholder rnp-placeholder--hero">[BOUQUET IMAGE]</div>'}
                    </div>
                </section>

                <!-- \u2500\u2500 LOCAL DELIVERY PROOF \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->
                <section class="rnp-section rnp-local-proof" aria-labelledby="local-h2">
                    <h2 id="local-h2" class="rnp-section__h2">
                        Flower Delivery in ${e.areaName} \u2014 Why Choose Us
                    </h2>
                    <ul class="rnp-local-proof__list" role="list">
                        ${d}
                    </ul>
                </section>

                <!-- \u2500\u2500 PRODUCT GRID \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->
                <section class="rnp-section rnp-products" aria-labelledby="products-h2">
                    <h2 id="products-h2" class="rnp-section__h2">
                        Bouquets Delivered to ${e.areaName}
                    </h2>
                    ${n}
                    <div class="rnp-section__footer" style="margin-top:2rem;text-align:center;">
                        <a class="rnp-btn rnp-btn--ghost" href="#/catalog">View All Bouquets \u2192</a>
                    </div>
                </section>

                <!-- \u2500\u2500 TRUST BAR \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->
                <section class="rnp-trust-bar" aria-label="Why order from us">
                    <ul class="rnp-trust-bar__list" role="list">
                        ${l}
                    </ul>
                </section>

                <!-- \u2500\u2500 HOW IT WORKS \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->
                <section class="rnp-section rnp-steps" aria-labelledby="steps-h2" id="how-it-works">
                    <h2 id="steps-h2" class="rnp-section__h2">
                        How to Order Flowers to ${e.areaName}
                    </h2>
                    <ol class="rnp-steps__list" role="list">
                        ${o}
                    </ol>
                </section>

                <!-- \u2500\u2500 FAQs \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->
                <section class="rnp-section rnp-faqs" aria-labelledby="faqs-h2">
                    <h2 id="faqs-h2" class="rnp-section__h2">
                        FAQs \u2014 Flower Delivery in ${e.areaName}
                    </h2>
                    <dl class="rnp-faqs__list">
                        ${p}
                    </dl>
                </section>

                <!-- \u2500\u2500 NEARBY AREAS \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->
                <section class="rnp-section rnp-nearby" aria-labelledby="nearby-h2">
                    <h2 id="nearby-h2" class="rnp-section__h2">
                        We Also Deliver to Nearby Areas
                    </h2>
                    <ul class="rnp-nearby__list" role="list">
                        ${g}
                    </ul>
                </section>

                <!-- \u2500\u2500 BOTTOM CTA \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->
                <section class="rnp-section rnp-cta-block" aria-label="Order now">
                    <h2 class="rnp-cta-block__h2">
                        Order Fresh Flowers in ${e.areaName} Today
                    </h2>
                    <p class="rnp-cta-block__sub">
                        Delivered in ${e.deliveryTime} \xB7 Starting ${e.startingPrice} \xB7 Easy WhatsApp order
                    </p>
                    <a class="rnp-btn rnp-btn--wa rnp-btn--lg" href="${i}" target="_blank" rel="noopener noreferrer">
                        Order on WhatsApp
                    </a>
                </section>

            </main>
        `}};window.Pages={renderHomePage(a){document.title="Flower Delivery in Ghaziabad | Fresh Bouquets \u2013 Rose n Petals";let e=Store.getAllProducts().filter(n=>n.is_best_seller).slice(0,8),t=["All",...Store.getAllOccasionTags(),"Under \u20B9499"],i=[{title:"Browse Bouquets",description:"Explore our fresh handmade arrangements online or WhatsApp us your idea."},{title:"WhatsApp Your Order",description:"Send us your bouquet choice, delivery address in Ghaziabad, and preferred time."},{title:"Delivered in Under 1 Hour",description:"We confirm your order and deliver fresh to your door \u2014 anywhere in Ghaziabad."}],d=`
            <!-- Hero Section -->
            <section class="hero-section">
                <div class="hero-content container">
                    <span class="hero-label">\u{1F339} Ghaziabad's Best Florist</span>
                    <h1 class="hero-title" style="color: #1A1A1A;">Fresh Flower Delivery in Ghaziabad</h1>
                    <p class="hero-subtitle" style="color: #555555; font-size: 16px;">Handmade bouquets delivered to your door in under 1 hour.<br>Serving Kavi Nagar, Raj Nagar, Indirapuram, Vaishali & more.</p>
                    <p style="font-size: 14px; color: #CC0000; margin-bottom: 28px; font-weight: 500;">Starting from \u20B9200 \xB7 No app needed \xB7 Easy WhatsApp order</p>
                    <div class="hero-buttons">
                        <a href="https://wa.me/917289996804?text=Hi%2C%20I%20want%20to%20order%20a%20bouquet%20from%20Rose%20n%20Petals.%20Please%20help%20me." target="_blank" class="hero-btn-primary" style="background: #CC0000; color: white; border-radius: 8px; padding: 14px 28px; font-size: 15px; font-weight: 600; display: inline-block; box-sizing: border-box;">Order on WhatsApp</a>
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
                    <div class="trust-item">\u2726 Delivered in Under 1 Hour</div>
                    <div class="trust-item">\u2726 Fresh Handmade Bouquets Daily</div>
                    <div class="trust-item">\u2726 Starting from \u20B9200</div>
                    <div class="trust-item">\u2726 Order on WhatsApp \u2014 No App Needed</div>
                </div>
            </div>
            
            <!-- Delivery Area -->
            <section class="delivery-area-section">
                <span style="font-size: 12px; color: rgba(255,255,255,0.7); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px; display: block;">\u{1F4CD} Where We Deliver</span>
                <h2 style="font-size: 28px; color: white; font-weight: 700; margin-bottom: 8px;">We Deliver Across All of Ghaziabad</h2>
                <p style="font-size: 15px; color: rgba(255,255,255,0.85); margin-bottom: 32px;">Fresh bouquets to your door in under 1 hour</p>
                <div class="area-cards-grid">
                    <div class="area-card"><span class="area-emoji">\u{1F3E1}</span>Kavi Nagar</div>
                    <div class="area-card"><span class="area-emoji">\u{1F33F}</span>Raj Nagar</div>
                    <div class="area-card"><span class="area-emoji">\u{1F3D9}\uFE0F</span>Indirapuram</div>
                    <div class="area-card"><span class="area-emoji">\u{1F338}</span>Vaishali</div>
                    <div class="area-card"><span class="area-emoji">\u{1F333}</span>Vasundhara</div>
                    <div class="area-card"><span class="area-emoji">\u{1F3D8}\uFE0F</span>Mohan Nagar</div>
                    <div class="area-card"><span class="area-emoji">\u{1F33B}</span>Vijay Nagar</div>
                    <div class="area-card"><span class="area-emoji">\u{1F3D7}\uFE0F</span>Crossing Republik</div>
                </div>
                <p style="color: rgba(255,255,255,0.8); font-size: 14px; margin-bottom: 20px;">Not sure if we deliver to your area?<br>Just WhatsApp us \u2014 we will reach you!</p>
                <a href="https://wa.me/917289996804?text=Hi%2C%20I%20want%20to%20order%20a%20bouquet%20from%20Rose%20n%20Petals.%20Please%20help%20me." target="_blank" class="hero-btn-primary" style="background: white; color: #CC0000; border-radius: 8px; padding: 14px 32px; font-size: 15px; font-weight: 700; box-shadow: 0 4px 16px rgba(0,0,0,0.2); display: inline-block; transition: all 0.2s ease;">Order on WhatsApp Now</a>
            </section>
            
            <!-- Shop by Occasion -->
            <section class="section container">
                <h2 class="section-title">Shop by occasion</h2>
                ${Components.createFilterChips(t,"All")}
            </section>
            
            <!-- Best Sellers -->
            <section class="section section-light">
                <div class="container">
                    <h2 class="section-title">Best Sellers</h2>
                    <div class="product-grid">
                        ${e.map((n,l)=>Components.createProductCard(n,l)).join("")}
                    </div>
                    ${e.length===0?'<p class="text-center text-muted">No best sellers found currently.</p>':""}
                </div>
            </section>
            
            <!-- Custom Bouquet Banner -->
            <section class="section container" style="padding-top: 0;">
                ${Components.createCustomBouquetBanner()}
            </section>
            
            <!-- How it works -->
            <section id="how-it-works" class="section container">
                <h2 class="section-title">How it works</h2>
                ${Components.createSteps(i)}
            </section>
            
            <!-- About Us -->
            <section class="section section-light">
                <div class="container">
                    <div class="about-card p-4" style="background: white; padding: 32px;">
                        <h2 class="section-title text-left mb-4" style="text-align: left;">About Rose n Petals</h2>
                        <p>Rose n Petals is a local flower shop based in Kavi Nagar, Ghaziabad \u2014 run with love and a genuine passion for fresh flowers.</p>
                        <p>We are not a big national brand with a call centre. We are your neighbourhood florist. Every bouquet we make is handcrafted fresh \u2014 not pre-packaged, not mass-produced. When you order from us, a real person reads your WhatsApp message, makes your bouquet, and sends it out to you in under 1 hour.</p>
                        <p>Our shop is located at KD Market, Block D, Sector 18, Kavi Nagar, Ghaziabad. We deliver across all of Ghaziabad \u2014 from Indirapuram and Vaishali to Raj Nagar, Vasundhara, Crossing Republik, and every neighbourhood in between.</p>
                        <p>Whether it is a last-minute birthday bouquet, a romantic anniversary surprise, a farewell for a friend, or simply a bunch of flowers to brighten someone's day \u2014 we are here, open from 8 AM to 10 PM, every single day.</p>
                        <p>Bouquets start at \u20B9200. Orders are placed on WhatsApp \u2014 simple, fast, and personal.</p>
                        
                        <div class="mt-4" style="border-top: 1px solid #eee; padding-top: 16px;">
                            <p>\u{1F4CD} KD Market, Block D, Sector 18, Kavi Nagar, Ghaziabad \u2013 201002</p>
                            <p>\u{1F4DE} +91 9810244455</p>
                            <p>\u{1F4AC} WhatsApp: <a href="https://wa.me/917289996804?text=Hi%2C%20I%20want%20to%20order%20a%20bouquet%20from%20Rose%20n%20Petals.%20Please%20help%20me." target="_blank">+91 7289996804</a></p>
                            <p>\u{1F4F8} <a href="https://www.instagram.com/_rosenpetals_" target="_blank">@_rosenpetals_</a></p>
                        </div>
                    </div>
                </div>
            </section>
            
            <!-- FAQ Section -->
            <section class="section">
                <div class="container">
                    <h2 class="section-title">Frequently Asked Questions</h2>
                    <div class="faq-accordion" style="max-width: 800px; margin: 0 auto;">
                        <details>
                            <summary>Do you deliver flowers to all areas of Ghaziabad?</summary>
                            <div class="faq-answer">Yes. Rose n Petals delivers across all of Ghaziabad including Kavi Nagar, Raj Nagar, Indirapuram, Vaishali, Vasundhara, Mohan Nagar, Vijay Nagar, Crossing Republik and surrounding areas.</div>
                        </details>
                        <details>
                            <summary>How long does delivery take?</summary>
                            <div class="faq-answer">We deliver in under 1 hour of order confirmation. Same-day delivery is available for orders placed before 9 PM.</div>
                        </details>
                        <details>
                            <summary>What is the minimum order price?</summary>
                            <div class="faq-answer">Bouquets start from \u20B9200. We have options for every budget including premium arrangements.</div>
                        </details>
                        <details>
                            <summary>How do I place an order?</summary>
                            <div class="faq-answer">WhatsApp us at +91 7289996804. No app download, no complicated form. Just message us your bouquet choice, delivery address, and preferred time.</div>
                        </details>
                        <details>
                            <summary>Do you accept Cash on Delivery?</summary>
                            <div class="faq-answer">No. We accept UPI and Bank Transfer only. Payment is made after order confirmation on WhatsApp.</div>
                        </details>
                        <details>
                            <summary>Can I get a custom bouquet?</summary>
                            <div class="faq-answer">Yes. WhatsApp us with your idea \u2014 flowers, colours, budget, occasion \u2014 and we will create it for you starting from \u20B9200.</div>
                        </details>
                        <details>
                            <summary>What are your shop hours?</summary>
                            <div class="faq-answer">We are open every day from 8 AM to 10 PM. WhatsApp orders are accepted during shop hours.</div>
                        </details>
                        <details>
                            <summary>How quickly do you respond on WhatsApp?</summary>
                            <div class="faq-answer">We respond within 15\u201330 minutes during shop hours. For urgent orders write URGENT in your first message and we will prioritise your order immediately.</div>
                        </details>
                    </div>
                </div>
            </section>
        `;a.innerHTML=d,this.setupChipListeners("/catalog?filter=")},renderCatalogPage(a,r){document.title="Catalog - Rose n Petals";let e=decodeURIComponent(r),t=["All",...Store.getAllOccasionTags(),"Under \u20B9499"],i=Store.getProductsByOccasion(e),d=`
            <div class="page-header section-light">
                <div class="container">
                    <h1 class="mb-2">Our Bouquets</h1>
                    <p class="text-muted">Fresh, hand-arranged flowers for every moment.</p>
                </div>
            </div>
            
            <section class="section container">
                <!-- Filters -->
                <div class="mb-4">
                    ${Components.createFilterChips(t,e)}
                </div>
                
                <!-- Grid -->
                <div class="product-grid">
                    ${i.length>0?i.map((n,l)=>Components.createProductCard(n,l)).join(""):'<div class="empty-state"><p>No bouquets found for this occasion. Please try another filter.</p></div>'}
                </div>
                
                <!-- Custom Bouquet Banner -->
                ${Components.createCustomBouquetBanner()}
            </section>
        `;a.innerHTML=d,this.setupChipListeners("/catalog?filter=")},renderBouquetDetailPage(a,r){let e=decodeURIComponent(r),t=Store.getProductBySlug(e);if(!t){a.innerHTML='<div class="container section"><h2 class="text-center">Bouquet not found</h2><div class="text-center"><a href="/catalog" class="btn btn-primary mt-4">Back to Catalog</a></div></div>';return}document.title=`${t.name} - Rose n Petals`;let i=Store.getAllProducts().filter(u=>u.id!==t.id&&u.occasion_tags.some(o=>t.occasion_tags.includes(o))).slice(0,4);if(i.length<4){let u=Store.getAllProducts().filter(o=>o.id!==t.id&&!i.find(p=>p.id===o.id));i.push(...u.slice(0,4-i.length))}let d=t.occasion_tags.map(u=>`<span class="badge detail-badge">${u}</span>`).join(""),l=`
            <!-- Product Detail Section -->
            <section class="section container detail-section">
                <div class="detail-grid">
                    <div class="detail-image-wrapper">
                        ${t.image_url?`<img src="${t.image_url}" alt="${t.name}" class="detail-image">`:'<div class="detail-image placeholder-image"><span>Image coming soon</span></div>'}
                    </div>
                    <div class="detail-info">
                        <div class="detail-tags mb-2">${d}</div>
                        <h1 class="detail-title">${t.name}</h1>
                        <p class="detail-price mt-2 mb-4">\u20B9${t.price}</p>
                        
                        <div class="detail-desc mb-4">
                            <p>${t.short_description}</p>
                        </div>
                        
                        <div class="local-promise-box mb-4">
                            <h4>\u{1F6E1}\uFE0F Local Promise</h4>
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
                            onclick="window.CartUI.addItem('${t.id}')">
                            + Add to Cart
                          </button>
                        </div>

                        <!-- Embedded Order Form -->
                        <div id="inline-order-form">
                            ${Components.createOrderForm(t)}
                        </div>
                    </div>
                </div>
            </section>
            
            <!-- Related Bouquets -->
            ${i.length>0?`
            <section class="section section-light">
                <div class="container">
                    <h2 class="section-title">You might also like</h2>
                    <div class="product-grid">
                        ${i.map(u=>Components.createProductCard(u)).join("")}
                    </div>
                </div>
            </section>
            `:""}
            
            <!-- Sticky Mobile CTA -->
            <div class="mobile-sticky-cta">
                <div class="sticky-price-row">
                    <span>Total:</span>
                    <strong>\u20B9${t.price}</strong>
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
                    onclick="window.CartUI.addItem('${t.id}')">
                    + Add to Cart
                  </button>
                </div>
            </div>
        `;a.innerHTML=l,WhatsApp.initFormListener()},setupChipListeners(a){document.querySelectorAll(".filter-chip").forEach(r=>{r.addEventListener("click",e=>{let t=e.target.getAttribute("data-filter"),i=a+encodeURIComponent(t);window.history.pushState(null,"",i),App.handleRouting()})})},renderFlowerDeliveryGhaziabad(a){document.title="Flower Delivery in Ghaziabad | Rose n Petals",a.innerHTML=`
            <section class="section container">
                <div class="section-title">
                    <h1>Fresh Flower Delivery in Ghaziabad \u2013 Starting \u20B9200</h1>
                    <p class="text-muted">
                        Handmade bouquets with same-day delivery across Ghaziabad.
                        Order in 2 minutes on WhatsApp.
                    </p>
                    <a
                      href="https://api.whatsapp.com/send?phone=917289996804&text=${encodeURIComponent("Hi, I want to order a bouquet for delivery in Ghaziabad.")}"
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
                    <li><strong>Same\u2011day delivery</strong><br/>Order before 6 PM for same\u2011day delivery in most parts of Ghaziabad.</li>
                    <li><strong>Starting at \u20B9200</strong><br/>Options for every budget and occasion.</li>
                    <li><strong>Easy WhatsApp ordering</strong><br/>No complex checkout \u2013 just message and confirm.</li>
                </ul>
            </section>

            <section class="section section-light">
                <div class="container">
                    <h2 class="section-title">Areas we deliver in Ghaziabad</h2>
                    <p class="text-muted">
                        We currently cover these areas for regular and same\u2011day deliveries:
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
                        <strong>Step 1 \u2013 Choose a bouquet</strong><br/>
                        Browse our catalog or ask us for suggestions on WhatsApp.
                    </li>
                    <li>
                        <strong>Step 2 \u2013 Send details</strong><br/>
                        Share bouquet name, delivery address, date, time and message card text.
                    </li>
                    <li>
                        <strong>Step 3 \u2013 We deliver</strong><br/>
                        We confirm on WhatsApp and deliver your bouquet fresh in Ghaziabad.
                    </li>
                </ol>
            </section>

            <section class="section container">
                <h2 class="section-title">Frequently asked questions</h2>
                <details>
                    <summary>Do you offer same\u2011day flower delivery in Ghaziabad?</summary>
                    <p>Yes, for most areas we offer same\u2011day delivery if you place the order before 6 PM.</p>
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
                    <p>We currently accept UPI and bank transfer. No cash\u2011on\u2011delivery at the moment.</p>
                </details>
            </section>

            <section class="section section-light">
                <div class="container section-title">
                    <h2>Ready to order flowers in Ghaziabad?</h2>
                    <p class="text-muted">
                        Tap the button below to chat with us on WhatsApp and confirm your bouquet.
                    </p>
                    <a
                      href="https://api.whatsapp.com/send?phone=917289996804&text=${encodeURIComponent("Hi, I want to order a bouquet for delivery in Ghaziabad.")}"
                      target="_blank"
                      class="btn btn-primary btn-lg mt-3"
                    >
                      Order on WhatsApp
                    </a>
                </div>
            </section>
        `}};function x(){if(window.INITIAL_PAGE){var a=window.INITIAL_PAGE;return window.INITIAL_PAGE=null,"/"+a}var r=window.location.pathname,e=window.location.search;return r+(e||"")}function S(a){let r="https://rosenpetals.com",e=a==="/"||a===""?r:r+"/"+a.replace(/^\//,""),t=document.querySelector('link[rel="canonical"]');t||(t=document.createElement("link"),t.rel="canonical",document.head.appendChild(t)),t.href=e}var q={init(){this.initMobileMenu();let a=document.querySelector(".logo");if(a){let r=0,e=null;a.addEventListener("click",t=>{r++,r===3&&(t.preventDefault(),window.location.href="/admin/login"),clearTimeout(e),e=setTimeout(()=>{r=0},2e3)})}window.addEventListener("popstate",function(){q.handleRouting()}),document.body.addEventListener("click",r=>{let e=r.target.closest("a");if(!e)return;let t=e.getAttribute("href");t&&(e.getAttribute("target")==="_blank"||t.startsWith("http")||t.startsWith("tel:")||t.startsWith("mailto:")||t.startsWith("#")||t.endsWith(".xml")||e.origin&&e.origin!==window.location.origin||t.startsWith("/")&&(r.preventDefault(),window.history.pushState(null,"",t),q.handleRouting()))}),this.loadDataAndStart(),this.checkPromoPopup()},checkPromoPopup(){if(window.location.href.includes("promo=QR")){document.body.insertAdjacentHTML("beforeend",`
                <div class="voucher-overlay" id="voucherPopup">
                    <div class="voucher-card">
                        <div class="voucher-title">Thanks for visiting our shop! \u{1F338}</div>
                        <div class="voucher-subtitle">Here is \u20B950 OFF your first online order.</div>
                        <div class="voucher-code-box">ROSE50</div>
                        <button class="btn btn-primary btn-block btn-lg" id="voucherCopyBtn">Copy Code & Browse Bouquets</button>
                    </div>
                </div>
            `);let r=document.getElementById("voucherPopup"),e=document.getElementById("voucherCopyBtn");setTimeout(()=>{r.classList.add("show")},100),e.addEventListener("click",()=>{navigator.clipboard.writeText("ROSE50").then(()=>{e.textContent="Copied! Taking you to shop...",window.confetti&&confetti({particleCount:100,spread:70,origin:{y:.6}}),setTimeout(()=>{r.classList.remove("show"),window.location.href="/catalog",setTimeout(()=>{r.remove()},400)},1500)}).catch(t=>{console.error("Could not copy text: ",t)})})}},initMobileMenu(){let a=document.getElementById("mobile-menu-toggle"),r=document.getElementById("main-nav");a&&r&&(a.addEventListener("click",()=>{r.classList.toggle("is-open")}),r.querySelectorAll(".nav-link").forEach(t=>{t.addEventListener("click",()=>{r.classList.remove("is-open")})}));let e=document.getElementById("current-year");e&&(e.textContent=new Date().getFullYear())},async loadDataAndStart(){let a=document.getElementById("app");document.getElementById("ssr-marker")||(a.innerHTML=`<div class="loader-container">
                <div class="spinner"></div>
                <p>Loading fresh bouquets...</p>
            </div>`);try{await window.Store.fetchProducts(),this.handleRouting(),window.CartUI&&window.CartUI.init()}catch(e){console.error("Failed to load data",e),this.handleRouting(),window.CartUI&&window.CartUI.init()}},handleRouting(){let a=x(),r=new URLSearchParams(window.location.search),e=a.split("?")[0],t=e.replace(/^\//,""),i=document.getElementById("app"),d=document.getElementById("ssr-marker");d?d.remove():i.innerHTML="";let n=r.get("scrollTo");if(n||window.scrollTo(0,0),document.querySelectorAll(".nav-link").forEach(l=>{l.classList.remove("active"),(l.getAttribute("href")===a||l.getAttribute("href").split("?")[0]===e)&&l.classList.add("active")}),e==="/"||e==="")S("/"),window.Pages.renderHomePage(i),n&&setTimeout(()=>{let l=document.getElementById(n);l&&l.scrollIntoView({behavior:"smooth"})},100);else if(e==="/catalog"){S("/catalog");let l=r.get("filter")||"All";window.Pages.renderCatalogPage(i,l)}else if(e.startsWith("/bouquet/")){let l=e.replace("/bouquet/","");S("/bouquet/"+l),window.Pages.renderBouquetDetailPage(i,l)}else{let l=e.replace(/^\//,"");S("/"+l),window.CoreServiceRoutes&&window.CoreServiceRoutes.isCorePage(l)?window.CoreServiceRoutes.render(i,l):window.UrgencyServiceRoutes&&window.UrgencyServiceRoutes.isUrgencyPage(l)?window.UrgencyServiceRoutes.render(i,l):window.OccasionRoutes&&window.OccasionRoutes.isOccasionPage(l)?window.OccasionRoutes.render(i,l):window.LocalAreaRoutes&&window.LocalAreaRoutes.isLocalAreaPage(l)?window.LocalAreaRoutes.render(i,l):i.innerHTML=`<div class="container section"><div class="section-title">
                    <h2>Page Not Found</h2>
                    <a href="/" class="btn btn-primary">Go Home</a>
                </div></div>`}}};document.addEventListener("DOMContentLoaded",()=>{q.init()});})();
