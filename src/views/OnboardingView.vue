<script setup lang="ts">
/** 新手引導頁：下載工具包 → 解壓 → 打開資料夾 → 開始練習。 */
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isDark = ref(localStorage.getItem('prompts-theme') === 'dark')
function toggleTheme() {
  isDark.value = !isDark.value
  localStorage.setItem('prompts-theme', isDark.value ? 'dark' : 'light')
}
function start() {
  router.push({ name: 'practice' })
}

const ZIP = 'https://gonsakon.github.io/claude-code-training/practice-pack.zip'
</script>

<template>
  <div :class="{ dark: isDark }">
    <div class="min-h-screen bg-stone-50 transition-colors dark:bg-slate-900">
      <div class="mx-auto max-w-2xl px-4 py-10 md:px-8">
        <header class="mb-8">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h1 class="text-2xl font-bold text-stone-900 dark:text-white">🐣 AI 工作術體驗營</h1>
              <p class="mt-1 text-sm text-stone-500 dark:text-slate-400">把煩的事變成會自動跑的 Skill</p>
            </div>
            <button
              class="shrink-0 rounded-full border border-stone-300 px-3 py-1.5 text-sm text-stone-600 transition-colors hover:bg-stone-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
              @click="toggleTheme"
            >
              {{ isDark ? '☀️ 淺色' : '🌙 深色' }}
            </button>
          </div>
        </header>

        <div class="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
          開始練習前，先花一分鐘把「練習包」下載、打開。這三步做完，後面就一路複製貼上。
        </div>

        <div class="mt-6 space-y-4">
          <div class="rounded-xl border border-amber-200 bg-white p-5 dark:border-amber-500/30 dark:bg-slate-800">
            <p class="text-base font-bold text-stone-900 dark:text-white">① 下載練習包</p>
            <a
              :href="ZIP"
              class="mt-3 inline-block rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-amber-600"
            >⬇ 下載 practice-pack.zip</a>
          </div>

          <div class="rounded-xl border border-stone-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
            <p class="text-base font-bold text-stone-900 dark:text-white">② 解壓縮</p>
            <p class="mt-1.5 text-sm text-stone-600 dark:text-slate-300">
              Mac 雙擊 zip 就會解開；Windows 對著檔案右鍵「解壓縮全部」。會得到一個
              <b>practice-pack</b> 資料夾。
            </p>
          </div>

          <div class="rounded-xl border border-stone-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
            <p class="text-base font-bold text-stone-900 dark:text-white">③ 用 Claude 打開這個資料夾</p>
            <p class="mt-1.5 text-sm text-stone-600 dark:text-slate-300">
              打開 Claude 的 Code 分頁 →「選擇資料夾」→ 選剛剛解壓出來的
              <b>practice-pack</b>。Claude 視窗左上顯示這個名字，就準備好了。
            </p>
          </div>
        </div>

        <button
          class="mt-8 w-full rounded-xl bg-red-600 py-4 text-lg font-bold text-white transition-colors hover:bg-red-700"
          @click="start"
        >
          準備好了，開始練習 →
        </button>
        <p class="mt-3 text-center text-xs text-stone-400 dark:text-slate-500">
          全程不用寫程式 · 卡住就舉手找講師
        </p>
      </div>
    </div>
  </div>
</template>
