# ResumeForge — Premium Resume Builder

**ResumeForge** is a complete, production-ready, frontend-only resume/CV builder built with pure HTML5, CSS3, and Vanilla JavaScript. No frameworks, no backend, no accounts required.

Create professional resumes in minutes, customize templates, colors & fonts, reorder sections, upload a photo, save locally, export/import JSON, and download high-quality PDFs — all in your browser.

Your data never leaves your device.

---

## ✨ Features

- **10 Professional Templates**: Modern Professional, Minimal, Corporate, Creative, Elegant, Executive, Tech Developer, Student, Two Column, ATS Friendly
- **Live Real-time Preview** — changes appear instantly
- **Full Resume Sections**: Personal info, Summary, Experience, Education, Skills, Projects, Certifications, Languages, Awards, Volunteer, Publications, Interests, References, Achievements
- **Dynamic Add / Edit / Delete / Reorder** (drag & drop) for all entries
- **Customization**: Accent color, fonts, font size, spacing, one/two column layout, photo shape
- **Profile Photo** upload (stored as Base64 in localStorage)
- **Local Storage**: Auto-save, multiple resumes, save/load/delete/duplicate
- **JSON Export / Import**
- **PDF Download & Print** (A4, clean resume only, multi-page support)
- **Resume Quality Score** (frontend heuristic)
- **Dark / Light Mode** (editor only — resume stays printable)
- **Fully Responsive**: Mobile-first with sticky bottom nav (Edit / Preview / Templates / Settings)
- **Template Gallery** with filters
- **Toast Notifications**, smooth animations, accessibility, keyboard support
- **Privacy-first**: Everything stays on your device

---

## 📁 Project Structure

```
resume-builder/
├── index.html              # Dashboard / Home
├── templates.html          # Template gallery
├── builder.html            # Main resume editor + live preview
├── css/
│   ├── style.css           # Global styles, dashboard, shared
│   ├── builder.css         # Editor layout & components
│   ├── templates.css       # Template gallery
│   └── print.css           # Print / PDF styles
├── js/
│   ├── app.js              # Dashboard logic, resume list
│   ├── builder.js          # Main editor, forms, sections
│   ├── templates.js        # Template gallery logic
│   ├── preview.js          # Live preview rendering for all templates
│   ├── storage.js          # localStorage, import/export JSON
│   ├── pdf.js              # PDF generation & print helpers
│   └── utils.js            # Helpers, toasts, drag-drop, etc.
├── assets/
│   └── images/             # Optional icons / placeholders
└── README.md
```

---

## 🚀 How to Run Locally

1. Clone or download this repository.
2. Open `index.html` directly in any modern browser  
   **or** serve with a local static server:

```bash
# Python
python -m http.server 8080

# Node (if you have npx)
npx serve .
```

3. Navigate to `http://localhost:8080`

No build step, no dependencies to install.

---

## 🌐 Deploy to GitHub Pages

1. Push this repository to GitHub.
2. Go to **Settings → Pages**.
3. Source: Deploy from branch `main` (or `master`), folder `/ (root)`.
4. Your site will be live at `https://<username>.github.io/<repo-name>/`

---

## ⚡ Deploy to Vercel / Netlify

**Vercel**

```bash
npx vercel
```

Or connect the GitHub repo in the Vercel dashboard — zero configuration needed (static site).

**Netlify**

- Drag & drop the folder, or connect GitHub.
- Publish directory: root of the project.

---

## 📄 How PDF Generation Works

- **Print**: Uses a dedicated `@media print` stylesheet that hides all editor UI and shows only the clean resume. Triggered via `window.print()`.
- **Download PDF**: Uses the browser’s print-to-PDF capability combined with a temporary print-optimized view of the resume (A4 size, proper margins, multi-page). No external server is involved.
- The generated PDF contains **only the resume content** — no buttons, navigation, or dashboard chrome.
- Text remains selectable where the browser supports it.

---

## 🔒 Privacy

> Your resume stays on your device. Resume data is stored locally in your browser (localStorage) and is **never** uploaded to any server.

No analytics, no tracking, no accounts.

---

## 🛠 Tech Stack

- HTML5 (semantic)
- CSS3 (custom properties, Flexbox, Grid, animations)
- Vanilla JavaScript (ES6+)
- localStorage + FileReader (photo & JSON)
- Drag & Drop API
- Print CSS + browser PDF

---

## 📱 Browser Support

Modern browsers: Chrome, Firefox, Safari, Edge (latest versions). Mobile browsers fully supported.

---

## 📄 License

MIT — free for personal and commercial use.

---

Built with ❤️ as a pure frontend demonstration of a premium SaaS-style product.
