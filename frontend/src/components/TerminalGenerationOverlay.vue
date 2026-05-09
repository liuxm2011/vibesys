<script setup lang="ts">
import { ref, watch, nextTick, computed, onUnmounted } from 'vue'

interface Props {
  visible: boolean
  title?: string
  content: string
  status: 'generating' | 'complete' | 'idle' | 'error'
  stats?: {
    tokenCount: number
    tokensPerSecond: number
    elapsedSeconds: number
  }
  /** When true, renders the review-branded variant with expert panel styling */
  mode?: 'review' | 'generation'
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Generating Document',
  content: '',
  status: 'idle',
  mode: 'generation',
  stats: () => ({
    tokenCount: 0,
    tokensPerSecond: 0,
    elapsedSeconds: 0
  })
})

const emit = defineEmits<{
  close: []
}>()

// --- 逐字显示逻辑 ---
// SSE 流式内容已经是逐段到达的，直接同步显示即可，无需额外的 setInterval 模拟打字。
const displayLength = ref(0)

const displayContent = computed(() => props.content.slice(0, displayLength.value))

function resetDisplay() {
  displayLength.value = 0
}

function syncDisplayToContent() {
  displayLength.value = props.content.length
}

// content 变化时立即同步显示全部
watch(() => props.content, () => {
  if (props.visible && props.status === 'generating') {
    syncDisplayToContent()
  }
})

// visible 变化时重置显示
watch(() => props.visible, (isVisible) => {
  if (isVisible) {
    displayLength.value = 0
    if (props.content.length > 0) {
      syncDisplayToContent()
    }
  } else {
    resetDisplay()
  }
})

// 完成时确保显示全部内容
watch(() => props.status, (newStatus) => {
  if (newStatus === 'complete' || newStatus === 'error') {
    syncDisplayToContent()
  }
})

onUnmounted(() => {
  resetDisplay()
})

// --- 自动滚动 ---
const terminalBodyRef = ref<HTMLElement | null>(null)

function scrollToBottom() {
  nextTick(() => {
    if (terminalBodyRef.value) {
      terminalBodyRef.value.scrollTop = terminalBodyRef.value.scrollHeight
    }
  })
}

watch(() => displayContent.value, scrollToBottom)
watch(() => props.status, scrollToBottom)

// --- 状态显示 ---
const statusLabel = computed(() => {
  switch (props.status) {
    case 'generating': return '● generating'
    case 'complete': return '✓ complete'
    case 'error': return '✗ error'
    default: return '○ idle'
  }
})

const statusColor = computed(() => {
  switch (props.status) {
    case 'generating': return '#22c55e'
    case 'complete': return '#3b82f6'
    case 'error': return '#ef4444'
    default: return '#6b7280'
  }
})

// --- 格式化时间 ---
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}
</script>

<template>
  <Transition name="terminal-fade">
    <div v-if="visible" class="terminal-overlay">
      <div class="terminal-card">
        <!-- 标题栏 -->
        <div class="terminal-titlebar" :class="{ 'review-mode': mode === 'review' }">
          <div class="terminal-dots">
            <span class="dot dot-red"></span>
            <span class="dot dot-yellow"></span>
            <span class="dot dot-green"></span>
          </div>
          <span class="terminal-title">{{ title }}</span>
          <span v-if="mode === 'review'" class="review-badge">
            Expert Panel
          </span>
          <button class="terminal-close-btn" @click="emit('close')" title="关闭">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 2.5L9.5 9.5M9.5 2.5L2.5 9.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <!-- 状态栏 -->
        <div class="terminal-statusbar">
          <span class="status-badge" :style="{ color: statusColor }">
            {{ statusLabel }}
          </span>
          <div class="stats-group">
            <span class="stat-item">
              <span class="stat-label">tokens</span>
              <span class="stat-value">{{ stats.tokenCount.toLocaleString() }}</span>
            </span>
            <span class="stat-divider">│</span>
            <span class="stat-item">
              <span class="stat-label">speed</span>
              <span class="stat-value">{{ stats.tokensPerSecond.toFixed(1) }} t/s</span>
            </span>
            <span class="stat-divider">│</span>
            <span class="stat-item">
              <span class="stat-label">elapsed</span>
              <span class="stat-value">{{ formatTime(stats.elapsedSeconds) }}</span>
            </span>
          </div>
        </div>

        <!-- 终端内容区 -->
        <div ref="terminalBodyRef" class="terminal-body">
          <div v-if="displayContent" class="terminal-text" v-text="displayContent"></div>
          <div v-else-if="status === 'generating'" class="terminal-placeholder">
            <span class="prompt">❯ </span>
            <span>AI 正在启动流式生成...</span>
          </div>
          <div v-if="status === 'generating' && displayContent" class="typing-indicator">
            <span class="cursor">█</span>
          </div>
          <div v-if="!displayContent && status === 'idle'" class="terminal-placeholder">
            <span class="prompt">❯ </span>
            <span>Waiting for AI response...</span>
          </div>
          <div v-if="status === 'complete' && displayContent" class="complete-marker">
            <span class="prompt">❯ </span>
            <span class="success-text">Generation complete. Document ready.</span>
          </div>
          <div v-if="status === 'error'" class="error-marker">
            <span class="prompt">❯ </span>
            <span class="error-text">Generation failed. Please try again.</span>
          </div>
        </div>

        <!-- 底部输入行（装饰） -->
        <div class="terminal-footer">
          <span class="prompt">❯ </span>
          <span class="footer-text" v-if="status === 'generating'">AI is writing...</span>
          <span class="footer-text" v-else-if="status === 'complete'">Done</span>
          <span class="footer-text" v-else></span>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* 卡片容器 */
.terminal-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(100%, 820px);
  z-index: 50;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #2a2a3e;
  box-shadow:
    0 20px 60px -15px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.03);
  background: #0d1117;
}

.terminal-card {
  display: flex;
  flex-direction: column;
  font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', 'Cascadia Code', ui-monospace, monospace;
}

/* 标题栏 */
.terminal-titlebar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: #161b22;
  border-bottom: 1px solid #21262d;
  user-select: none;
}

.terminal-titlebar.review-mode {
  background: linear-gradient(135deg, #1a1025 0%, #161b22 60%, #0f2027 100%);
  border-bottom-color: #3b2952;
}

.review-badge {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #a78bfa;
  background: rgba(167, 139, 250, 0.1);
  border: 1px solid rgba(167, 139, 250, 0.25);
  border-radius: 4px;
  padding: 2px 8px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.terminal-dots {
  display: flex;
  gap: 6px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}

.dot-red { background: #ff5f57; }
.dot-yellow { background: #febc2e; }
.dot-green { background: #28c840; }

.terminal-title {
  flex: 1;
  font-size: 13px;
  font-weight: 500;
  color: #8b949e;
  text-align: center;
  margin-left: -44px; /* offset dots width for center */
}

.terminal-close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: #8b949e;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
}

.terminal-close-btn:hover {
  background: #21262d;
  color: #f0f6fc;
}

/* 状态栏 */
.terminal-statusbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background: #0d1117;
  border-bottom: 1px solid #21262d;
  font-size: 12px;
}

.status-badge {
  font-weight: 600;
  letter-spacing: 0.02em;
}

.stats-group {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #8b949e;
}

.stat-item {
  display: flex;
  gap: 6px;
  align-items: baseline;
}

.stat-label {
  color: #484f58;
  font-size: 11px;
}

.stat-value {
  color: #c9d1d9;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}

.stat-divider {
  color: #21262d;
}

/* 终端内容区 */
.terminal-body {
  min-height: 280px;
  max-height: 400px;
  padding: 16px;
  overflow-y: auto;
  overflow-x: hidden;
  background: #0d1117;
  font-size: 13px;
  line-height: 1.65;
  color: #e6edf3;
  white-space: pre-wrap;
  word-break: break-word;
}

/* 自定义滚动条 */
.terminal-body::-webkit-scrollbar {
  width: 6px;
}

.terminal-body::-webkit-scrollbar-track {
  background: transparent;
}

.terminal-body::-webkit-scrollbar-thumb {
  background: #30363d;
  border-radius: 3px;
}

.terminal-body::-webkit-scrollbar-thumb:hover {
  background: #484f58;
}

.terminal-text {
  color: #e6edf3;
}

/* 光标 */
.typing-indicator {
  display: inline;
}

.cursor {
  color: #22c55e;
  animation: cursor-blink 0.8s infinite;
}

@keyframes cursor-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* 占位/状态提示 */
.terminal-placeholder,
.complete-marker,
.error-marker {
  display: flex;
  align-items: center;
  gap: 0;
  font-size: 13px;
}

.prompt {
  color: #22c55e;
  font-weight: 700;
  margin-right: 8px;
}

.success-text {
  color: #22c55e;
  font-weight: 500;
}

.error-text {
  color: #f85149;
  font-weight: 500;
}

/* 底部 */
.terminal-footer {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  background: #161b22;
  border-top: 1px solid #21262d;
  font-size: 12px;
}

.footer-text {
  color: #484f58;
  font-style: italic;
}

/* 过渡动画 */
.terminal-fade-enter-active {
  transition: all 0.3s ease-out;
}

.terminal-fade-leave-active {
  transition: all 0.2s ease-in;
}

.terminal-fade-enter-from,
.terminal-fade-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.98);
}
</style>
