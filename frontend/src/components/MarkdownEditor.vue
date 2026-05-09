<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue';
import { Codemirror } from 'vue-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { EditorView } from '@codemirror/view';
import { tags as t } from '@lezer/highlight';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';

interface Props {
  content: string;
  documentId: number;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
});

const emit = defineEmits<{
  save: [documentId: number, content: string];
  change: [content: string];
}>();

const localContent = ref(props.content);
let debounceTimer: any = null;

// Custom Light Theme for CM6 to match our UI
const myTheme = EditorView.theme({
  "&": {
    height: "100%",
    fontSize: "14px",
    backgroundColor: "#ffffff"
  },
  ".cm-content": {
    fontFamily: "'JetBrains Mono', monospace",
    padding: "20px"
  },
  ".cm-gutters": {
    backgroundColor: "#f8fafc",
    color: "#94a3b8",
    border: "none"
  },
  "&.cm-focused": {
    outline: "none"
  }
});

const myHighlightStyle = HighlightStyle.define([
  { tag: t.heading1, fontSize: "1.6em", fontWeight: "bold", color: "#1e293b" },
  { tag: t.heading2, fontSize: "1.4em", fontWeight: "bold", color: "#334155" },
  { tag: t.heading3, fontSize: "1.2em", fontWeight: "bold", color: "#475569" },
  { tag: t.strong, fontWeight: "bold" },
  { tag: t.emphasis, fontStyle: "italic" },
  { tag: t.link, color: "#4f46e5", textDecoration: "underline" },
  { tag: t.comment, color: "#94a3b8" },
  { tag: t.variableName, color: "#7c3aed" },
  { tag: t.string, color: "#10b981" },
  { tag: t.keyword, color: "#4f46e5", fontWeight: "bold" }
]);

const extensions = [
  markdown(),
  myTheme,
  syntaxHighlighting(myHighlightStyle),
  EditorView.lineWrapping
];

watch(() => props.content, (newContent) => {
  if (newContent !== localContent.value) {
    localContent.value = newContent;
  }
});

function handleChange(value: string): void {
  localContent.value = value;
  emit('change', value);

  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    emit('save', props.documentId, value);
  }, 800);
}

onUnmounted(() => {
  if (debounceTimer) clearTimeout(debounceTimer);
});
</script>

<template>
  <div class="markdown-editor-container">
    <Codemirror
      v-model="localContent"
      :extensions="extensions"
      :disabled="disabled"
      placeholder="开始编写文档内容..."
      @change="handleChange"
      class="custom-cm-editor"
    />
  </div>
</template>

<style scoped>
.markdown-editor-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.custom-cm-editor {
  height: 100%;
}

:deep(.cm-editor) {
  height: 100% !important;
}

:deep(.cm-scroller) {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}

:deep(.cm-scroller::-webkit-scrollbar) {
  width: 6px;
}

:deep(.cm-scroller::-webkit-scrollbar-thumb) {
  background-color: #cbd5e1;
  border-radius: 10px;
}
</style>