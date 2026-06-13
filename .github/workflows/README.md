# Qalam Digital Website

Static website for Qalam Digital.

## Folder Structure

```text
.
|-- index.html
|-- about.html
|-- portfolio.html
|-- contact.html
|-- blog
|   |-- index.html
|   |-- page
|   |   `-- 2
|   |       `-- index.html
|   `-- [post-slug]
|       `-- index.html
|-- robots.txt
|-- sitemap.xml
|-- llms.txt
|-- README.md
|-- assets
|   |-- css
|   |   `-- style.css
|   |-- js
|   |   `-- script.js
|   `-- images
|       |-- blog
|       |   `-- generated-blog-banners.svg
|       |-- qalam-icon.png
|       |-- qalam-logo-dark.svg
|       |-- qalam-logo-white.svg
|       `-- qalam-og-image.png
|-- content
|   `-- blog
|       `-- posts.json
|-- scripts
|   `-- generate-blog.js
`-- docs
    |-- BLOG_CONTENT_GUIDE.md
    |-- BACKEND_SETUP.md
    `-- SEO_LAUNCH_CHECKLIST.md
```

## Edit Guide

- Page content: edit the root `.html` files.
- Styling: edit `assets/css/style.css`.
- Form/backend URL and interactions: edit `assets/js/script.js`.
- Blog content: edit `content/blog/posts.json`, then run `node scripts/generate-blog.js`.
- Blog output: generated files are written into `blog/`, `assets/images/blog/`, and `sitemap.xml`.
- Google Sheets and email setup: follow `docs/BACKEND_SETUP.md`.
- Launch SEO files: keep `robots.txt`, `sitemap.xml`, and `llms.txt` at the site root.
- Before launch: follow `docs/SEO_LAUNCH_CHECKLIST.md`.

## Blog Publishing

1. Add a new post object at the top of `content/blog/posts.json`.
2. Keep `slug`, `title`, `excerpt`, `category`, `author`, dates, `imageAlt`, `sections`, `summaryTakeaways`, and `faqs`.
3. Run:

```bash
node scripts/generate-blog.js
```

The generator automatically updates featured posts, read time, post pages, pagination, SVG banners, FAQ schema, breadcrumb schema, and sitemap entries.
