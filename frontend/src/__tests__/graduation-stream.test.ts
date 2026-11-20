import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import { defineComponent, h } from 'vue';
import { afterEach, expect, test, vi } from 'vitest';
import TerminalGenerationOverlay from '@/components/TerminalGenerationOverlay.vue';
import { useGraduationDocumentStore } from '@/stores/graduation.store';

afterEach(() => vi.unstubAllGlobals());

test('任务书弹窗在完成事件前显示准备进度和每段正文', async () => {
  let controller!: ReadableStreamDefaultController<Uint8Array>;
  const cancel = vi.fn();
  const stream = new ReadableStream<Uint8Array>({
    start: value => { controller = value; },
    cancel,
  });
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
    new Response(stream, { headers: { 'Content-Type': 'text/event-stream' } }),
  ));
  const encoder = new TextEncoder();
  const send = (event: string, data: object) => {
    controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
  };

  const pinia = createPinia();
  const store = useGraduationDocumentStore(pinia);
  const wrapper = mount(defineComponent(() => () => h(TerminalGenerationOverlay, {
    visible: store.generating,
    status: store.generating ? 'generating' : 'idle',
    content: store.generationContent,
    stats: store.generationStats,
  })), { global: { plugins: [pinia] } });

  const finished = store.generateDocument(1, 'TASK_BOOK');
  try {
    await vi.waitFor(() => expect(wrapper.text()).toContain('等待响应'));

    send('progress', { phase: 'reasoning', contentText: '', reasoningText: '' });
    await vi.waitFor(() => expect(wrapper.text()).toContain('等待正文输出'));

    const first = '# 任务书\n\n第一段';
    send('progress', { phase: 'writing', contentText: first, reasoningText: '' });
    await vi.waitFor(() => expect(wrapper.get('.terminal-text').text()).toBe(first));
    expect(store.generating).toBe(true);

    const full = first + '\n\n第二段';
    send('progress', { phase: 'writing', contentText: full, reasoningText: '' });
    await vi.waitFor(() => expect(wrapper.get('.terminal-text').text()).toBe(full));
    expect(store.documents).toHaveLength(0);

    send('complete', { document: { id: 1, projectId: 1, docType: 'TASK_BOOK', content: full } });
    await expect(finished).resolves.toBe(true);
  } finally {
    wrapper.unmount();
    if (!cancel.mock.calls.length) controller.close();
  }
  expect(cancel).toHaveBeenCalledOnce();
  expect(store.documents[0]?.content).toContain('第二段');
});

test('服务端结束连接但未发送完成事件时保留现有文档', async () => {
  const store = useGraduationDocumentStore(createPinia());
  const prior = { id: 1, projectId: 1, docType: 'TASK_BOOK' as const, content: '原任务书', createdAt: '', updatedAt: '' };
  store.documents = [prior];
  const progress = { phase: 'writing', contentText: '未完成的正文', reasoningText: '' };
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
    new Response(`event: progress\ndata: ${JSON.stringify(progress)}\n\n`, {
      headers: { 'Content-Type': 'text/event-stream' },
    }),
  ));

  expect(await store.generateDocument(1, 'TASK_BOOK')).toBe(false);
  expect(store.error).toContain('未收到文档生成完成通知');
  expect(store.documents).toEqual([prior]);
});
