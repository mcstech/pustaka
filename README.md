# PUSTAKA

Koleksi Ayat-Ayat Suci - A comprehensive collection of sacred texts including the Quran, Bible, and Wejangan (YMM teachings).

## Overview

Pustaka is a web application built with Fresh (Deno) that provides searchable access to religious texts. The application features:

- 📖 **Quran** - Complete Quranic verses with translations
- ✝️ **Bible** - Biblical passages and translations
- 📚 **Wejangan** - YMM teachings and articles
- 🔍 **Document Search** - Fast search across all texts using docfind

## Prerequisites

Make sure to install Deno:
https://docs.deno.com/runtime/getting_started/installation

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd e-bacaan
```

2. Install dependencies (Deno handles this automatically on first run)

## Setup

### Generate Search Documents

Before running the application, you need to generate the searchable document index. The project includes several scripts to prepare data from different sources:

```bash
# Generate all documents at once (recommended)
deno task prepare-docs
```
Then run this to produce the wasm file

```bash
docfind "./data/documents.json" "./static/docfind"
```

This will:
- Process Quran verses from `/data/quran/surah/*.ts` files
- Process Bible verses from `/data/bible/` translations
- Process Wejangan articles from `/data/wejangan/` markdown files
- Generate `/data/documents.json` with all searchable content
- Display a summary with processing time, file size, and total records

### Individual Generation Scripts

You can also run individual generators:

```bash
# Generate Quran documents only
deno task generate-quran

# Generate Bible documents only
deno task generate-bible

# Generate Wejangan documents only
deno task generate-wejangan
```

## Development

Start the project in development mode:

```bash
deno task dev
```

This will:
- Start the development server at `http://localhost:8000`
- Watch for file changes and hot-reload
- Enable Fresh islands for interactive components

## Production

Build and run in production:

```bash
# Build the application
deno task build

# Start production server
deno task start
```

## Available Tasks

```bash
deno task check           # Format, lint, and type-check code
deno task dev             # Start development server
deno task build           # Build for production
deno task start           # Start production server
deno task update          # Update Fresh framework
deno task generate-quran  # Generate Quran documents
deno task generate-bible  # Generate Bible documents
deno task generate-wejangan  # Generate Wejangan documents
deno task prepare-docs    # Generate all documents with summary
```

## Project Structure

```
/
├── components/          # Reusable UI components
│   ├── bible/          # Bible-specific components
│   ├── quran/          # Quran-specific components
│   └── hero/           # Homepage components
├── data/               # Source data files
│   ├── documents.json  # Generated search index
│   ├── bible/          # Bible translations
│   ├── quran/          # Quran surahs
│   └── wejangan/       # Wejangan markdown files
├── islands/            # Interactive Fresh islands
├── libs/               # Utility libraries
│   ├── doc-find.ts     # Document search functionality
│   ├── quran.ts        # Quran helpers
│   └── prepare-firman.ts  # Data preparation utilities
├── routes/             # Fresh routes
│   └── (firman)/       # Religious text routes
│       ├── alkitab/    # Bible routes
│       ├── quran/      # Quran routes
│       └── wejangan/   # Wejangan routes
├── scripts/            # Data generation scripts
│   ├── generate-documents.ts          # Quran generator
│   ├── generate-bible-documents.ts    # Bible generator
│   ├── generate-wejangan-documents.ts # Wejangan generator
│   └── prepare-docs.ts                # Run all generators
└── static/             # Static assets
```

## Document Search (docfind)

The application uses a custom document finder (`libs/doc-find.ts`) that enables fast full-text search across all texts. The search index is built from:

### Quran Documents
- **Format**: Each verse is a separate document
- **Keywords**: Verse references (e.g., `1:6`, `1/6` for Surah 1, Ayah 6)
- **Title**: Surah name + translation (e.g., "Al-Fatihah (The Opening)")
- **Body**: Translated verse text

### Bible Documents
- **Format**: Each verse is a separate document
- **Keywords**: Book references and verse numbers
- **Title**: Book name + chapter
- **Body**: Verse text in selected translation

### Wejangan Documents
- **Format**: Each markdown file is a document
- **Keywords**: Year, filename, and frontmatter keywords
- **Title**: Extracted from frontmatter or first H1
- **Body**: Markdown content converted to plain text

## Development Workflow for New Contributors

1. **Fork and clone** the repository
2. **Run setup**: `deno task prepare-docs` to generate search data
3. **Start dev server**: `deno task dev`
4. Make your changes
5. **Check code**: `deno task check` before committing
6. Submit a pull request

## Adding New Content

### Adding Quran Translations
1. Add translation data to `/data/quran/surah/{number}.ts`
2. Run `deno task generate-quran`

### Adding Bible Translations
1. Add translation JSON to `/data/bible/`
2. Run `deno task generate-bible`

### Adding Wejangan Articles
1. Create markdown file in `/data/wejangan/{year}/{name}.md`
2. Include frontmatter with title and keywords:
```markdown
---
title: Article Title
keywords: [keyword1, keyword2]
---

Article content here...
```
3. Run `deno task generate-wejangan`

After adding any content, regenerate all documents:
```bash
deno task prepare-docs
```

## Tech Stack

- **Runtime**: Deno
- **Framework**: Fresh 2.x
- **UI**: Preact + Tailwind CSS + DaisyUI
- **Styling**: Tailwind CSS 4.x
- **Build**: Vite
- **Typography**: @tailwindcss/typography
- **Markdown**: @deno/gfm

## Contributing

Contributions are welcome! Please read the development workflow above and ensure all checks pass before submitting a PR.
