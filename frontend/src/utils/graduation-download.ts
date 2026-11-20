import DOMPurify from 'dompurify';
import { marked } from 'marked';

// Shared helpers for downloading a graduation document as a standalone HTML
// file. Used by both ProjectDetail.vue and GraduationDashboard.vue.

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function buildGraduationDownloadHtml(projectName: string, docName: string, content: string): string {
  const bodyContent = content.trim().startsWith('<')
    ? DOMPurify.sanitize(content)
    : DOMPurify.sanitize(marked.parse(content, { gfm: true, breaks: true, async: false }));
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(projectName)} - ${escapeHtml(docName)}</title>
  <style>
    body { margin: 0; padding: 40px; background: #f8fafc; color: #1f2937; font-family: SimSun, "Songti SC", serif; }
    .page { max-width: 820px; min-height: 1120px; margin: 0 auto; padding: 48px 56px; background: #fff; box-shadow: 0 8px 30px rgba(15, 23, 42, 0.08); }
    h1, h2, h3 { color: #111827; }
    h1 { text-align: center; }
    h1 + p { text-align: center; }
    h2, h3 { break-after: avoid; }
    p, li { font-size: 14px; line-height: 1.8; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th, td { border: 1px solid #d1d5db; padding: 8px 10px; text-align: left; }
    @page { size: A4; margin: 18mm; }
    @media print {
      body { padding: 0; background: #fff; }
      .page { box-shadow: none; min-height: auto; padding: 0; }
      tr { break-inside: avoid; }
    }
  </style>
</head>
<body>
  <main class="page">
    ${bodyContent}
  </main>
</body>
</html>`;
}
