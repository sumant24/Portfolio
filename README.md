# Sumant Joshi — Portfolio

A fully responsive, client-side portfolio website deployable directly on **GitHub Pages**.

## Features & Features Layout
- **Consolidated Hero Video Player**: Displays a high-fidelity video greeting (`assets/img/hero-video.mp4`) that:
  - Functions as a fixed sidebar on desktop devices.
  - Transforms into a circular profile avatar on mobile/tablet devices.
  - Implements browser-compliant autoplay (muted fallback) and unmutes on the first user tap/interaction.
  - Includes a custom floating "Tap for Sound" overlay button for a smooth unmuting call-to-action.
- **Dynamic Facts Grid**: Displays high-level achievements (Years of Experience, Completed Projects, Happy Customers) in a balanced, fully responsive 3-column layout.
- **Client-side Contact Form**: Integrates directly with EmailJS to deliver contact submissions to Gmail without any server-side database.

## Tech Stack
- **Frontend**: HTML5, CSS3, JavaScript (jQuery)
- **Video Processing**: FFmpeg (used for lossless stream-copy concatenation of intro segments)
- **Email**: [EmailJS](https://www.emailjs.com/) — sends contact form emails directly via Gmail SMTP, no backend required

## Local Preview
Simply open `index.html` in your browser, or use any static file server:
```bash
npx serve .
# or
python3 -m http.server 8080
```

## Deployment (GitHub Pages)
1. Push this repository to GitHub
2. Go to **Settings → Pages → Source → main / root**
3. Your site will be live at `https://<username>.github.io/<repo>/`

## Contact Form Setup (EmailJS — one-time)
1. Sign up free at [emailjs.com](https://www.emailjs.com/)
2. Add Email Service → Gmail → connect `sumantjoshi24@gmail.com`
3. Create an Email Template using the HTML from `emailjs_template.html`
   - Variables used: `{{from_name}}`, `{{from_email}}`, `{{subject}}`, `{{message}}`, `{{time}}`
4. Open `assets/js/contact.js` and fill in your credentials:
   ```js
   var EMAILJS_SERVICE_ID  = 'service_xxxxxxx';
   var EMAILJS_TEMPLATE_ID = 'template_xxxxxxx';
   var EMAILJS_PUBLIC_KEY  = 'xxxxxxxxxxxxxxxx';
   ```