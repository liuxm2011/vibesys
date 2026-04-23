<script setup lang="ts">
import { computed } from 'vue';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

interface Props {
  content: string;
}

const props = defineProps<Props>();

marked.setOptions({
  breaks: true,
  gfm: true,
});

const renderedHtml = computed(() => {
  const raw = marked.parse(props.content) as string;
  return DOMPurify.sanitize(raw);
});
</script>

<template>
  <div class="markdown-preview-container">
    <div class="markdown-preview-body" v-html="renderedHtml" />
  </div>
</template>

<style scoped>
.markdown-preview-container {
  height: 100%;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}

.markdown-preview-container::-webkit-scrollbar {
  width: 6px;
}

.markdown-preview-container::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 10px;
}

.markdown-preview-body {
  padding: 20px 24px;
  font-size: 14px;
  line-height: 1.7;
  color: #334155;
}

/* Headings */
.markdown-preview-body :deep(h1) {
  font-size: 1.6em;
  font-weight: 700;
  color: #1e293b;
  margin: 24px 0 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e2e8f0;
}

.markdown-preview-body :deep(h2) {
  font-size: 1.4em;
  font-weight: 700;
  color: #334155;
  margin: 20px 0 10px;
  padding-bottom: 6px;
  border-bottom: 1px solid #f1f5f9;
}

.markdown-preview-body :deep(h3) {
  font-size: 1.2em;
  font-weight: 700;
  color: #475569;
  margin: 16px 0 8px;
}

.markdown-preview-body :deep(h4) {
  font-size: 1.05em;
  font-weight: 700;
  color: #475569;
  margin: 12px 0 6px;
}

/* Paragraphs */
.markdown-preview-body :deep(p) {
  margin: 0 0 12px;
}

/* Lists */
.markdown-preview-body :deep(ul),
.markdown-preview-body :deep(ol) {
  padding-left: 24px;
  margin: 0 0 12px;
}

.markdown-preview-body :deep(li) {
  margin: 4px 0;
}

.markdown-preview-body :deep(li > ul),
.markdown-preview-body :deep(li > ol) {
  margin: 4px 0;
}

/* Inline styles */
.markdown-preview-body :deep(strong) {
  font-weight: 700;
  color: #1e293b;
}

.markdown-preview-body :deep(em) {
  font-style: italic;
}

.markdown-preview-body :deep(a) {
  color: #4f46e5;
  text-decoration: underline;
}

.markdown-preview-body :deep(a:hover) {
  color: #3730a3;
}

/* Code */
.markdown-preview-body :deep(code) {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9em;
  background-color: #f1f5f9;
  color: #7c3aed;
  padding: 2px 6px;
  border-radius: 4px;
}

.markdown-preview-body :deep(pre) {
  background-color: #1e293b;
  border-radius: 8px;
  padding: 16px 20px;
  margin: 0 0 16px;
  overflow-x: auto;
}

.markdown-preview-body :deep(pre code) {
  background-color: transparent;
  color: #e2e8f0;
  padding: 0;
  font-size: 13px;
  line-height: 1.6;
}

/* Blockquotes */
.markdown-preview-body :deep(blockquote) {
  border-left: 4px solid #4f46e5;
  background-color: #f8fafc;
  margin: 0 0 12px;
  padding: 12px 16px;
  color: #64748b;
}

.markdown-preview-body :deep(blockquote p) {
  margin: 0;
}

/* Tables */
.markdown-preview-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 0 0 16px;
  font-size: 13px;
}

.markdown-preview-body :deep(th) {
  background-color: #f8fafc;
  font-weight: 700;
  color: #334155;
  text-align: left;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
}

.markdown-preview-body :deep(td) {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  color: #475569;
}

.markdown-preview-body :deep(tr:nth-child(even)) {
  background-color: #fafbfc;
}

/* Horizontal rule */
.markdown-preview-body :deep(hr) {
  border: none;
  border-top: 1px solid #e2e8f0;
  margin: 20px 0;
}

/* Images */
.markdown-preview-body :deep(img) {
  max-width: 100%;
  border-radius: 8px;
  margin: 8px 0;
}
</style>
