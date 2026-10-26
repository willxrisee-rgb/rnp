/**
 * firebase-auth.js — Shared Firebase Auth utilities for Rose n Petals
 * 
 * Import this module from any page that needs to check authentication state,
 * show/hide login buttons, or access the current user's profile.
 *
 * Usage (in a <script type="module">):
 *   import { getCurrentUser, signOutUser, onUserChanged } from '/js/firebase-auth.js';
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithRedirect, getRedirectResult } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

// ──────────────────────────────────────────────────────
//  🔑 FIREBASE CONFIG — Synchronized with login.html & profile.html
// ──────────────────────────────────────────────────────
const firebaseConfig = {
    apiKey: "AIzaSyCp9WS-KaYKUnK9LF3YGD4jwZM4T8JlIFY",
    authDomain: "rose-n-petals-az3b9.firebaseapp.com",
    projectId: "rose-n-petals-az3b9",
    storageBucket: "rose-n-petals-az3b9.firebasestorage.app",
    messagingSenderId: "477080539500",
    appId: "1:477080539500:web:040a0bc0df26f0c7666349"
};

// Singleton Firebase instances
let _app, _auth, _db;

function getFirebaseApp() {
    if (!_app) {
        _app = initializeApp(firebaseConfig);
    }
    return _app;
}

function getFirebaseAuth() {
    if (!_auth) {
        _auth = getAuth(getFirebaseApp());
    }
    return _auth;
}

function getFirebaseDB() {
    if (!_db) {
        _db = getFirestore(getFirebaseApp());
    }
    return _db;
}

/**
 * Returns a Promise that resolves with the current Firebase user (or null).
 * Waits for the initial auth state to be determined.
 */
export function getCurrentUser() {
    return new Promise((resolve) => {
        const auth = getFirebaseAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe();
            resolve(user);
        });
    });
}

/**
 * Listen for auth state changes. Calls `callback(user)` whenever
 * the user signs in or out.
 * @param {function} callback - Receives the Firebase user object or null.
 * @returns {function} Unsubscribe function.
 */
export function onUserChanged(callback) {
    const auth = getFirebaseAuth();
    return onAuthStateChanged(auth, callback);
}

/**
 * Get the user's profile data from Firestore (the 'Users' collection).
 * Returns null if the user is not logged in or profile doesn't exist.
 * @returns {Promise<object|null>}
 */
export async function getUserProfile() {
    const user = await getCurrentUser();
    if (!user) return null;

    try {
        const db = getFirebaseDB();
        const userRef = doc(db, "Users", user.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
            return { uid: user.uid, ...snap.data() };
        }
        return null;
    } catch (err) {
        console.error("[RNP Auth] Failed to fetch user profile:", err);
        return null;
    }
}

/**
 * Sign the current user out and optionally redirect.
 * @param {string} [redirectTo] - URL to redirect to after sign-out.
 */
export async function signOutUser(redirectTo) {
    try {
        const auth = getFirebaseAuth();
        await signOut(auth);
        if (redirectTo) {
            window.location.href = redirectTo;
        }
    } catch (err) {
        console.error("[RNP Auth] Sign-out error:", err);
    }
}

/**
 * Check if the user is fully registered (has WhatsApp number saved).
 * @returns {Promise<boolean>}
 */
export async function isUserRegistered() {
    const profile = await getUserProfile();
    return !!(profile && profile.whatsapp);
}

/**
 * Redirect to login page if user is not authenticated.
 * Useful for protecting pages that require login.
 * @param {string} [loginUrl='/login.html'] - The login page URL.
 */
export async function requireAuth(loginUrl = '/login.html') {
    const user = await getCurrentUser();
    if (!user) {
        window.location.href = loginUrl;
        return null;
    }
    return user;
}

// ──────────────────────────────────────────────────────
//  📍 GHAZIABAD ALLOWED PINCODES (10km Delivery Radius)
// ──────────────────────────────────────────────────────
export const ALLOWED_PINCODES = [
    '201001', // Ghaziabad City, Navyug Market, G.T. Road, Model Town
    '201002', // Kavi Nagar (Shop location), Shastri Nagar, Sector 18 KD Market
    '201003', // Industrial Area, Rajendra Nagar
    '201005', // Sahibabad Industrial Area
    '201009', // Vijay Nagar, Crossings Republik
    '201010', // Vaishali, Kaushambi
    '201013', // Vasundhara Sector 1-9
    '201014', // Indirapuram (Vaibhav Khand, Ahinsa Khand, Nyay Khand)
    '201017'  // Govindpuram
];

/**
 * Validates whether a pincode is within the allowed 10km Ghaziabad delivery radius.
 * @param {string|number} pincode
 * @returns {boolean}
 */
export function isAllowedPincode(pincode) {
    if (!pincode) return false;
    const clean = String(pincode).trim();
    return ALLOWED_PINCODES.includes(clean);
}

// ──────────────────────────────────────────────────────
//  📦 FIRESTORE ORDER SUBMISSION
// ──────────────────────────────────────────────────────
/**
 * Saves a new customer order into the 'Orders' collection in Firestore.
 * @param {object} orderData - Order fields
 * @returns {Promise<object>} Saved order with Firestore document ID
 */
export async function saveOrderToFirestore(orderData) {
    try {
        const db = getFirebaseDB();
        const docPayload = {
            ...orderData,
            status: 'PENDING_SHOP_APPROVAL',
            createdAt: serverTimestamp()
        };

        const ordersCol = collection(db, "Orders");
        const docRef = await addDoc(ordersCol, docPayload);

        return {
            id: docRef.id,
            ...docPayload
        };
    } catch (err) {
        console.error("[RNP Auth] Failed to save order to Firestore:", err);
        throw err;
    }
}

/**
 * Updates the user's document in the 'Users' collection with their saved default address.
 * @param {string} userId - User UID
 * @param {object} addressData - { deliveryAddress, deliveryPincode }
 * @returns {Promise<void>}
 */
export async function saveUserAddress(userId, { deliveryAddress, deliveryPincode }) {
    if (!userId) return;
    try {
        const db = getFirebaseDB();
        const userRef = doc(db, "Users", userId);
        await setDoc(userRef, {
            deliveryAddress: deliveryAddress || '',
            deliveryPincode: deliveryPincode || '',
            updatedAt: serverTimestamp()
        }, { merge: true });
    } catch (err) {
        console.error("[RNP Auth] Failed to save default user address:", err);
    }
}

/**
 * Initiates Google Sign-In with redirect (mobile-friendly, bypasses popup blockers).
 * @param {string} [redirectUrl] - Target URL to return to after sign-in.
 */
export async function signInWithGoogle(redirectUrl) {
    try {
        const auth = getFirebaseAuth();
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });

        const returnUrl = redirectUrl || (window.location.pathname + window.location.search);
        try {
            sessionStorage.setItem('rnp_auth_redirect', returnUrl);
        } catch (e) {}

        await signInWithRedirect(auth, provider);
    } catch (error) {
        console.error("[RNP Auth] signInWithRedirect error:", error);
        alert(`Login Error: ${error.code} - ${error.message}`);
        throw error;
    }
}

// ──────────────────────────────────────────────────────
//  🔔 BRANDED LOGIN POP-UP MODAL (Intercept Unauthenticated Checkout)
// ──────────────────────────────────────────────────────
/**
 * Shows a branded modal prompting the customer to log in before placing an order.
 * @param {object} [options]
 * @param {string} [options.redirectUrl] - URL to redirect to after successful login
 * @param {string} [options.title] - Custom modal title
 * @param {string} [options.message] - Custom modal message
 * @param {string} [options.buttonText] - Custom button text
 */
export function showLoginModal(options = {}) {
    const redirectUrl = options.redirectUrl || window.location.pathname + window.location.search;
    const title = options.title || "Almost there!";
    const message = options.message || "Please log in to place and track your order.";
    const buttonText = options.buttonText || "Log In with Google";

    let overlay = document.getElementById('rnp-login-modal-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'rnp-login-modal-overlay';
        overlay.className = 'rnp-modal-overlay';
        document.body.appendChild(overlay);
    }

    const loginUrl = `/login.html?redirect=${encodeURIComponent(redirectUrl)}`;

    overlay.innerHTML = `
        <div class="rnp-modal-card" role="dialog" aria-modal="true" aria-labelledby="rnp-modal-title">
            <button class="rnp-modal-close" id="rnp-modal-close-btn" aria-label="Close modal">&times;</button>
            <div class="rnp-modal-badge">
                <span class="rnp-badge-icon">🌹</span>
            </div>
            <h2 id="rnp-modal-title" class="rnp-modal-title">${title}</h2>
            <p class="rnp-modal-subtitle">${message}</p>
            
            <div class="rnp-modal-perks">
                <div class="rnp-perk-item">
                    <span class="rnp-perk-icon">⚡</span>
                    <span>1-click checkout with saved delivery details</span>
                </div>
                <div class="rnp-perk-item">
                    <span class="rnp-perk-icon">💬</span>
                    <span>Instant confirmation on WhatsApp in &lt;10 mins</span>
                </div>
                <div class="rnp-perk-item">
                    <span class="rnp-perk-icon">🚚</span>
                    <span>Direct tracking from a Rose n Petals store</span>
                </div>
            </div>

            <div class="rnp-modal-actions">
                <a href="${loginUrl}" class="rnp-btn-google-login" id="rnp-modal-login-btn">
                    <svg class="rnp-google-icon" viewBox="0 0 24 24" width="20" height="20">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span>${buttonText}</span>
                </a>
                <button type="button" class="rnp-btn-continue-browsing" id="rnp-modal-dismiss-btn">
                    Continue Browsing
                </button>
            </div>
            <p class="rnp-modal-privacy">
                🔒 Safe & secure. Browsing bouquets is always 100% free.
            </p>
        </div>
    `;

    // Display
    requestAnimationFrame(() => {
        overlay.classList.add('rnp-modal-active');
    });

    // Close handlers
    const closeBtn = document.getElementById('rnp-modal-close-btn');
    const dismissBtn = document.getElementById('rnp-modal-dismiss-btn');
    if (closeBtn) closeBtn.onclick = closeLoginModal;
    if (dismissBtn) dismissBtn.onclick = closeLoginModal;

    overlay.onclick = (e) => {
        if (e.target === overlay) closeLoginModal();
    };

    const escHandler = (e) => {
        if (e.key === 'Escape') {
            closeLoginModal();
            window.removeEventListener('keydown', escHandler);
        }
    };
    window.addEventListener('keydown', escHandler);
}

/**
 * Closes the login interception modal.
 */
export function closeLoginModal() {
    const overlay = document.getElementById('rnp-login-modal-overlay');
    if (overlay) {
        overlay.classList.remove('rnp-modal-active');
        setTimeout(() => {
            if (overlay.parentNode && !overlay.classList.contains('rnp-modal-active')) {
                overlay.parentNode.removeChild(overlay);
            }
        }, 250);
    }
}

// ──────────────────────────────────────────────────────
//  🌐 GLOBAL EXPOSURE (Works with non-module scripts / bundle)
// ──────────────────────────────────────────────────────
window.RNPAuth = {
    getCurrentUser,
    getUserProfile,
    saveUserAddress,
    signOutUser,
    signInWithGoogle,
    isUserRegistered,
    requireAuth,
    onUserChanged,
    ALLOWED_PINCODES,
    isAllowedPincode,
    saveOrderToFirestore,
    showLoginModal,
    closeLoginModal,
    updateNavbarAuthUI
};

// Dispatch event notifying modules that RNPAuth is initialized
window.dispatchEvent(new CustomEvent('RNPAuthReady', { detail: window.RNPAuth }));

// Automatically sync navbar Sign In / My Profile button with active session
export function updateNavbarAuthUI(user) {
    const navItem = document.getElementById('nav-auth-item');
    if (!navItem) return;
    if (user) {
        navItem.innerHTML = `<a href="/profile.html" class="nav-link nav-auth-link logged-in" id="nav-profile-link"><span class="nav-auth-icon">👤</span> My Profile</a>`;
    } else {
        navItem.innerHTML = `<a href="/login.html" class="nav-link nav-auth-link" id="nav-login-link">Sign In</a>`;
    }
}

// Wait for getCurrentUser() Promise to resolve on initial load so navbar does not flash logged-out
getCurrentUser().then((user) => {
    updateNavbarAuthUI(user);
});

// Also keep listening for ongoing auth changes (sign in, sign out)
onAuthStateChanged(getFirebaseAuth(), (user) => {
    updateNavbarAuthUI(user);
});

// Catch redirect result on non-login pages (e.g. returning directly to catalog/bouquet)
if (typeof window !== 'undefined' && !window.location.pathname.includes('login.html')) {
    const auth = getFirebaseAuth();
    getRedirectResult(auth)
        .then(async (result) => {
            if (result && result.user) {
                const user = result.user;
                try {
                    const profile = await getUserProfile();
                    let targetUrl = sessionStorage.getItem('rnp_auth_redirect') || (window.location.pathname + window.location.search);
                    sessionStorage.removeItem('rnp_auth_redirect');

                    if (!profile || !profile.whatsapp) {
                        // User needs to save WhatsApp number on login.html
                        window.location.href = `/login.html?redirect=${encodeURIComponent(targetUrl)}`;
                    } else {
                        updateNavbarAuthUI(user);
                        if (targetUrl && targetUrl !== window.location.pathname && targetUrl !== '/') {
                            window.location.href = targetUrl;
                        }
                    }
                } catch (err) {
                    console.error("[RNP Auth] Profile check after redirect error:", err);
                    alert(`Login Error: ${err.code || 'unknown'} - ${err.message || err}`);
                }
            }
        })
        .catch((error) => {
            console.error("[RNP Auth] getRedirectResult error:", error);
            alert(`Login Error: ${error.code} - ${error.message}`);
        });
}

