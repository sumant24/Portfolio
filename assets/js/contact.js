/**
 * contact.js — Client-side email sending via EmailJS
 *
 * Mirrors the same logic as app.py:
 *   • Validates name, email, message (required)
 *   • Sends via your Gmail SMTP relay through EmailJS
 *   • Updates the #message output span with success / error state
 *
 * SETUP (one-time, free):
 *   1. Sign up at https://www.emailjs.com/
 *   2. Add Email Service → Gmail → connect sumantjoshi24@gmail.com
 *      Note your SERVICE_ID (e.g. "service_xxxxxxx")
 *   3. Create an Email Template with variables:
 *        {{from_name}}, {{from_email}}, {{subject}}, {{message}}
 *      Note your TEMPLATE_ID (e.g. "template_xxxxxxx")
 *   4. Copy your Public Key from Account → API Keys
 *      Note your PUBLIC_KEY (e.g. "xxxxxxxxxxxxxxxxxxxxxx")
 *   5. Replace the three placeholders below with your actual values.
 */

(function () {

    /* ── EmailJS credentials ─────────────────────────────────── */
    var EMAILJS_SERVICE_ID = 'service_zwred1p';   // e.g. 'service_abc123'
    var EMAILJS_TEMPLATE_ID = 'template_kkngj1o';  // e.g. 'template_xyz789'
    var EMAILJS_PUBLIC_KEY = 'ocCyaWL4oLHC575gj';   // e.g. 'abcDEFghiJKL12345678'
    /* ─────────────────────────────────────────────────────────── */

    var MAX_MESSAGE_CHARS = 2000; // Gmail SMTP safe body limit for contact forms

    /* Initialise EmailJS with the public key */
    emailjs.init(EMAILJS_PUBLIC_KEY);

    /* ── Character counter for textarea ────────────────────────── */
    var textarea = document.getElementById('contact-message');
    var counter = document.getElementById('msg-char-counter');

    if (textarea && counter) {
        textarea.setAttribute('maxlength', MAX_MESSAGE_CHARS);

        textarea.addEventListener('input', function () {
            var used = textarea.value.length;
            var remaining = MAX_MESSAGE_CHARS - used;
            counter.textContent = remaining + ' / ' + MAX_MESSAGE_CHARS + ' characters remaining';
            counter.style.color = remaining < 200 ? '#e05252' : '#888';
        });

        /* Trigger on load to initialise display */
        textarea.dispatchEvent(new Event('input'));
    }

    /* ── Form submit handler ────────────────────────────────────── */
    var form = document.getElementById('contactform');
    var msgSpan = document.getElementById('message');

    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        /* ── Collect values (mirrors app.py field names) ── */
        var name = (form.querySelector('[name="name"]').value || '').trim();
        var email = (form.querySelector('[name="email"]').value || '').trim();
        var subject = (form.querySelector('[name="subject"]').value || '').trim();
        var message = (form.querySelector('[name="message"]').value || '').trim();

        /* ── Validation: same rules as app.py ── */
        if (!name || !email || !message) {
            setStatus('error', 'Please fill in Name, Email and Message.');
            return;
        }

        var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRe.test(email)) {
            setStatus('error', 'Please enter a valid email address.');
            return;
        }

        setStatus('', 'Sending…');

        /* ── EmailJS templateParams — mirrors app.py body_content ── */
        var now = new Date();
        var timeStr = now.toLocaleString('en-IN', {
            weekday: 'long', year: 'numeric', month: 'long',
            day: 'numeric', hour: '2-digit', minute: '2-digit',
            timeZone: 'Asia/Kolkata'
        }) + ' IST';

        var templateParams = {
            from_name: name,
            from_email: email,
            subject: subject || 'New Message',
            message: message,
            time: timeStr
        };

        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
            .then(function () {
                setStatus('success', 'Message Sent!');
                form.reset();
                if (textarea && counter) textarea.dispatchEvent(new Event('input'));
            })
            .catch(function (err) {
                console.error('EmailJS error:', err);
                setStatus('error', 'Error Sending! Please try again.');
            });
    });

    /* Helper: update the output_message span */
    function setStatus(type, text) {
        if (!msgSpan) return;
        msgSpan.classList.remove('success', 'error');
        if (type) msgSpan.classList.add(type);
        msgSpan.textContent = text;
    }

})();
