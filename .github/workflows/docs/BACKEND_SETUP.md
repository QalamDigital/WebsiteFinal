# Qalam Digital form backend setup

The website is static HTML/CSS/JS, so it cannot securely send emails or write to Google Sheets by itself. Use a small backend endpoint. The easiest option is Google Apps Script connected to a Google Sheet.

## What is already done in the site

- Every form now has named fields: `name`, `business`, `email`, `phone`, `service`, `services`, and `message`.
- `service` and `services` contain the selected project-type chips as a comma-separated value.
- Every form submits through `submitLeadForm()` in `assets/js/script.js`.
- Your current Google Apps Script Web App URL is already set in this line in `assets/js/script.js`:

```js
const FORM_ENDPOINT = 'https://script.google.com/macros/s/AKfycbw5BicLFqMyfBIVikAvzcv59jwTasunHhVSPMnv3BMldMGlJ-bfdwC6EJCycXeQaTTD/exec';
```

If you create a new Apps Script deployment later, replace that URL with the new Web App URL.

## Google Sheets + email backend

1. Create a new Google Sheet, for example `Qalam Website Leads`.
2. In the Sheet, go to `Extensions` > `Apps Script`.
3. Delete any default code and paste this:

```js
const SHEET_NAME = 'Leads';
const RECIPIENT_EMAIL = 'qalamdigitalsolution@gmail.com';

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
    ensureHeaders(sheet);

    const data = e.parameter || {};
    const row = [
      new Date(),
      data.formSource || '',
      data.name || '',
      data.business || '',
      data.email || '',
      data.phone || '',
      data.service || '',
      data.message || '',
      data.pageUrl || '',
      data.submittedAt || ''
    ];

    sheet.appendRow(row);

    const subject = `New website lead: ${data.name || 'Unknown'}`;
    const htmlBody = `
      <h2>New Qalam Digital Website Lead</h2>
      <p><strong>Source:</strong> ${escapeHtml(data.formSource)}</p>
      <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
      <p><strong>Business:</strong> ${escapeHtml(data.business)}</p>
      <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>
      <p><strong>Project Type:</strong> ${escapeHtml(data.service || data.services)}</p>
      <p><strong>Message:</strong><br>${escapeHtml(data.message)}</p>
      <p><strong>Page:</strong> ${escapeHtml(data.pageUrl)}</p>
    `;

    MailApp.sendEmail({
      to: RECIPIENT_EMAIL,
      subject,
      htmlBody,
      replyTo: data.email || RECIPIENT_EMAIL
    });

    return jsonResponse({ ok: true });
  } catch (error) {
    return jsonResponse({ ok: false, error: error.message });
  } finally {
    lock.releaseLock();
  }
}

function ensureHeaders(sheet) {
  if (sheet.getLastRow() > 0) return;
  sheet.appendRow([
    'Received At',
    'Form Source',
    'Name',
    'Business',
    'Email',
    'Phone',
    'Project Type',
    'Message',
    'Page URL',
    'Browser Submitted At'
  ]);
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/\n/g, '<br>');
}
```

4. Click `Save`.
5. Click `Deploy` > `New deployment`.
6. Choose type `Web app`.
7. Set `Execute as` to `Me`.
8. Set `Who has access` to `Anyone`.
9. Click `Deploy` and approve permissions.
10. Copy the Web App URL.
11. Open `assets/js/script.js` and paste it:

```js
const FORM_ENDPOINT = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';
```

12. Re-upload `index.html`, `about.html`, `portfolio.html`, `contact.html`, the `blog` folder, the `assets` folder, `sitemap.xml`, `robots.txt`, `llms.txt`, and the `docs` folder to hosting.

## Important notes

- Do not put Gmail passwords, Google API keys, or private secrets inside frontend JavaScript.
- Google Apps Script has daily email quotas, so this is best for normal business lead volume.
- If you later host on Netlify, Vercel, Cloudflare, or your own server, a serverless function is a stronger long-term backend.
- Test with your own email first. Check both the Google Sheet row and the received email.
