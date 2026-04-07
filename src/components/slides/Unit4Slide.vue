<script setup lang="ts">
/**
 * 單元 4：Skills 封裝與重複利用
 */
import { ref, computed, watch, onMounted } from 'vue'
import InteractiveSlideTemplate from './InteractiveSlideTemplate.vue'

defineProps<{ isMobile?: boolean }>()
const emit = defineEmits<{ (e: 'complete'): void }>()

type StepView = 'intro' | 'concept' | 'structure' | 'anatomy' | 'reviewDemo' | 'commitDemo' | 'asset' | 'summary'
type Step = { id: number; view: StepView; title: string; desc: string }

const STEPS: Step[] = [
  { id: 0, view: 'intro',      title: '單元 4：把工作流封裝起來',      desc: '寫一次，全團隊用一輩子 —— 這就是 Skill。' },
  { id: 1, view: 'concept',    title: 'Skill 是什麼？',               desc: '把重複工作寫成一份檔案，Claude 自動觸發、按 SOP 執行。' },
  { id: 2, view: 'structure',  title: '.claude/skills/ 的結構',       desc: '每個 skill 一個資料夾，裡面一個 SKILL.md。' },
  { id: 3, view: 'anatomy',    title: 'SKILL.md 的三個核心',          desc: 'Description（觸發判斷）、觸發條件、執行步驟。' },
  { id: 4, view: 'reviewDemo', title: '講師帶做：/code-review',       desc: '把公司的 code review 標準寫進去，每次 review 都一致。' },
  { id: 5, view: 'commitDemo', title: '學生實作：/commit',            desc: '換你動手寫一個產生 commit message 的 skill。' },
  { id: 6, view: 'asset',      title: 'Skill = 團隊知識資產',         desc: '新人一 clone 專案，所有 SOP 自動就位。' },
  { id: 7, view: 'summary',    title: '本單元重點',                  desc: 'Skill 是給 AI 的 SOP 說明書 —— 寫越好，Claude 越強。' },
]

const currentStep = ref(0)
const animState = ref(0)
const stepData = computed(() => STEPS[currentStep.value])

onMounted(() => triggerStepAnimation())
watch(currentStep, () => {
  animState.value = 0
  setTimeout(() => triggerStepAnimation(), 100)
})
function triggerStepAnimation() {
  for (let i = 1; i <= 6; i++) setTimeout(() => { animState.value = i }, 150 + i * 220)
}
function nextStep() { if (currentStep.value < STEPS.length - 1) currentStep.value++ }
function prevStep() { if (currentStep.value > 0) currentStep.value-- }

const commitSkillSource = `---
name: commit
description: 當使用者要求產生 commit message、commit 訊息、git commit 時使用。會讀取 git diff，依團隊格式產生繁體中文的 conventional commit。
---

# Commit Message 產生器

當使用者要求 commit 時，請依照以下步驟：

## 執行步驟

1. 跑 \`git diff --staged\`（沒有 staged 就跑 \`git diff\`）讀取修改內容
2. 分析這次修改的「主要意圖」（新功能 / 修 bug / 重構 / 文件 / 測試）
3. 依下列格式產出**繁體中文** commit message
4. 如果改動涵蓋多個範圍，列出主要那一個就好

## 格式

\`\`\`
類型(範圍)：簡述
\`\`\`

## 類型對照

- \`feat\`：新功能
- \`fix\`：修 bug
- \`refactor\`：重構，不改變行為
- \`docs\`：文件
- \`test\`：測試

## 範例

- \`feat(bmi)：新增歷史紀錄功能\`
- \`fix(login)：修正 token 過期未重新登入\`
- \`refactor(api)：抽出共用 fetch 包裝\`
`

const reviewSkillSource = `---
name: code-review
description: 當使用者要求進行 JavaScript 或 TypeScript 程式碼審查時使用。適用於「幫我 review」、「檢查這段程式碼」、「有什麼問題」等請求。
---

# JavaScript Code Review

當進行程式碼審查時，請依照以下步驟進行：

## 審查重點

1. **命名規範**：變數、函式命名是否清晰且符合 camelCase
2. **錯誤處理**：是否有適當的 try-catch 或錯誤邊界處理
3. **效能問題**：是否有不必要的迴圈、重複渲染或記憶體洩漏風險
4. **安全性**：是否有 XSS、注入攻擊等潛在風險
5. **可讀性**：程式碼是否易於理解，是否需要重構

## 輸出格式

請使用以下格式回覆：

### 🔴 必須修正
- [問題描述] → [建議做法]

### 🟡 建議改善
- [問題描述] → [建議做法]

### 🟢 優點
- [值得肯定的地方]
`

const copiedKey = ref<string | null>(null)
async function copySkill(key: string, source: string) {
  try {
    await navigator.clipboard.writeText(source)
    copiedKey.value = key
    setTimeout(() => { copiedKey.value = null }, 1500)
  } catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <InteractiveSlideTemplate
    title="單元 4｜Skills 封裝與重複利用"
    subtitle="把 SOP 寫成給 AI 的說明書"
    :totalSteps="STEPS.length"
    :currentStep="currentStep"
    :stepTitle="stepData.title"
    :stepDesc="stepData.desc"
    themeColor="sky"
    @prev="prevStep"
    @next="nextStep"
    @goto="(s) => (currentStep = s)"
    @complete="emit('complete')"
  >
    <template #icon><span class="text-2xl md:text-3xl">🛠️</span></template>

    <div class="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
      <div class="pointer-events-none absolute inset-0">
        <div class="absolute left-[10%] top-[20%] h-64 w-64 rounded-full bg-sky-500/10 blur-3xl"></div>
      </div>

      <!-- INTRO -->
      <div v-if="stepData.view === 'intro'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-6">
        <div class="rounded-3xl border-2 border-sky-500/40 bg-slate-900/90 px-10 py-8 text-center shadow-2xl">
          <div class="text-6xl">🛠️</div>
          <div class="mt-3 text-4xl font-black text-white">單元 <span class="bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">4</span></div>
          <div class="mt-2 text-lg text-slate-300">Skills 封裝與重複利用</div>
          <div class="mt-1 text-sm text-slate-500">寫一次，團隊一直用</div>
        </div>
      </div>

      <!-- CONCEPT -->
      <div v-if="stepData.view === 'concept'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center gap-4 p-6">
        <div class="grid w-full max-w-4xl items-center gap-4 md:grid-cols-3">
          <div class="rounded-2xl border border-slate-700 bg-slate-900/60 p-4 text-center transition-all duration-700"
            :class="animState >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="text-3xl">🔁</div>
            <div class="mt-2 text-sm font-bold text-white">重複工作</div>
            <div class="mt-1 text-xs text-slate-400">Review / Commit / 產報表</div>
          </div>
          <div class="text-center text-3xl text-sky-400 transition-all duration-700"
            :class="animState >= 2 ? 'opacity-100' : 'opacity-0'"
          >→ 封裝 →</div>
          <div class="rounded-2xl border-2 border-sky-500/50 bg-sky-500/5 p-4 text-center transition-all duration-700"
            :class="animState >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="text-3xl">📜</div>
            <div class="mt-2 text-sm font-bold text-sky-300">SKILL.md</div>
            <div class="mt-1 text-xs text-slate-400">Claude 自動按此執行</div>
          </div>
        </div>
        <div class="max-w-xl rounded-xl border border-sky-500/30 bg-slate-900/80 px-5 py-3 text-center text-sm text-slate-300">
          不用每次貼 prompt —— 一句話觸發整套流程
        </div>
      </div>

      <!-- STRUCTURE -->
      <div v-if="stepData.view === 'structure'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-6">
        <pre class="w-full max-w-2xl overflow-hidden rounded-2xl border border-sky-500/30 bg-slate-950 p-5 font-mono text-sm leading-7"><span class="text-slate-400">.claude/
└── skills/
    ├── </span><span class="text-sky-300">code-review/</span>
<span class="text-slate-400">    │   └── </span><span class="text-emerald-300">SKILL.md</span>
<span class="text-slate-400">    └── </span><span class="text-sky-300">commit/</span>
<span class="text-slate-400">        └── </span><span class="text-emerald-300">SKILL.md</span></pre>
      </div>

      <!-- ANATOMY -->
      <div v-if="stepData.view === 'anatomy'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-6">
        <div class="grid w-full max-w-4xl gap-3 md:grid-cols-3">
          <div v-for="(c, i) in [
            { n: '1', t: 'Description', d: '一句話說明用途 —— Claude 靠這個判斷要不要觸發', ic: '🎯' },
            { n: '2', t: '觸發條件',     d: '什麼場景下使用，例如「當使用者說 review」',    ic: '⚡' },
            { n: '3', t: '執行步驟',     d: '具體 SOP，一步一步寫清楚',                    ic: '📋' },
          ]" :key="c.n"
            class="rounded-2xl border border-sky-500/30 bg-slate-900/80 p-5 transition-all duration-500"
            :class="animState >= i + 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >
            <div class="text-3xl">{{ c.ic }}</div>
            <div class="mt-2 text-xs text-slate-500">Part {{ c.n }}</div>
            <div class="text-base font-bold text-sky-300">{{ c.t }}</div>
            <div class="mt-1 text-xs text-slate-400">{{ c.d }}</div>
          </div>
        </div>
      </div>

      <!-- REVIEW DEMO -->
      <div v-if="stepData.view === 'reviewDemo'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center gap-3 p-4 md:p-6">
        <div class="w-full max-w-2xl overflow-hidden rounded-2xl border-2 border-sky-500/50 bg-slate-950 shadow-2xl">
          <div class="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-2 text-xs text-slate-400">
            <span>.claude/skills/code-review/SKILL.md</span>
            <button
              class="flex items-center gap-1 rounded border border-slate-700 bg-slate-800 px-2 py-1 text-[10px] text-slate-300 transition-all hover:border-sky-400 hover:text-sky-300"
              @click="copySkill('review', reviewSkillSource)"
            >
              <span v-if="copiedKey === 'review'" class="text-emerald-300">✓ 已複製</span>
              <span v-else>📋 複製全部</span>
            </button>
          </div>
          <pre class="max-h-[55vh] overflow-y-auto p-4 font-mono text-[10px] leading-5 text-slate-300 md:text-[11px] md:leading-5">---
<span class="text-amber-300">name</span>: code-review
<span class="text-amber-300">description</span>: 當使用者要求進行 JavaScript 或 TypeScript 程式碼審查時
  使用。適用於「幫我 review」、「檢查這段程式碼」、「有什麼問題」等請求。
---

# JavaScript Code Review

當進行程式碼審查時，請依照以下步驟進行：

## 審查重點

1. <span class="text-emerald-300">**命名規範**</span>：變數、函式命名是否清晰且符合 camelCase
2. <span class="text-emerald-300">**錯誤處理**</span>：是否有適當的 try-catch 或錯誤邊界處理
3. <span class="text-emerald-300">**效能問題**</span>：是否有不必要的迴圈、重複渲染或記憶體洩漏風險
4. <span class="text-emerald-300">**安全性**</span>：是否有 XSS、注入攻擊等潛在風險
5. <span class="text-emerald-300">**可讀性**</span>：程式碼是否易於理解，是否需要重構

## 輸出格式

請使用以下格式回覆：

### 🔴 必須修正
- [問題描述] → [建議做法]

### 🟡 建議改善
- [問題描述] → [建議做法]

### 🟢 優點
- [值得肯定的地方]</pre>
        </div>
        <div class="text-center text-xs text-slate-400">
          ✨ 關鍵在 <span class="text-amber-300">description</span>：包含<span class="text-white">語言、觸發詞、用途</span> Claude 才知道何時觸發
        </div>
      </div>

      <!-- COMMIT DEMO -->
      <div v-if="stepData.view === 'commitDemo'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center gap-3 p-4 md:p-6">
        <!-- 題詞 -->
        <div class="w-full max-w-2xl rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-center">
          <div class="text-xs text-amber-300">📝 對 Claude 說：</div>
          <div class="mt-1 font-mono text-xs text-white md:text-sm">
            「幫我建立 .claude/skills/commit/SKILL.md，<br />
            產生 commit message，繁體中文，類型(範圍)：描述」
          </div>
        </div>
        <!-- 產出的 SKILL.md -->
        <div class="w-full max-w-2xl overflow-hidden rounded-2xl border-2 border-sky-500/50 bg-slate-950 shadow-2xl">
          <div class="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-2 text-xs text-slate-400">
            <span>.claude/skills/commit/SKILL.md</span>
            <button
              class="flex items-center gap-1 rounded border border-slate-700 bg-slate-800 px-2 py-1 text-[10px] text-slate-300 transition-all hover:border-sky-400 hover:text-sky-300"
              @click="copySkill('commit', commitSkillSource)"
            >
              <span v-if="copiedKey === 'commit'" class="text-emerald-300">✓ 已複製</span>
              <span v-else>📋 複製全部</span>
            </button>
          </div>
          <pre class="max-h-[42vh] overflow-y-auto p-4 font-mono text-[10px] leading-5 text-slate-300 md:text-[11px] md:leading-5">---
<span class="text-amber-300">name</span>: commit
<span class="text-amber-300">description</span>: 當使用者要求產生 commit message、commit 訊息、git commit 時
  使用。會讀取 git diff，依團隊格式產生繁體中文的 conventional commit。
---

# Commit Message 產生器

## 執行步驟
1. 跑 <span class="text-emerald-300">git diff --staged</span> 讀取修改內容
2. 分析修改的「主要意圖」
3. 依下列格式產出**繁體中文** commit message

## 格式
<span class="text-emerald-300">類型(範圍)：簡述</span>

## 類型對照
- <span class="text-sky-300">feat</span>：新功能      - <span class="text-sky-300">fix</span>：修 bug
- <span class="text-sky-300">refactor</span>：重構  - <span class="text-sky-300">docs</span>：文件
- <span class="text-sky-300">test</span>：測試

## 範例
- feat(bmi)：新增歷史紀錄功能
- fix(login)：修正 token 過期未重新登入</pre>
        </div>
      </div>

      <!-- ASSET -->
      <div v-if="stepData.view === 'asset'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-6">
        <div class="grid w-full max-w-4xl gap-4 md:grid-cols-2">
          <div class="rounded-2xl border border-red-500/40 bg-red-500/5 p-5 transition-all duration-700"
            :class="animState >= 1 ? 'translate-x-0 opacity-100' : '-translate-x-6 opacity-0'"
          >
            <div class="text-3xl">😵</div>
            <div class="mt-2 font-bold text-red-300">沒 Skill 的團隊</div>
            <ul class="mt-2 space-y-1 text-xs text-slate-400">
              <li>• 5 個人 5 種 review 風格</li>
              <li>• Commit message 各寫各的</li>
              <li>• 新人要口頭教一遍</li>
            </ul>
          </div>
          <div class="rounded-2xl border border-emerald-500/40 bg-emerald-500/5 p-5 transition-all duration-700"
            :class="animState >= 2 ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'"
          >
            <div class="text-3xl">✨</div>
            <div class="mt-2 font-bold text-emerald-300">有 Skill 的團隊</div>
            <ul class="mt-2 space-y-1 text-xs text-slate-400">
              <li>• Clone 專案，SOP 自動就位</li>
              <li>• 全團隊品質一致</li>
              <li>• 知識寫在檔案裡，不在人腦裡</li>
            </ul>
          </div>
        </div>
        <div class="mt-5 rounded-xl border border-sky-500/30 bg-slate-900/80 px-5 py-3 text-center text-sm text-sky-200">
          Skill 是團隊的<span class="font-bold text-white">知識資產</span>，不是個人生產力工具
        </div>
      </div>

      <!-- SUMMARY -->
      <div v-if="stepData.view === 'summary'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center gap-4 p-6">
        <div class="rounded-3xl border-2 border-sky-500/50 bg-slate-900 p-6 text-center">
          <div class="text-6xl">🎯</div>
          <div class="mt-3 text-xl font-bold text-white">一句話</div>
          <div class="mt-2 text-sm text-sky-300">Skill 就是「給 AI 的說明書」</div>
        </div>
        <div class="grid w-full max-w-3xl gap-3 md:grid-cols-2">
          <div v-for="(t, i) in ['描述：Claude 判斷要不要觸發','條件：什麼場景下執行','步驟：一步一步寫清楚','團隊資產：clone 即用']" :key="t"
            class="rounded-xl border border-sky-500/30 bg-slate-900/60 p-3 text-sm text-sky-200 transition-all duration-500"
            :class="animState >= i + 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          >✓ {{ t }}</div>
        </div>
      </div>
    </div>
  </InteractiveSlideTemplate>
</template>
