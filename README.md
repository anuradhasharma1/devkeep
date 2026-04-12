# DevKeep — Your Cozy Code Vault

> Save, tag, and retrieve code snippets in seconds. A calm, distraction-free workspace built for developers.

🔗 **Live:** [devkeep-two.vercel.app](https://devkeep-two.vercel.app)

---

## What is DevKeep?

DevKeep is a full-stack snippet manager that solves a real developer problem — losing useful code fragments across notes apps, Notion pages, and browser tabs. Everything lives in one place, searchable and organized.

---

## Features

- **Save snippets** — store code with title, description, language, and tags
- **Instant search** — filter by title, tag, or language in real time
- **Public / private** — make any snippet publicly shareable with a link
- **One-click copy** — copy any snippet to clipboard instantly
- **Edit & delete** — full CRUD from the dashboard
- **Dark / light mode** — smooth theme transition with sound
- **Google OAuth + email/password** — two auth methods
- **Mobile responsive** — works on all screen sizes

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router) |
| Styling | Tailwind CSS + CSS Variables |
| Auth | NextAuth.js v4 (Google + Credentials) |
| Database | MongoDB Atlas + Mongoose |
| Animations | Framer Motion |
| Deployment | Vercel |

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/anuradhasharma1/devkeep.git
cd devkeep
npm install
```

### 2. Set up environment variables

Create a `.env.local` file in the root:

```env
MONGODB_URI=your_mongodb_atlas_uri
NEXTAUTH_SECRET=your_random_secret
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
devkeep/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/    # NextAuth handler (Google + Credentials)
│   │   └── snippets/
│   │       ├── route.js          # GET all, POST create
│   │       └── [id]/
│   │           └── route.js      # GET one, PUT update, DELETE
│   ├── dashboard/
│   │   └── page.js               # Snippet library with search + filters
│   ├── create/
│   │   └── page.js               # New snippet form with live preview
│   ├── edit/
│   │   └── [id]/
│   │       └── page.js           # Edit existing snippet
│   ├── snippet/
│   │   └── [id]/
│   │       └── page.js           # Public snippet view + share
│   ├── login/
│   │   └── page.js               # Login + Register page
│   ├── layout.js                 # Root layout with AuthProvider + ThemeProvider
│   ├── globals.css               # CSS variables (light + dark theme)
│   └── page.js                   # Landing page
│
├── components/
│   ├── Navbar.js                 # Responsive navbar with auth-aware links
│   ├── ThemeToggler.js           # Dark/light toggle with shutter animation
│   ├── AuthProvider.js           # NextAuth SessionProvider wrapper
│   └── Button.js                 # ScrollToTop button
│
├── constants/
│   ├── languages.js              # Supported languages list
│   └── tags.js                   # Suggested tags list
│
├── core/
│   ├── db.js                     # MongoDB connection with caching
│   └── auth.js                   # JWT verify helper (legacy)
│
├── hooks/
│   ├── UseAuth.js                # useSession wrapper with logout
│   └── UseSnippets.js            # Snippet CRUD via API
│
├── models/
│   ├── user.js                   # User Mongoose schema
│   └── snippets.js               # Snippet Mongoose schema
│
├── utils/
│   ├── copyToclipboard.js        # Clipboard utility with fallback
│   └── formatDate.js             # Relative date formatter
│
├── public/
│   └── sounds/
│       └── click.mp3             # Theme toggle sound
│
├── .env.local                    # Environment variables (not committed)
├── .gitignore
├── next.config.mjs
├── jsconfig.json
├── postcss.config.mjs
└── README.md
```

---

## Author

**Anuradha Sharma** —  building in public

- 🔗 [LinkedIn](https://www.linkedin.com/in/anuradha-sharmaa1/)
- 🐙 [GitHub](https://github.com/anuradhasharma1)
- 📧 anuradhasharma71440@gmail.com

---

## License

MIT — free to use and modify.