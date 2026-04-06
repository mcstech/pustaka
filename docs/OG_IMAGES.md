# OG Image Generation for Pustaka

This directory contains the OG (Open Graph) image generation system for Pustaka's verse sharing feature.

## Overview

The OG image generator creates premium, breathtaking portrait-oriented (1080x1920) images for social media sharing, optimized for platforms like WhatsApp, Instagram Stories, and Twitter.

## Features

- **Portrait Ratio**: 1080x1920 pixels, perfect for mobile sharing
- **Premium Design**: Gradient backgrounds with elegant typography
- **Two Themes**:
  - Quran verses: Dark blue/red gradient with Arabic and Indonesian text
  - Bible verses: Dark slate/purple gradient with clear verse display
- **SVG Format**: Lightweight, scalable images that render perfectly
- **Automatic Meta Tags**: Each verse page includes proper OG tags

## Usage

### Generating OG Images

Generate OG images for all verses using the following commands:

```bash
# Generate OG images for all Quran verses
deno task generate-og-quran

# Generate OG images for all Bible verses
deno task generate-og-bible

# Generate both Quran and Bible OG images
deno task generate-og-all
```

### Output Structure

Generated images are stored in the `static/og/` directory:

```
static/og/
├── quran/
│   ├── 1/          # Al-Fatihah
│   │   ├── 1.svg
│   │   ├── 2.svg
│   │   └── ...
│   ├── 2/          # Al-Baqarah
│   │   ├── 1.svg
│   │   ├── 2.svg
│   │   └── ...
│   └── ...
└── alkitab/
    ├── GEN/        # Genesis
    │   ├── 1/
    │   │   ├── 1.svg
    │   │   ├── 2.svg
    │   │   └── ...
    │   └── ...
    ├── EXO/        # Exodus
    └── ...
```

## How It Works

1. **OG Image Generator** (`libs/og-image-generator.ts`):
   - Generates SVG markup for Quran and Bible verses
   - Handles text wrapping for long verses
   - Applies premium gradients and styling
   - Escapes XML special characters

2. **Generation Scripts**:
   - `scripts/generate-quran-og-images.ts`: Iterates through all Quran verses
   - `scripts/generate-bible-og-images.ts`: Iterates through all Bible verses
   - Both skip already-generated images for efficiency

3. **Route Integration**:
   - Quran: `routes/(firman)/quran/[chapterId]/[ayahId].tsx`
   - Bible: `routes/(firman)/alkitab/[bookId]/[chapterId]/[verseId].tsx`
   - Both include OG meta tags pointing to the generated images

## Design Guidelines

### Quran OG Images

- **Background**: Dark blue to navy gradient (#1a1a2e → #16213e → #0f3460)
- **Accent**: Red to orange gradient (#e94560 → #f39c12)
- **Typography**:
  - Surah name: Georgia, 56px
  - Arabic text: Traditional Arabic, 72px, RTL
  - Translation: Georgia, 36px
- **Layout**:
  - Header with surah name and number
  - Arabic text in center (up to 8 lines)
  - Indonesian translation below (up to 10 lines)
  - Footer with Pustaka branding

### Bible OG Images

- **Background**: Slate gradient (#2c3e50 → #34495e → #1a252f)
- **Accent**: Blue to purple gradient (#3498db → #9b59b6)
- **Typography**:
  - Book name: Georgia, 60px
  - Chapter:Verse: Georgia, 52px
  - Verse text: Georgia, 40px
- **Layout**:
  - Header with book and reference
  - Verse text in center (up to 18 lines)
  - Reference box with translation info
  - Footer with Pustaka branding

## Performance Considerations

- **Generated Files**: Not included in git repository (see `.gitignore`)
- **On-demand Generation**: Can be generated during build process
- **SVG Benefits**: Small file size, scalable, no loss of quality
- **Caching**: Static files can be cached by CDN

## Future Enhancements

Potential improvements for the future:

- [ ] Convert SVG to PNG for better social media compatibility
- [ ] Add support for custom fonts
- [ ] Implement dynamic color themes
- [ ] Add verse audio waveform visualizations
- [ ] Support for multiple languages
- [ ] Generate images on-demand via API endpoint

## Maintenance

To regenerate all images (e.g., after design updates):

1. Delete the `static/og/` directory
2. Run `deno task generate-og-all`
3. Verify images are generated correctly
4. Test sharing on social platforms

## Technical Notes

- SVG images specify `font-family` names; final rendering depends on fonts available in the viewing/rendering environment
- Text wrapping algorithm prevents overflow
- Long verses are truncated with ellipsis
- Special XML characters are properly escaped
- RTL (right-to-left) support for Arabic text
