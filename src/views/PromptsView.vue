<script setup lang="ts">
/**
 * 題詞小抄：學員上課用的複製貼上頁
 * 內容來源：public/prompts/prompts.json（改題詞只動 JSON，不動這頁）
 * 預設淺色（白天教室），右上角可切深色。
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'

interface PromptStep {
  hint: string
  text: string
}

interface Exercise {
  id: string
  title: string
  folder: string
  scenario: string
  steps: PromptStep[]
  done: string
}

interface PromptsData {
  updated: string
  exercises: Exercise[]
}

const data = ref<PromptsData | null>(null)
const loadError = ref(false)
const activeId = ref('')
const copiedKey = ref('')
const isDark = ref(localStorage.getItem('prompts-theme') === 'dark')
const doneIds = ref<Set<string>>(
  new Set(JSON.parse(localStorage.getItem('prompts-done') ?? '[]')),
)

function toggleDone(id: string) {
  if (doneIds.value.has(id)) doneIds.value.delete(id)
  else doneIds.value.add(id)
  doneIds.value = new Set(doneIds.value)
  localStorage.setItem('prompts-done', JSON.stringify([...doneIds.value]))
}

let observer: IntersectionObserver | null = null

function toggleTheme() {
  isDark.value = !isDark.value
  localStorage.setItem('prompts-theme', isDark.value ? 'dark' : 'light')
}

async function loadPrompts() {
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}prompts/prompts.json?v=${Date.now()}`)
    data.value = await res.json()
    activeId.value = data.value?.exercises[0]?.id ?? ''
    requestAnimationFrame(setupObserver)
  } catch {
    loadError.value = true
  }
}

function setupObserver() {
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) activeId.value = entry.target.id
      }
    },
    { rootMargin: '-20% 0px -70% 0px' },
  )
  document.querySelectorAll('[data-ex-section]').forEach((el) => observer?.observe(el))
}

function scrollToExercise(id: string) {
  activeId.value = id
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

async function copyPrompt(text: string, key: string) {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    const ta = document.createElement('textarea')
    ta.value = text
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    ta.remove()
  }
  copiedKey.value = key
  setTimeout(() => {
    if (copiedKey.value === key) copiedKey.value = ''
  }, 2000)
}

onMounted(loadPrompts)
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div :class="{ dark: isDark }">
    <div class="min-h-screen bg-stone-50 transition-colors dark:bg-slate-900">
      <div class="mx-auto flex max-w-5xl gap-8 px-4 py-8 md:px-8">
        <!-- 左側錨點選單（桌機） -->
        <aside v-if="data" class="hidden w-52 shrink-0 md:block">
          <nav class="sticky top-8">
            <p class="mb-3 text-xs tracking-widest text-stone-400 dark:text-slate-500">
              練習目錄（{{ doneIds.size }}/{{ data.exercises.length }} 完成）
            </p>
            <ul class="space-y-1">
              <li v-for="(ex, i) in data.exercises" :key="ex.id">
                <div
                  class="flex w-full items-center gap-2 rounded-lg px-2 py-2 transition-colors"
                  :class="
                    activeId === ex.id
                      ? 'bg-red-50 dark:bg-red-500/15'
                      : 'hover:bg-stone-100 dark:hover:bg-slate-800'
                  "
                >
                  <button
                    class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-colors"
                    :class="
                      doneIds.has(ex.id)
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : 'border-stone-300 text-transparent hover:border-emerald-400 dark:border-slate-600'
                    "
                    :title="doneIds.has(ex.id) ? '取消完成' : '標記完成'"
                    @click.stop="toggleDone(ex.id)"
                  >
                    ✓
                  </button>
                  <button
                    class="flex-1 text-left text-sm"
                    :class="[
                      activeId === ex.id
                        ? 'font-bold text-red-600 dark:text-red-400'
                        : 'text-stone-500 hover:text-stone-800 dark:text-slate-400 dark:hover:text-slate-200',
                      doneIds.has(ex.id) ? 'line-through opacity-60' : '',
                    ]"
                    @click="scrollToExercise(ex.id)"
                  >
                    {{ i }}. {{ ex.title }}
                  </button>
                </div>
              </li>
            </ul>
          </nav>
        </aside>

        <!-- 主內容 -->
        <main class="min-w-0 flex-1">
          <header class="mb-6">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h1 class="text-2xl font-bold text-stone-900 dark:text-white">🐣 題詞小抄</h1>
                <p class="mt-1 text-sm text-stone-500 dark:text-slate-400">
                  AI 工作術體驗營 · 把煩的事變會自動跑的 Skill
                </p>
              </div>
              <button
                class="shrink-0 rounded-full border border-stone-300 px-3 py-1.5 text-sm text-stone-600 transition-colors hover:bg-stone-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
                @click="toggleTheme"
              >
                {{ isDark ? '☀️ 淺色' : '🌙 深色' }}
              </button>
            </div>
            <div
              class="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-900 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200"
            >
              用法：找到現在的練習 → 按「複製」→ 回到 Claude 貼上送出，不用自己打字。
            </div>
          </header>

          <!-- 手機版錨點列 -->
          <nav
            v-if="data"
            class="sticky top-0 z-10 -mx-4 mb-6 bg-stone-50/95 px-4 py-2 backdrop-blur dark:bg-slate-900/95 md:hidden"
          >
            <div class="flex gap-2 overflow-x-auto pb-1">
              <button
                v-for="(ex, i) in data.exercises"
                :key="ex.id"
                class="shrink-0 rounded-full px-4 py-1.5 text-sm transition-colors"
                :class="
                  activeId === ex.id
                    ? 'bg-red-600 font-bold text-white'
                    : 'bg-stone-200 text-stone-600 dark:bg-slate-800 dark:text-slate-300'
                "
                @click="scrollToExercise(ex.id)"
              >
                <span v-if="doneIds.has(ex.id)" class="mr-1 text-emerald-400">✓</span>{{ i }}. {{ ex.title }}
              </button>
            </div>
          </nav>

          <p
            v-if="loadError"
            class="rounded-xl bg-red-50 px-4 py-3 text-red-700 dark:bg-red-500/10 dark:text-red-300"
          >
            題詞載入失敗，請重新整理，或舉手找講師。
          </p>
          <p v-else-if="!data" class="text-stone-500 dark:text-slate-400">題詞載入中…</p>

          <template v-else>
            <section
              v-for="(ex, i) in data.exercises"
              :id="ex.id"
              :key="ex.id"
              data-ex-section
              class="mb-12 scroll-mt-16"
            >
              <h2 class="text-xl font-bold text-stone-900 dark:text-white">{{ i }}. {{ ex.title }}</h2>
              <p v-if="ex.folder" class="mt-1 text-xs text-stone-400 dark:text-slate-500">📁 資料夾：{{ ex.folder }}</p>
              <p class="mt-2 text-sm text-stone-600 dark:text-slate-300">{{ ex.scenario }}</p>

              <div
                v-for="(step, si) in ex.steps"
                :key="si"
                class="mt-4 rounded-xl border border-stone-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:shadow-none"
              >
                <p class="text-xs text-stone-500 dark:text-slate-400">
                  <span class="mr-2 rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
                    步驟 {{ si + 1 }}
                  </span>
                  {{ step.hint }}
                </p>
                <p
                  class="mt-3 rounded-lg border border-dashed border-stone-300 bg-stone-100 px-3 py-2.5 text-[15px] leading-relaxed text-stone-800 dark:border-slate-600 dark:bg-slate-900/70 dark:text-slate-100"
                >
                  {{ step.text }}
                </p>
                <button
                  class="mt-3 w-full rounded-lg py-2.5 text-sm font-bold tracking-widest text-white transition-colors"
                  :class="
                    copiedKey === `${ex.id}-${si}`
                      ? 'bg-emerald-500'
                      : 'bg-red-600 hover:bg-red-500'
                  "
                  @click="copyPrompt(step.text, `${ex.id}-${si}`)"
                >
                  {{ copiedKey === `${ex.id}-${si}` ? '✓ 已複製，回 Claude 貼上' : '複製' }}
                </button>
              </div>

              <div
                class="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200"
              >
                <span class="font-bold">✓ 做完你會看到：</span>{{ ex.done }}
              </div>
              <button
                class="mt-3 rounded-lg px-4 py-2 text-sm font-bold transition-colors"
                :class="
                  doneIds.has(ex.id)
                    ? 'bg-emerald-500 text-white'
                    : 'border border-stone-300 text-stone-500 hover:border-emerald-400 hover:text-emerald-600 dark:border-slate-600 dark:text-slate-300'
                "
                @click="toggleDone(ex.id)"
              >
                {{ doneIds.has(ex.id) ? '✓ 這題完成了！' : '做完了？點我打勾' }}
              </button>
            </section>

            <footer
              class="mt-12 border-t border-stone-200 pt-4 text-center text-xs text-stone-400 dark:border-slate-800 dark:text-slate-500"
            >
              題詞版本 {{ data.updated }} · 六角學院內訓
            </footer>
          </template>
        </main>
      </div>
    </div>
  </div>
</template>
