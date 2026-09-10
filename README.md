# Multisheets.com 🇮🇳

**Indian PIN Code & IFSC Code Lookup Platform**

A lightweight, fast, mobile-first Indian utility website with 17,744 PIN codes and 164,836 bank branches.

## Features

- **Unified Search** — Search by PIN, IFSC, bank name, branch, district, or state
- **PIN Code Finder** — Find post office details for any 6-digit PIN code
- **IFSC Finder** — Find bank branch details for any IFSC code
- **Speed Post Calculator** — Calculate delivery time and cost
- **Validators** — PIN code, IFSC, and address validation tools
- **Bank Holidays** — Holiday calendar with clash checker
- **Blog & News** — Articles on banking, postal services, and more
- **Quiz** — UPSC/Banking knowledge section
- **Dashboard** — Dataset statistics and visualizations
- **Dark/Light Mode** — Easy on the eyes, day or night
- **Hindi + English** — Full bilingual support
- **PWA** — Installable on mobile, works offline
- **SEO Optimized** — Sitemap, robots.txt, structured data

## Tech Stack

- **Framework:** Next.js 16 (React 19)
- **Styling:** Tailwind CSS v4
- **Language:** TypeScript
- **Data:** 60MB+ of Indian PIN code and bank branch data
- **Hosting:** Vercel (serverless) or any static host

## Quick Start

```bash
# Clone the repository
git clone https://github.com/mohitsiddhi-art/multisheets.git
cd multisheets

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

## Project Structure

```
multisheets/
├── app/                    # 31 pages (routes)
│   ├── page.tsx            # Homepage
│   ├── search/             # Search page
│   ├── pincode/[pincode]/  # Dynamic PIN detail pages
│   ├── ifsc/[ifsc]/        # Dynamic IFSC detail pages
│   ├── tools/              # 7 utility tools
│   ├── blog/               # Blog posts
│   └── ...                 # Other pages
│
├── components/             # Reusable UI components
│   ├── Header.tsx          # Navigation
│   ├── Footer.tsx          # Footer
│   ├── SearchBox.tsx       # Main search component
│   └── Providers.tsx       # Theme & language context
│
├── lib/                    # Core logic
│   ├── india-data.ts       # Server-side data loading
│   ├── client-search.ts    # Client-side search engine
│   ├── translations.ts     # Hindi/English translations
│   └── utils.ts            # Utility functions
│
├── data/                   # Source data (not deployed)
│   ├── pincodes.json       # 3.6MB (17,744 records)
│   └── bank_branches.json  # 58MB (164,836 records)
│
├── public/                 # Static assets
│   ├── data/               # Split data files for client
│   ├── manifest.json       # PWA manifest
│   ├── sw.js               # Service worker
│   └── icons/              # App icons
│
└── scripts/                # Build scripts
    ├── extract-data.mjs    # CSV → JSON converter
    ├── split-bank-data.mjs # Splits bank data by state
    └── build-search-index.mjs
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub:
   ```bash
   git init
   git add -A
   git commit -m "Initial commit"
   git remote add origin https://github.com/mohitsiddhi-art/multisheets.git
   git push -u origin main
   ```

2. Go to [vercel.com](https://vercel.com) → Import → Select your repo

3. Click Deploy — done!

Vercel automatically:
- Builds and optimizes your Next.js app
- Sets up serverless functions for API routes
- Configures CDN for fast global delivery
- Provides HTTPS and custom domains

### Netlify

1. Push to GitHub (same as above)
2. Go to [netlify.com](https://netlify.com) → Import → Select your repo
3. Set build command: `npm run build`
4. Set publish directory: `.next`
5. Click Deploy

### GitHub Pages (Static)

1. Add to `next.config.ts`:
   ```typescript
   output: 'export',
   trailingSlash: true,
   ```

2. Build and deploy:
   ```bash
   npm run build
   npx gh-pages -d out
   ```

## Updating Data

When new PIN code or IFSC data is available:

1. Place CSV files in `data/` folder
2. Run the extraction script:
   ```bash
   node scripts/extract-data.mjs
   ```

3. Split bank data by state:
   ```bash
   node scripts/split-bank-data.mjs
   ```

4. Build search indexes:
   ```bash
   node scripts/build-search-index.mjs
   ```

5. Commit and push:
   ```bash
   git add -A
   git commit -m "Update PIN/IFSC data"
   git push
   ```

## Dataset Statistics

| Metric | Count |
|--------|-------|
| Total PIN codes | 17,744 |
| Unique PIN codes | 17,743 |
| Total bank branches | 164,836 |
| Unique IFSC codes | 164,836 |
| Banks covered | 1,352 |
| States/UTs | 42 |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you find this project helpful, please give it a ⭐ on GitHub!
