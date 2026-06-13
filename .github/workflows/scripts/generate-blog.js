const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITE_URL = 'https://www.qalamdigital.com';
const TODAY = '2026-06-03';
const POSTS_PER_PAGE = 10;
const FEATURED_COUNT = 5;
const AUTHOR = {
  name: 'Mahatheer Muhammadh',
  title: 'Graphic Designer',
  bio: 'Mahatheer Muhammadh is the Founder and Graphic Designer at Qalam Digital with 5 years of experience in brand identity, campaign creatives, UI direction, and conversion-focused design. He works with businesses to turn unclear ideas into clean visual systems, practical digital experiences, and marketing assets that support measurable growth.'
};

const SERVICE_OPTIONS = [
  'Graphic Design',
  'Landing Page Design',
  'UI UX Design',
  'Social Media Management',
  'Meta Ads (Facebook/Instagram)',
  'Google Ads',
  'SEO',
  'Branding & Identity',
  'Web Design & Development',
  'Print Design',
  'Full-Stack Marketing'
];

const ICONS = {
  whatsapp: '<svg width="20" height="20" viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.669 4.797 1.833 6.788L2 30l7.397-1.812A13.94 13.94 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.6a11.547 11.547 0 01-5.89-1.608l-.422-.252-4.39 1.075 1.112-4.278-.276-.44A11.556 11.556 0 014.4 16C4.4 9.59 9.59 4.4 16 4.4S27.6 9.59 27.6 16 22.41 27.6 16 27.6zm6.39-8.672c-.35-.175-2.07-1.02-2.39-1.137-.322-.116-.556-.175-.79.175-.233.35-.905 1.137-1.11 1.371-.204.233-.408.262-.758.087-.35-.175-1.478-.545-2.815-1.737-1.04-.928-1.742-2.073-1.946-2.423-.204-.35-.022-.539.153-.713.158-.157.35-.408.525-.612.175-.204.233-.35.35-.583.117-.234.058-.438-.029-.612-.088-.175-.79-1.904-1.082-2.608-.285-.686-.574-.593-.79-.604l-.672-.012c-.234 0-.612.088-.933.438-.32.35-1.224 1.196-1.224 2.917s1.253 3.383 1.428 3.616c.175.234 2.466 3.766 5.977 5.278.835.36 1.487.575 1.995.736.838.267 1.601.229 2.204.139.672-.1 2.07-.847 2.362-1.664.292-.817.292-1.518.204-1.664-.087-.146-.32-.234-.67-.409z"/></svg>',
  facebook: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>',
  instagram: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>',
  linkedin: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>',
  whatsappSmall: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>'
};

function readPosts() {
  const file = path.join(ROOT, 'content', 'blog', 'posts.json');
  const posts = JSON.parse(fs.readFileSync(file, 'utf8'));
  return posts
    .map(post => {
      const wordCount = countWords([
        post.title,
        post.excerpt,
        ...post.sections.flatMap(section => [section.heading, section.paragraph, ...(section.takeaways || [])]),
        ...(post.summaryTakeaways || []),
        ...(post.faqs || []).flatMap(faq => [faq.question, faq.answer])
      ].join(' '));
      return {
        ...post,
        wordCount,
        readMinutes: Math.max(1, Math.ceil(wordCount / 200)),
        image: `assets/images/blog/${post.slug}.svg`
      };
    })
    .sort((a, b) => new Date(b.datePublished) - new Date(a.datePublished));
}

function countWords(text) {
  return String(text || '').trim().split(/\s+/).filter(Boolean).length;
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function stripHtml(value) {
  return String(value || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function writeFile(filePath, content) {
  ensureDir(filePath);
  fs.writeFileSync(filePath, content, 'utf8');
}

function postUrl(post) {
  return `${SITE_URL}/blog/${post.slug}/`;
}

function localPostLink(prefix, post) {
  return `${prefix}blog/${post.slug}/`;
}

function imageUrl(post) {
  return `${SITE_URL}/${post.image}`;
}

function localImage(prefix, post) {
  return `${prefix}${post.image}`;
}

function relativePrefix(depth) {
  return depth === 0 ? '' : '../'.repeat(depth);
}

function serviceSelector(label = 'Project Type') {
  return `
      <fieldset class="form-group service-options" data-service-group>
        <legend>${escapeHtml(label)}</legend>
        <div class="service-chip-grid" role="group" aria-label="${escapeHtml(label)}">
          ${SERVICE_OPTIONS.map(option => `
          <label class="service-chip">
            <input class="service-chip-input" type="checkbox" name="services[]" value="${escapeHtml(option)}">
            <span>${escapeHtml(option)}</span>
          </label>`).join('')}
        </div>
        <p class="service-error" aria-live="polite">Choose at least one project type.</p>
      </fieldset>`;
}

function nav(prefix, active = 'blog') {
  const links = [
    ['Home', `${prefix}index.html`, 'home'],
    ['Services', `${prefix}index.html#services`, 'services'],
    ['Portfolio', `${prefix}portfolio.html`, 'portfolio'],
    ['Blog', `${prefix}blog/`, 'blog'],
    ['About', `${prefix}about.html`, 'about'],
    ['Contact', `${prefix}contact.html`, 'contact']
  ];
  return `
<nav id="navbar">
  <div class="nav-logo">
    <a href="${prefix}index.html">
      <img class="logo-dark" src="${prefix}assets/images/qalam-logo-dark.svg" alt="Qalam Digital" height="26">
      <img class="logo-light" src="${prefix}assets/images/qalam-logo-white.svg" alt="Qalam Digital" height="26">
    </a>
  </div>
  <ul class="nav-links">
    ${links.map(([label, href, key]) => `<li><a href="${href}"${key === active ? ' aria-current="page"' : ''}>${label}</a></li>`).join('\n    ')}
  </ul>
  <div class="nav-mobile-controls">
    <button class="theme-toggle" id="theme-toggle-mobile" aria-label="Toggle theme">
      <svg class="icon-moon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"/></svg>
      <svg class="icon-sun" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
    </button>
    <button class="burger" id="burger" onclick="toggleMenu()" aria-label="Toggle menu"><span></span><span></span><span></span></button>
  </div>
  <div class="nav-right">
    <a href="https://wa.me/919361104499?text=Hi%20Qalam%20Digital%2C%20I%27d%20like%20to%20know%20more%20about%20your%20services." target="_blank" rel="noopener" class="btn-secondary" style="padding:10px 20px;font-size:13px;">${ICONS.whatsapp}Chat on WhatsApp</a>
    <button class="btn-primary" onclick="openPopup()">Get Free Marketing Audit</button>
    <button class="theme-toggle" id="theme-toggle-desktop" aria-label="Toggle theme">
      <svg class="icon-moon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"/></svg>
      <svg class="icon-sun" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
    </button>
  </div>
</nav>

<div id="mobile-nav">
  <ul class="mobile-nav-links">
    ${links.map(([label, href]) => `<li><a href="${href}" onclick="closeMenu()">${label}</a></li>`).join('\n    ')}
  </ul>
  <div class="mobile-nav-actions">
    <a href="https://wa.me/919361104499?text=Hi%20Qalam%20Digital%2C%20I%27d%20like%20to%20know%20more%20about%20your%20services." target="_blank" rel="noopener" class="btn-secondary" style="justify-content:center;">${ICONS.whatsapp}Chat on WhatsApp</a>
    <button class="btn-primary" onclick="closeMenu();openPopup();" style="justify-content:center;">Get Free Marketing Audit</button>
  </div>
</div>
<div id="mobile-overlay" onclick="closeMenu()"></div>`;
}

function footer(prefix) {
  return `
<footer id="footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <div class="nav-logo" style="margin-bottom:14px;">
          <img class="logo-dark" src="${prefix}assets/images/qalam-logo-dark.svg" alt="Qalam Digital" height="24" style="opacity:0.9;">
          <img class="logo-light" src="${prefix}assets/images/qalam-logo-white.svg" alt="Qalam Digital" height="24" style="opacity:0.9;">
        </div>
        <p>AI-powered digital marketing and creative growth agency helping brands scale through Meta Ads, SEO, branding, and full-stack creative strategy.</p>
        <div class="social-links">
          <a href="https://www.facebook.com/qalamdigital" class="social-btn" title="Facebook" target="_blank" rel="noopener">${ICONS.facebook}</a>
          <a href="https://www.instagram.com/qalamdigital" class="social-btn" title="Instagram" target="_blank" rel="noopener">${ICONS.instagram}</a>
          <a href="https://www.linkedin.com/company/qalamdigital" class="social-btn" title="LinkedIn" target="_blank" rel="noopener">${ICONS.linkedin}</a>
          <a href="https://wa.me/919361104499" class="social-btn" title="WhatsApp" target="_blank" rel="noopener">${ICONS.whatsappSmall}</a>
        </div>
      </div>
      <div class="footer-col">
        <h4>Services</h4>
        <ul>
          <li><a href="${prefix}index.html#services">Meta Ads</a></li>
          <li><a href="${prefix}index.html#services">Google Ads</a></li>
          <li><a href="${prefix}index.html#services">SEO</a></li>
          <li><a href="${prefix}index.html#services">Branding & Identity</a></li>
          <li><a href="${prefix}index.html#services">Web Development</a></li>
          <li><a href="${prefix}index.html#services">Social Media</a></li>
          <li><a href="${prefix}index.html#services">Print Design</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Quick Links</h4>
        <ul>
          <li><a href="${prefix}about.html">About Us</a></li>
          <li><a href="${prefix}portfolio.html">Portfolio</a></li>
          <li><a href="${prefix}blog/">Blog</a></li>
          <li><a href="${prefix}portfolio.html#case-studies">Case Studies</a></li>
          <li><a href="${prefix}index.html#faq">FAQ</a></li>
          <li><a href="${prefix}contact.html">Contact</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Contact</h4>
        <div class="contact-item">qalamdigitalsolution@gmail.com</div>
        <div class="contact-item">+91 93611 04499</div>
        <div class="contact-item">+91 89039 17470</div>
        <div class="contact-item" style="margin-top:10px;">3, Commercial Complex, Near Police Station, BP Agramharam, Erode - 5</div>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2026 Qalam Digital. All rights reserved. Crafted with AI x Creativity.</p>
      <p>Privacy Policy &middot; Terms of Service</p>
    </div>
  </div>
</footer>`;
}

function popup(prefix) {
  return `
<div id="floating-cta">
  <a href="https://wa.me/919361104499?text=Hi%20Qalam%20Digital%2C%20I%27d%20like%20to%20know%20more%20about%20your%20services." class="float-wa-btn" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">WA</a>
  <button class="float-btn" onclick="openPopup()">Free Marketing Audit</button>
</div>

<div id="popup-overlay" onclick="closePopupOnBg(event)">
  <div class="popup-card">
    <button class="popup-close" onclick="closePopup()">&times;</button>
    <div class="popup-title">Get Your Free Audit</div>
    <p class="popup-sub">Fill in your details and we'll reach out within 4 hours.</p>
    <form class="lead-form" data-form-name="Popup audit" onsubmit="handlePopupForm(event)">
      <div class="form-row">
        <div class="form-group"><label>Your Name</label><input type="text" name="name" placeholder="John Doe" required></div>
        <div class="form-group"><label>Business Name</label><input type="text" name="business" placeholder="Acme Inc." required></div>
      </div>
      <div class="form-group"><label>Email Address</label><input type="email" name="email" placeholder="you@company.com" required></div>
      <div class="form-group"><label>Phone Number</label><input type="tel" name="phone" placeholder="1234567890" required></div>
${serviceSelector('Project Type')}
      <div class="form-group"><label>How Can We Help?</label><textarea name="message" placeholder="Tell us about your business goals..."></textarea></div>
      <button type="submit" class="btn-primary" style="width:100%;justify-content:center;padding:14px;margin-top:6px;">Send My Audit Request</button>
    </form>
    <p style="font-size:15px;color:rgba(255,255,255,0.3);text-align:center;margin-top:12px;">100% free.</p>
  </div>
</div>
<script src="${prefix}assets/js/script.js"></script>`;
}

function baseHead({ title, description, canonical, prefix, schema, image = `${SITE_URL}/assets/images/qalam-og-image.png`, extraLinks = '', ogType = 'article' }) {
  return `<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}">
<meta name="author" content="Qalam Digital">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
<link rel="canonical" href="${canonical}">
${extraLinks}
<link rel="icon" href="${prefix}assets/images/qalam-icon.png" type="image/png">
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="Qalam Digital">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${image}">
<meta property="og:image:alt" content="${escapeHtml(title)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(title)}">
<meta name="twitter:description" content="${escapeHtml(description)}">
<meta name="twitter:image" content="${image}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${prefix}assets/css/style.css">
<script type="application/ld+json">
${JSON.stringify(schema, null, 2)}
</script>
</head>`;
}

function breadcrumb(items, id) {
  return {
    '@type': 'BreadcrumbList',
    '@id': id,
    itemListElement: items.map(([name, item], index) => ({ '@type': 'ListItem', position: index + 1, name, item }))
  };
}

function blogIndexSchema(posts, pageUrl, title, description) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Blog',
        '@id': `${pageUrl}#blog`,
        name: title,
        description,
        url: pageUrl,
        publisher: { '@id': `${SITE_URL}/#organization` }
      },
      {
        '@type': 'ItemList',
        '@id': `${pageUrl}#posts`,
        itemListElement: posts.map((post, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: postUrl(post),
          name: post.title
        }))
      },
      breadcrumb([['Home', `${SITE_URL}/`], ['Blog', `${SITE_URL}/blog/`]], `${pageUrl}#breadcrumb`)
    ]
  };
}

function postSchema(post, prev, next) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${postUrl(post)}#article`,
        mainEntityOfPage: { '@id': `${postUrl(post)}#webpage` },
        headline: post.title,
        description: post.excerpt,
        image: [imageUrl(post)],
        author: { '@type': 'Person', name: AUTHOR.name, jobTitle: AUTHOR.title },
        publisher: {
          '@type': 'Organization',
          name: 'Qalam Digital',
          logo: { '@type': 'ImageObject', url: `${SITE_URL}/assets/images/qalam-logo-dark.svg` }
        },
        datePublished: post.datePublished,
        dateModified: post.dateModified || post.datePublished,
        wordCount: post.wordCount,
        timeRequired: `PT${post.readMinutes}M`,
        articleSection: post.category,
        inLanguage: 'en-IN'
      },
      {
        '@type': 'WebPage',
        '@id': `${postUrl(post)}#webpage`,
        url: postUrl(post),
        name: post.title,
        description: post.excerpt,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        breadcrumb: { '@id': `${postUrl(post)}#breadcrumb` }
      },
      breadcrumb([['Home', `${SITE_URL}/`], ['Blog', `${SITE_URL}/blog/`], [post.title, postUrl(post)]], `${postUrl(post)}#breadcrumb`),
      {
        '@type': 'FAQPage',
        '@id': `${postUrl(post)}#faq`,
        mainEntity: post.faqs.map(faq => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer }
        }))
      }
    ]
  };
}

function renderBlogIndex(posts, page, totalPages) {
  const prefix = page === 1 ? '../' : '../../../';
  const pageUrl = page === 1 ? `${SITE_URL}/blog/` : `${SITE_URL}/blog/page/${page}/`;
  const start = (page - 1) * POSTS_PER_PAGE;
  const visible = posts.slice(start, start + POSTS_PER_PAGE);
  const title = page === 1 ? 'Qalam Digital Blog | Marketing, SEO, Design and Growth' : `Qalam Digital Blog Page ${page}`;
  const description = 'Editorial guides on digital marketing, SEO, AEO, GEO, branding, UI UX, landing pages, paid ads and creative growth from Qalam Digital.';
  const links = [
    page > 1 ? `<link rel="prev" href="${page === 2 ? `${SITE_URL}/blog/` : `${SITE_URL}/blog/page/${page - 1}/`}">` : '',
    page < totalPages ? `<link rel="next" href="${SITE_URL}/blog/page/${page + 1}/">` : ''
  ].filter(Boolean).join('\n');

  return `<!DOCTYPE html>
<html lang="en-IN">
${baseHead({ title, description, canonical: pageUrl, prefix, schema: blogIndexSchema(visible, pageUrl, title, description), extraLinks: links, ogType: 'website' })}
<body class="blog-index-page">
${nav(prefix, 'blog')}
<main>
  <section class="blog-landing-hero">
    <div class="container blog-hero-grid">
      <div>
        <div class="section-label">Qalam Journal</div>
        <h1>Ideas for sharper marketing, cleaner design and smarter growth.</h1>
        <p>Editorial notes, tactical guides and strategy breakdowns for founders, local businesses and growing brands.</p>
      </div>
      ${visible[0] ? `<a class="blog-hero-feature" href="${localPostLink(prefix, visible[0])}">
        <img src="${localImage(prefix, visible[0])}" alt="${escapeHtml(visible[0].imageAlt)}">
        <span>${escapeHtml(visible[0].category)}</span>
        <strong>${escapeHtml(visible[0].title)}</strong>
        <small>By ${escapeHtml(visible[0].author)} &middot; ${visible[0].readMinutes} min read</small>
      </a>` : ''}
    </div>
  </section>

  <section class="blog-list-section">
    <div class="container">
      <div class="blog-list-header">
        <div>
          <div class="section-label">Latest Articles</div>
          <h2>${page === 1 ? 'Fresh thinking from Qalam Digital' : `Articles - Page ${page}`}</h2>
        </div>
        <p>10 posts per page. Pagination updates automatically when more posts are published.</p>
      </div>
      <div class="blog-card-grid">
        ${visible.map(post => renderBlogCard(post, prefix)).join('\n')}
      </div>
      ${renderPagination(page, totalPages)}
    </div>
  </section>
</main>
${footer(prefix)}
${popup(prefix)}
</body>
</html>`;
}

function renderBlogCard(post, prefix) {
  return `<article class="blog-card">
  <a href="${localPostLink(prefix, post)}" class="blog-card-image">
    <img src="${localImage(prefix, post)}" alt="${escapeHtml(post.imageAlt)}">
  </a>
  <div class="blog-card-body">
    <span class="blog-category">${escapeHtml(post.category)}</span>
    <h3><a href="${localPostLink(prefix, post)}">${escapeHtml(post.title)}</a></h3>
    <p>${escapeHtml(post.excerpt)}</p>
    <div class="blog-meta">
      <span>By ${escapeHtml(post.author)}</span>
      <span>${post.readMinutes} min read</span>
    </div>
    <a class="blog-read-more" href="${localPostLink(prefix, post)}">Read More</a>
  </div>
</article>`;
}

function renderPagination(page, totalPages) {
  if (totalPages <= 1) return '';
  const links = [];
  for (let i = 1; i <= totalPages; i++) {
    const href = page === 1
      ? (i === 1 ? './' : `page/${i}/`)
      : (i === 1 ? '../../' : `../../page/${i}/`);
    links.push(`<a href="${href}"${i === page ? ' aria-current="page"' : ''}>${i}</a>`);
  }
  return `<nav class="blog-pagination" aria-label="Blog pagination">${links.join('')}</nav>`;
}

function renderPost(post, prev, next) {
  const prefix = '../../';
  const toc = post.sections.map(section => {
    const id = slugify(section.heading);
    return `<li><a href="#${id}">${escapeHtml(section.heading)}</a></li>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en-IN">
${baseHead({ title: `${post.title} | Qalam Digital Blog`, description: post.excerpt, canonical: postUrl(post), prefix, image: imageUrl(post), schema: postSchema(post, prev, next) })}
<body class="blog-post-page">
${nav(prefix, 'blog')}
<main class="blog-post-main">
  <div class="container blog-post-container">
    <article class="blog-post-article">
      <header class="blog-post-header">
        <img class="blog-post-banner" src="${localImage(prefix, post)}" alt="${escapeHtml(post.imageAlt)}">
        <h1>${escapeHtml(post.title)}</h1>
        <div class="blog-post-meta-line">
          <span>By ${escapeHtml(post.author)}</span>
          <span class="read-duration" aria-label="${post.readMinutes} minute read">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
            ${post.readMinutes} min read
          </span>
        </div>
      </header>

      <details class="blog-toc" open>
        <summary>Table of Contents</summary>
        <ol>${toc}</ol>
      </details>

      <div class="blog-content-layout">
        <div class="blog-content">
          ${post.sections.map(section => renderPostSection(section)).join('\n')}
          <section class="takeaway-box takeaway-box-final">
            <span>Key Takeaways</span>
            <h2>Full Article Summary</h2>
            <ul>${post.summaryTakeaways.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
          </section>
          <section class="blog-faq-section" aria-labelledby="blog-faq-title">
            <h2 id="blog-faq-title">Frequently Asked Questions</h2>
            ${post.faqs.map((faq, index) => renderBlogFaq(faq, index)).join('\n')}
          </section>
          <nav class="post-nav-bar" aria-label="Post navigation">
            <a href="${prev ? localPostLink(prefix, prev) : '#'}"${prev ? '' : ' aria-disabled="true"'}>&larr; Previous Post</a>
            <a href="${prefix}index.html">&#127968; Home</a>
            <a href="${next ? localPostLink(prefix, next) : '#'}"${next ? '' : ' aria-disabled="true"'}>Next Post &rarr;</a>
          </nav>
          <section class="author-box">
            <div class="founder-avatar">MM</div>
            <div>
              <h2>${AUTHOR.name}</h2>
              <p class="author-title">${AUTHOR.title} &middot; 5 years in the field</p>
              <p>${AUTHOR.bio}</p>
              <div class="author-socials">
                <a href="#" aria-label="Facebook">Facebook</a>
                <a href="#" aria-label="Instagram">Instagram</a>
                <a href="#" aria-label="LinkedIn">LinkedIn</a>
              </div>
            </div>
          </section>
        </div>
        <aside class="blog-sticky-cta" aria-label="Final call to action">
          <span>Need this for your brand?</span>
          <h2>Build a sharper marketing system with Qalam Digital.</h2>
          <p>Get help with strategy, landing pages, ads, SEO, branding and conversion-focused creative.</p>
          <a class="btn-primary" href="${prefix}contact.html">Start a Project</a>
          <button class="btn-secondary" onclick="openPopup()">Book Free Audit</button>
        </aside>
      </div>
    </article>
  </div>
</main>
${footer(prefix)}
${popup(prefix)}
</body>
</html>`;
}

function renderPostSection(section) {
  const id = slugify(section.heading);
  return `<section id="${id}" class="blog-copy-section">
  <h2>${escapeHtml(section.heading)}</h2>
  <p>${escapeHtml(section.paragraph)}</p>
  <div class="takeaway-box">
    <span>Key Takeaways</span>
    <ul>${section.takeaways.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
  </div>
</section>`;
}

function renderBlogFaq(faq, index) {
  return `<div class="blog-faq-item${index === 0 ? ' open' : ''}">
  <button type="button" class="blog-faq-question" onclick="toggleBlogFaq(this)" aria-expanded="${index === 0 ? 'true' : 'false'}">
    ${escapeHtml(faq.question)}
    <span>+</span>
  </button>
  <div class="blog-faq-answer"><p>${escapeHtml(faq.answer)}</p></div>
</div>`;
}

function generateImages(posts) {
  const colors = [
    ['#1A9E57', '#0891B2'],
    ['#0D1A12', '#1A9E57'],
    ['#0891B2', '#65A30D'],
    ['#1A9E57', '#F5A623']
  ];
  for (const [index, post] of posts.entries()) {
    const [a, b] = colors[index % colors.length];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675" role="img" aria-label="${escapeHtml(post.imageAlt)}">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="${a}" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="${b}" stop-opacity="0.95"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="675" fill="#F5F7F5"/>
  <rect x="54" y="54" width="1092" height="567" rx="34" fill="url(#g)"/>
  <circle cx="1010" cy="132" r="92" fill="#fff" opacity="0.12"/>
  <circle cx="920" cy="548" r="170" fill="#fff" opacity="0.10"/>
  <text x="96" y="136" font-family="Arial, sans-serif" font-size="28" font-weight="700" fill="#EAFBF1" letter-spacing="4">${escapeHtml(post.category.toUpperCase())}</text>
  <text x="96" y="312" font-family="Arial, sans-serif" font-size="66" font-weight="800" fill="#FFFFFF">${wrapSvgText(post.title, 23, 96, 312, 76)}</text>
  <text x="96" y="560" font-family="Arial, sans-serif" font-size="28" fill="#EAFBF1">Qalam Digital Blog</text>
</svg>`;
    writeFile(path.join(ROOT, post.image), svg);
  }
}

function wrapSvgText(text, maxChars, x, y, dy) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 3).map((part, index) => `<tspan x="${x}" y="${y + index * dy}">${escapeHtml(part)}</tspan>`).join('');
}

function updateHomepageFeatured(posts) {
  const file = path.join(ROOT, 'index.html');
  let html = fs.readFileSync(file, 'utf8');
  const featured = posts.slice(0, FEATURED_COUNT);
  const section = `<!-- BLOG_FEATURED_START -->
<section id="featured-blog" class="featured-blog-section">
  <div class="container">
    <div class="portfolio-header reveal">
      <div>
        <div class="section-label">From The Blog</div>
        <h2 class="section-title">Latest Ideas For <em>Creative Growth</em></h2>
        <p class="section-sub">Featured posts rotate automatically from the newest published articles.</p>
      </div>
      <a href="blog/" class="btn-ghost">View All Posts</a>
    </div>
    <div class="featured-blog-grid">
      ${featured.map(post => `<article class="featured-blog-card reveal">
        <a class="featured-blog-image" href="blog/${post.slug}/"><img src="${post.image}" alt="${escapeHtml(post.imageAlt)}"></a>
        <div class="featured-blog-body">
          <span>${escapeHtml(post.category)} &middot; ${post.readMinutes} min read</span>
          <h3><a href="blog/${post.slug}/">${escapeHtml(post.title)}</a></h3>
          <p>${escapeHtml(post.excerpt)}</p>
          <a class="blog-read-more" href="blog/${post.slug}/">Read More</a>
        </div>
      </article>`).join('\n')}
    </div>
  </div>
</section>
<!-- BLOG_FEATURED_END -->`;

  if (/<!-- BLOG_FEATURED_START -->[\s\S]*?<!-- BLOG_FEATURED_END -->/.test(html)) {
    html = html.replace(/<!-- BLOG_FEATURED_START -->[\s\S]*?<!-- BLOG_FEATURED_END -->/, section);
  } else {
    html = html.replace('<!-- FOOTER -->', `${section}\n\n<!-- FOOTER -->`);
  }
  fs.writeFileSync(file, html, 'utf8');
}

function updateRootNavigation() {
  for (const file of ['index.html', 'about.html', 'portfolio.html', 'contact.html']) {
    const fullPath = path.join(ROOT, file);
    let html = fs.readFileSync(fullPath, 'utf8');
    html = html.replace(/(<li><a href="portfolio\.html">Portfolio<\/a><\/li>\s*)(<li><a href="about\.html">About<\/a><\/li>)/g, '$1<li><a href="blog/">Blog</a></li>\n    $2');
    html = html.replace(/(<li><a href="portfolio\.html" onclick="closeMenu\(\)">Portfolio<\/a><\/li>\s*)(<li><a href="about\.html" onclick="closeMenu\(\)">About<\/a><\/li>)/g, '$1<li><a href="blog/" onclick="closeMenu()">Blog</a></li>\n    $2');
    html = html.replace(/(<li><a href="portfolio\.html">Portfolio<\/a><\/li>\s*)(<li><a href="portfolio\.html#case-studies">Case Studies<\/a><\/li>)/g, '$1<li><a href="blog/">Blog</a></li>\n          $2');
    fs.writeFileSync(fullPath, html, 'utf8');
  }
}

function updateSitemap(posts, totalPages) {
  const urls = [
    ['https://www.qalamdigital.com/', TODAY, 'weekly', '1.0'],
    ['https://www.qalamdigital.com/about.html', TODAY, 'monthly', '0.8'],
    ['https://www.qalamdigital.com/portfolio.html', TODAY, 'weekly', '0.9'],
    ['https://www.qalamdigital.com/contact.html', TODAY, 'monthly', '0.8'],
    ['https://www.qalamdigital.com/blog/', TODAY, 'weekly', '0.9']
  ];
  for (let page = 2; page <= totalPages; page++) {
    urls.push([`https://www.qalamdigital.com/blog/page/${page}/`, TODAY, 'weekly', '0.7']);
  }
  for (const post of posts) {
    urls.push([postUrl(post), post.dateModified || post.datePublished, 'monthly', '0.8']);
  }
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([loc, lastmod, changefreq, priority]) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('\n')}
</urlset>
`;
  writeFile(path.join(ROOT, 'sitemap.xml'), xml);
}

function generateBlog() {
  const posts = readPosts();
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  generateImages(posts);

  for (let page = 1; page <= totalPages; page++) {
    const filePath = page === 1
      ? path.join(ROOT, 'blog', 'index.html')
      : path.join(ROOT, 'blog', 'page', String(page), 'index.html');
    writeFile(filePath, renderBlogIndex(posts, page, totalPages));
  }

  posts.forEach((post, index) => {
    const prev = posts[index + 1] || null;
    const next = posts[index - 1] || null;
    writeFile(path.join(ROOT, 'blog', post.slug, 'index.html'), renderPost(post, prev, next));
  });

  updateRootNavigation();
  updateHomepageFeatured(posts);
  updateSitemap(posts, totalPages);
  console.log(`Generated ${posts.length} posts, ${totalPages} blog listing page(s), featured homepage section and sitemap.`);
}

generateBlog();
