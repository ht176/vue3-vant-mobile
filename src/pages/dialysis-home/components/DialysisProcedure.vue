<template>
  <div class="flex flex-col overflow-hidden">
    <div class="pos-relative py-2">
      <ul class="step-div flex justify-around">
        <li v-for="(step, index) in getActionList" :key="index" class="flex flex-col items-center" :class="cureData[step.isDone] ? 'step-done-div' : ''" @click="handleStepClick(step)">
          <div class="step-div-index">
            {{ (index + 1) }}
          </div>
          <div class="mt-2 pb-2" :class="selectStep === step.child ? 'step-active' : ''">
            {{ step.name }}
          </div>
        </li>
      </ul>
    </div>
    <div class="flex-1 overflow-auto p-1">
      <component :is="selectComponent" :cure-data="cureData" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { CureTodayView } from '@/services/CureServiceProxies'
import { useAppStore } from '@/stores'
import { showNotify } from 'vant'

const { cureData } = defineProps({
  cureData: CureTodayView,
})

const { getParametersValue } = useAppStore()

interface Step {
  name: string
  show: boolean
  action: number
  child: string
  isDone: string
  canDo: string
  comp?: Component
}

const stepList = reactive<Step[]>([
  { name: '透前测量', show: true, action: 1, child: 'Signin', isDone: 'hasMeasureBefore', canDo: 'allowMeasureBefore', comp: markRaw(defineAsyncComponent(() => import('./Signin.vue'))) },
  { name: '透析评估', show: true, action: 12, child: 'DialysisEvaluation', isDone: 'hasAssementDialysis', canDo: 'allowAssementDialysis' },
  { name: '制定处方', show: true, action: 2, child: 'MakePrescription', isDone: 'hasEnactBefore', canDo: 'allowEnactBefore' },
  { name: '确认处方', show: true, action: 3, child: 'ConfirmPrescription', isDone: 'hasCheckBefore', canDo: 'allowCheckBefore' },
  { name: '透前评估', show: true, action: 4, child: 'BeforeDialysisEvaluation', isDone: 'hasAssementBefore', canDo: 'allowAssementBefore' },
  { name: '透析上机', show: true, action: 5, child: 'OperateComputer', isDone: 'hasOnMiddle', canDo: 'allowOnMiddle' },
  { name: '交叉核对', show: true, action: 6, child: 'CrossCheck', isDone: 'hasVerifyMiddle', canDo: 'allowVerifyMiddle' },
  { name: '透中监测', show: true, action: 7, child: 'Monitoring', isDone: 'hasMonitorMiddle', canDo: 'allowMonitorMiddle' },
  { name: '下机', show: true, action: 8, child: 'OffAfter', isDone: 'hasOffAfter', canDo: 'allowOffAfter' },
  { name: '消毒', show: true, action: 11, child: 'Disinfect', isDone: 'hasDisinfectAfter', canDo: 'allowDisinfectAfter' },
  { name: '透后评估', show: true, action: 9, child: 'AfterDialysisEvaluation', isDone: 'hasAssementAfter', canDo: 'allowAssementAfter' },
  { name: '透后小结', show: true, action: 10, child: 'AfterSummary', isDone: 'hasSummaryAfter', canDo: 'allowSummaryAfter' },
])

onMounted(() => {
  initLoad()
})

function initLoad() {
  const param = getParametersValue('CUREFLOW.CHECK.PRESCRIPTION')
  stepList.find(x => x.action === 3).show = !(param === '0')
}
const getActionList = computed(() => {
  return stepList.filter(x => x.show)
})

const selectStep = ref('Signin')
function handleStepClick(val: Step) {
  if (cureData[val.isDone] || cureData[val.canDo]) {
    selectStep.value = val.child
  }
  else {
    showNotify({ type: 'danger', message: `${val.name}节点暂不可用，请先完成之前的流程` })
  }
}
const selectComponent = computed(() => {
  return stepList.find(x => x.child === selectStep.value)?.comp
})
</script>

<style scoped lang="less">
.step-div::before {
  content: '';
  width: 89%;
  height: 2px;
  background: #666666;
  position: absolute;
  top: 18px;
  z-index: -1;
}
.step-div-index {
  width: 22px;
  height: 22px;
  line-height: 22px;
  border-radius: 100px;
  text-align: center;
  border: 1px solid #bcbcbc;
  background: #fff;
}
.step-done-div {
  color: #409eff;
  .step-div-index {
    border: 1px solid #409eff;
  }
}
.step-active {
  border-bottom: 2px solid #409eff;
}
</style>
