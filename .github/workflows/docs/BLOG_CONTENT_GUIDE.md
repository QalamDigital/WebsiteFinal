# Blog Content Guide

The blog is generated from `content/blog/posts.json`.

## Add a new post

1. Open `content/blog/posts.json`.
2. Add the newest post object at the top of the array.
3. Use a unique lowercase `slug` with words separated by hyphens.
4. Include at least 3 content sections.
5. Add 2-3 `takeaways` for every section.
6. Add 4-5 `summaryTakeaways`.
7. Add 5-10 FAQ items.
8. Run:

```bash
node scripts/generate-blog.js
```

## What updates automatically

- Homepage featured blog cards use the newest 5 posts.
- The oldest featured card cycles out when a newer post is published.
- Blog landing pages show 10 posts per page.
- Pagination is generated when more than 10 posts exist.
- Individual post pages are created from the same content.
- Read time is calculated from word count.
- Table of contents is generated from section headings.
- FAQ JSON-LD is generated from visible FAQ items.
- BlogPosting and Breadcrumb JSON-LD are generated for every post.
- SVG banner images are generated into `assets/images/blog/`.
- `sitemap.xml` is updated with blog URLs.

## Required post fields

```json
{
  "slug": "example-blog-post",
  "title": "Example Blog Post",
  "excerpt": "A short SEO description for the post.",
  "category": "SEO",
  "author": "Mahatheer Muhammadh",
  "datePublished": "2026-06-03",
  "dateModified": "2026-06-03",
  "imageAlt": "Descriptive alt text for the banner image",
  "sections": [
    {
      "heading": "Section Heading",
      "paragraph": "Section body content.",
      "takeaways": [
        "First takeaway.",
        "Second takeaway."
      ]
    }
  ],
  "summaryTakeaways": [
    "Full article summary point."
  ],
  "faqs": [
    {
      "question": "Question?",
      "answer": "Answer."
    }
  ]
}
```

## SEO notes

- Keep titles readable and specific.
- Keep excerpts useful; they become meta descriptions.
- Use one clear topic per post.
- Make FAQs match the visible article content.
- Do not stuff keywords; write direct answers for people and answer engines.
