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

    /* ── Form elements and validation ──────────────────────────── */
    var form = document.getElementById('contactform');
    var msgSpan = document.getElementById('message');

    if (!form) return;

    var nameInput = form.querySelector('[name="name"]');
    var emailInput = form.querySelector('[name="email"]');
    var subjectInput = form.querySelector('[name="subject"]');
    var messageInput = form.querySelector('[name="message"]');
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function validateField(input) {
        if (!input) return true;
        var val = input.value.trim();
        var isValid = true;

        if (input.name === 'name' || input.name === 'message') {
            isValid = val.length > 0;
        } else if (input.name === 'email') {
            isValid = emailRe.test(val);
        }

        if (isValid) {
            input.classList.remove('field-error');
        } else {
            input.classList.add('field-error');
        }
        return isValid;
    }

    /* Clear validation errors dynamically on typing */
    var inputsToValidate = [nameInput, emailInput, messageInput];
    for (var i = 0; i < inputsToValidate.length; i++) {
        (function (input) {
            if (!input) return;
            input.addEventListener('input', function () {
                if (input.classList.contains('field-error')) {
                    validateField(input);
                    // Clear the general error message if all fields are valid now
                    var hasErrors = false;
                    for (var j = 0; j < inputsToValidate.length; j++) {
                        if (inputsToValidate[j] && inputsToValidate[j].classList.contains('field-error')) {
                            hasErrors = true;
                            break;
                        }
                    }
                    if (!hasErrors) {
                        setStatus('', '');
                    }
                }
            });
        })(inputsToValidate[i]);
    }

    /* ── Form submit handler ────────────────────────────────────── */
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Run validation
        var isNameValid = validateField(nameInput);
        var isEmailValid = validateField(emailInput);
        var isMessageValid = validateField(messageInput);

        if (!isNameValid || !isEmailValid || !isMessageValid) {
            var errMsg = 'Please fill in all required fields correctly.';
            if (nameInput && !nameInput.value.trim()) {
                errMsg = 'Name is required.';
            } else if (emailInput && !emailInput.value.trim()) {
                errMsg = 'Email is required.';
            } else if (emailInput && !emailRe.test(emailInput.value.trim())) {
                errMsg = 'Please enter a valid email address.';
            } else if (messageInput && !messageInput.value.trim()) {
                errMsg = 'Message is required.';
            }
            setStatus('error', errMsg);

            // Focus the first invalid field
            var firstErr = form.querySelector('.field-error');
            if (firstErr) firstErr.focus();
            return;
        }

        // Validation passed: prepare loader & disable button
        var submitBtn = form.querySelector('button[type="submit"]');
        var btnText = submitBtn ? submitBtn.querySelector('span:first-child') : null;
        var btnIcon = submitBtn ? submitBtn.querySelector('.fa') : null;

        var originalText = btnText ? btnText.textContent : 'send message';

        if (submitBtn) submitBtn.disabled = true;
        if (btnText) btnText.textContent = 'Sending...';
        if (btnIcon) {
            btnIcon.classList.remove('fa-thumbs-o-up');
            btnIcon.classList.add('fa-spinner', 'fa-spin');
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
            from_name: nameInput.value.trim(),
            from_email: emailInput.value.trim(),
            subject: subjectInput.value.trim() || 'New Message',
            message: messageInput.value.trim(),
            time: timeStr
        };

        function restoreButton() {
            if (submitBtn) submitBtn.disabled = false;
            if (btnText) btnText.textContent = originalText;
            if (btnIcon) {
                btnIcon.classList.remove('fa-spinner', 'fa-spin');
                btnIcon.classList.add('fa-thumbs-o-up');
            }
        }

        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
            .then(function () {
                setStatus('success', 'Message Sent!');
                form.reset();
                if (textarea && counter) textarea.dispatchEvent(new Event('input'));
                restoreButton();
            })
            .catch(function (err) {
                console.error('EmailJS error:', err);
                setStatus('error', 'Error Sending! Please try again.');
                restoreButton();
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
