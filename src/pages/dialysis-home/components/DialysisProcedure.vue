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
    <div v-loading="loading" class="flex-1 overflow-auto">
      <div>
        <component :is="selectComponent" ref="componentRef" :cure-data="cureData" :step-type="selectStep" @hanlde-change-loading="hanldeChangeLoading" />
      </div>
    </div>
    <div class="flex justify-end">
      <el-button v-if="cureData.allowSignedBefore || cureData.allowMeasureBefore" type="primary" size="large" @click="handleSaveClick">
        确定
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MeasureCureBeforeEditModel } from '@/services/CureServiceProxies'
import { CureServiceProxy, CureTodayView } from '@/services/CureServiceProxies'
import { useAppStore } from '@/stores'
import { convertDialysisUnit } from '@/utils/dialysis'
import { showNotify } from 'vant'

const { cureData } = defineProps({
  cureData: CureTodayView,
})
const newCureData = ref<CureTodayView>()

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
  { name: '制定处方', show: true, action: 2, child: 'MakePrescription', isDone: 'hasEnactBefore', canDo: 'allowEnactBefore', comp: markRaw(defineAsyncComponent(() => import('./Prescription.vue'))) },
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

const componentRef = ref(null)
const loading = ref(false)
onMounted(() => {
  initLoad()
})

async function initLoad() {
  await getCureStatusData()
  const param = getParametersValue('CUREFLOW.CHECK.PRESCRIPTION')
  stepList.find(x => x.action === 3).show = !(param === '0')
}
/** 查询当前流程节点信息 */
async function getCureStatusData() {
  const cureServiceProxy = new CureServiceProxy()
  const { success, data } = await cureServiceProxy.cureStatus(cureData.cureRecordId || cureData.cureScheduleId)
  if (success) {
    newCureData.value = new CureTodayView({ ...cureData, ...data, timeOn: data.timeOn as unknown as string })
  }
}
/** 所有可用节点 */
const getActionList = computed(() => {
  return stepList.filter(x => x.show)
})
/** 当前流程节点 */
const selectStep = ref('Signin')
/** 切换流程节点 */
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
/** 流程保存 */
async function handleSaveClick() {
  if (componentRef.value) {
    const resForm = await componentRef.value.handleSaveForm()
    let res = false
    if (resForm) {
      switch (selectStep.value) {
        case 'Signin':
          res = await saveSignData(resForm)
          break

        default:
          break
      }
      if (res) {
        getCureStatusData()
      }
    }
  }
}
/** 透前测量保存 */
async function saveSignData(val: MeasureCureBeforeEditModel) {
  const { abnormalInfoRef, paramDeductionUnit, paramUfgUnit } = componentRef.value
  if (abnormalInfoRef.getAbnormal && abnormalInfoRef.getAbnormal.length > 0) {
    showNotify({ type: 'danger', message: `体征数值超过上下限，不允许保存` })
  }
  else {
    loading.value = true
    const cureServiceProxy = new CureServiceProxy()
    val.ufg = convertDialysisUnit(val.ufg, paramUfgUnit, 1 / 1000)
    val.deductionWeight = convertDialysisUnit(val.deductionWeight, paramDeductionUnit, 1 / 1000)
    const { success, message } = await cureServiceProxy.measureCureBeforePOST(cureData.cureRecordId || cureData.cureScheduleId, val)
    loading.value = false
    if (success) {
      showNotify({ type: 'success', message: `签到成功` })
      return true
    }
    else {
      showNotify({ type: 'danger', message })
      return false
    }
  }
}
/** 修改流程loading状态 */
function hanldeChangeLoading(val) {
  loading.value = val
}
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
