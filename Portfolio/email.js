// ==========================================
// EMAILJS CONFIGURATION
// ==========================================

// 1. Replace with your actual Public Key from EmailJS Account > General
const EMAILJS_PUBLIC_KEY = "0C0clP3lvREkU5Mv_";

// 2. Replace with your actual Service ID (Already filled based on your screenshot)
const EMAILJS_SERVICE_ID = "service_jkpgd5y";

// 3. Replace with your actual Template ID from EmailJS Email Templates
const EMAILJS_TEMPLATE_ID = "template_kjbx38t";

// Initialize EmailJS
(function() {
    if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
        emailjs.init({
          publicKey: EMAILJS_PUBLIC_KEY,
        });
    }
})();
