# Blog Post Thumbnails

This directory contains thumbnail images for blog posts.

## Naming Convention

- Name thumbnails to match the post slug: `YYYY-MM-DD-post-name.jpg` or `.svg` or `.png`
- Default thumbnail: `default.svg` (used when post doesn't specify a custom thumbnail)

## Recommended Specifications

- Format: SVG (preferred), JPEG, or PNG
- Size: 1200x630px (Open Graph standard)
- SVG: Scalable, small file size, crisp at any resolution
- Raster (JPG/PNG): Max file size 200KB
- Style: Cold War aesthetic (classified documents, redacted imagery, etc.)

## Usage

In your MDX post frontmatter, specify the thumbnail path:

```yaml
---
thumbnail: thumbnails/2024-11-29-my-post.jpg
---
```

If no thumbnail is specified, `thumbnails/default.jpg` will be used.

