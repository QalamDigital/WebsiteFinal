# SEO Launch Checklist

Use this after the website is live.

## Domain

- Confirm the final live domain is `https://www.qalamdigital.com/`.
- If the domain is different, update every canonical URL, Open Graph URL, JSON-LD URL, `robots.txt`, `sitemap.xml`, and `llms.txt`.
- Make sure only one version is primary: either `https://www.qalamdigital.com/` or `https://qalamdigital.com/`.
- Redirect all other versions to the primary version.

## Google Search Console

- Add the domain property in Google Search Console.
- Submit `https://www.qalamdigital.com/sitemap.xml`.
- Inspect these URLs:
  - `https://www.qalamdigital.com/`
  - `https://www.qalamdigital.com/about.html`
  - `https://www.qalamdigital.com/portfolio.html`
  - `https://www.qalamdigital.com/contact.html`
  - `https://www.qalamdigital.com/blog/`
  - A few individual blog post URLs
- Request indexing after the site is live and accessible.

## Structured Data

- Test every page with Google Rich Results Test.
- Test JSON-LD with Schema.org Validator.
- Confirm the business name, address, phone number, email, founders, services, and opening hours are correct.
- Confirm blog posts show BlogPosting, BreadcrumbList, and FAQPage schema where FAQs exist.

## Local SEO

- Create or update the Google Business Profile for Qalam Digital.
- Use the exact same NAP everywhere:
  - Name: Qalam Digital
  - Address: 3, Commercial Complex, Near Police Station, BP Agramharam, Erode - 5, Tamil Nadu, India
  - Phone: +91 93611 04499
- Add the live website URL to the Google Business Profile.

## Content

- Replace placeholder portfolio content with real work, client-safe screenshots, services, problems solved, and outcomes.
- Add original About page copy with founder story, process, tools, and proof.
- Add service-specific content over time for Meta Ads, Google Ads, SEO, branding, UI UX, landing pages, and web design.
- Add blog posts through `content/blog/posts.json`, then run `node scripts/generate-blog.js` before uploading.

## Social Preview

- Keep `assets/images/qalam-og-image.png` uploaded.
- Test the live URL preview on WhatsApp, LinkedIn, Facebook, and X.

## Performance

- Run PageSpeed Insights on all pages.
- Compress large images before adding portfolio work.
- Keep CSS and JavaScript paths unchanged unless you update all HTML references.
