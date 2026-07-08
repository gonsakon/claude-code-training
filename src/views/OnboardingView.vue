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

const ZIP = 'https://gonsakon.github.io/claude-code-training/ai-workskill-camp.zip'
const base = import.meta.env.BASE_URL
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
            >⬇ 下載 ai-workskill-camp.zip</a>
          </div>

          <div class="rounded-xl border border-stone-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
            <p class="text-base font-bold text-stone-900 dark:text-white">② 解壓縮</p>
            <p class="mt-1.5 text-sm text-stone-600 dark:text-slate-300">
              Mac 雙擊 zip 就會解開；Windows 對著檔案右鍵「解壓縮全部」。會得到一個
              <b>ai-workskill-camp</b> 資料夾。
            </p>
          </div>

          <div class="rounded-xl border border-stone-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
            <p class="text-base font-bold text-stone-900 dark:text-white">③ 用 Claude 打開這個資料夾</p>
            <p class="mt-1.5 text-sm text-stone-600 dark:text-slate-300">
              打開 Claude 的 Code 分頁 →「選擇資料夾」→ 選剛剛解壓出來的
              <b>ai-workskill-camp</b>。Claude 視窗左上顯示這個名字，就準備好了。
            </p>
          </div>
        </div>

        <div class="mt-6 rounded-xl border border-sky-200 bg-sky-50 p-5 dark:border-sky-500/30 dark:bg-sky-500/10">
          <p class="text-base font-bold text-sky-900 dark:text-sky-200">④ 只有最後一關才要：安裝 Node.js</p>
          <p class="mt-1.5 text-sm text-sky-800/90 dark:text-sky-200/80">
            前面每一關都用不到，先不用管。只有最後一關「寫程式腳本」，AI 會幫你寫一支小程式、當場跑給你看——
            那需要電腦先裝好 Node.js（你一樣不用自己寫程式，只是讓 AI 寫的程式跑得起來）。
          </p>
          <a
            href="https://nodejs.org/zh-tw/download"
            target="_blank"
            rel="noopener"
            class="mt-3 inline-block rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-sky-700"
          >⬇ 到 nodejs.org 下載 LTS 版（繁中頁）</a>
          <p class="mt-3 text-xs text-sky-800/90 dark:text-sky-200/80">
            ⚠️ 下載頁上半部有一堆終端機指令，<b>那些完全不用理</b>。<br />
            <b>Mac</b>：直接點頁面左下角綠色的「<b>macOS 安裝程式 (.pkg)</b>」（見下圖）。<br />
            <b>Windows</b>：把最上面「取得適用於」改成 Windows，再點下面的安裝程式。
          </p>
          <img
            :src="base + 'img/node-pkg-download.png'"
            alt="Node.js 下載頁：點左下角綠色的 macOS 安裝程式 .pkg"
            class="mt-3 w-full rounded-lg border border-sky-200 dark:border-sky-500/30"
          />
          <p class="mt-2 text-xs text-sky-800/80 dark:text-sky-200/70">
            下載後雙擊安裝檔一路「繼續／Next」到底即可；裝完重開 Claude 桌面版就生效。
          </p>
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
