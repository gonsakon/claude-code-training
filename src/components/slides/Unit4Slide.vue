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
  { id: 4, view: 'reviewDemo', title: '/review 範例',                desc: '把你公司的 code review 標準寫進去，每次 review 都一致。' },
  { id: 5, view: 'commitDemo', title: '/commit 範例',                desc: '把 git diff 自動轉成符合規範的 commit message。' },
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
        <div class="w-full max-w-2xl overflow-hidden rounded-2xl border border-sky-500/30 bg-slate-950 p-5 font-mono text-sm">
          <div v-for="(f, i) in [
            { t: '.claude/',               c: 'text-slate-400', pad: 0 },
            { t: '└── skills/',            c: 'text-slate-400', pad: 0 },
            { t: '    ├── review/',        c: 'text-sky-300',   pad: 0 },
            { t: '    │   └── SKILL.md',   c: 'text-emerald-300', pad: 0 },
            { t: '    └── commit/',        c: 'text-sky-300',   pad: 0 },
            { t: '        └── SKILL.md',   c: 'text-emerald-300', pad: 0 },
          ]" :key="i" :class="[f.c, animState >= i + 1 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4']"
            class="py-0.5 transition-all"
          >{{ f.t }}</div>
        </div>
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
      <div v-if="stepData.view === 'reviewDemo'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center p-6">
        <div class="w-full max-w-2xl overflow-hidden rounded-2xl border-2 border-sky-500/50 bg-slate-950">
          <div class="border-b border-slate-800 bg-slate-900 px-4 py-2 text-xs text-slate-400">.claude/skills/review/SKILL.md</div>
          <pre class="p-5 font-mono text-xs leading-6 text-slate-300"># Code Review Skill
<span class="text-sky-300">description</span>: 當使用者說「review」時執行

## 檢查清單
1. <span class="text-emerald-300">函式不超過 30 行</span>
2. <span class="text-emerald-300">沒有 console.log 殘留</span>
3. <span class="text-emerald-300">變數命名有意義</span>
4. <span class="text-emerald-300">有錯誤處理</span>
5. <span class="text-emerald-300">沒有重複程式碼</span></pre>
        </div>
        <div class="mt-4 text-sm text-slate-400">每次 review 都依同一份標準 —— 品質穩定</div>
      </div>

      <!-- COMMIT DEMO -->
      <div v-if="stepData.view === 'commitDemo'" class="relative flex min-h-0 flex-1 flex-col items-center justify-center gap-4 p-6">
        <div class="w-full max-w-3xl overflow-hidden rounded-2xl border-2 border-sky-500/50 bg-slate-950">
          <div class="border-b border-slate-800 bg-slate-900 px-4 py-2 text-xs text-slate-400">自動產出 commit message</div>
          <div class="p-5 font-mono text-xs">
            <div class="text-slate-500">＞ 使用者：commit</div>
            <div class="mt-2 text-slate-400">1. 讀 git diff</div>
            <div class="text-slate-400">2. 分析修改內容</div>
            <div class="text-slate-400">3. 套用格式：類型(範圍)：描述</div>
            <div class="mt-3 rounded border border-emerald-500/40 bg-emerald-500/5 p-3 text-emerald-300">
              ✨ feat(bmi)：新增歷史紀錄功能
            </div>
          </div>
        </div>
        <div class="flex flex-wrap justify-center gap-2 text-xs">
          <div v-for="t in ['feat','fix','refactor','docs','test']" :key="t"
            class="rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-sky-300"
          >{{ t }}</div>
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
