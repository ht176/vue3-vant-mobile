<template>
  <div class="flex flex-col overflow-hidden">
    <!-- 流程步骤条 -->
    <div class="pos-relative py-2">
      <ul class="step-div flex justify-around">
        <li v-for="(step, index) in getActionList" :key="index" class="flex flex-col items-center" :class="cureStatusData[step.isDone] ? 'step-done-div' : ''" @click="handleStepClick(step)">
          <div class="step-div-index">
            {{ (index + 1) }}
          </div>
          <div class="mt-2 pb-2" :class="selectStep === step.child ? 'step-active' : ''">
            {{ step.name }}
          </div>
        </li>
      </ul>
    </div>
    <!-- 步骤内容 -->
    <div v-loading="loading" class="flex-1 overflow-auto">
      <div>
        <component :is="selectComponent" ref="componentRef" :cure-data="cureData" :step-type="selectStep" @hanlde-change-loading="hanldeChangeLoading" />
      </div>
    </div>
    <!-- 底部保存操作按钮 -->
    <div class="flex justify-end">
      <!-- 签到 -->
      <template v-if="selectStep === 'Signin' && (cureData.allowSignedBefore || cureData.allowMeasureBefore)">
        <el-button type="primary" size="large" @click="handleSaveClick">
          确定
        </el-button>
      </template>
      <!-- 透析评估 -->
      <template v-else-if="selectStep === 'DialysisEvaluation'">
        <el-button type="primary" size="large" @click="handleSaveClick">
          确定
        </el-button>
      </template>
      <!-- 制定处方 -->
      <template v-else-if="selectStep === 'MakePrescription' && cureData.allowEnactBefore">
        <el-button size="large" @click="handleSaveTempPerscriptionClick">
          另存为处方
        </el-button>
        <el-button type="primary" size="large" @click="handleSaveClick">
          确定
        </el-button>
      </template>
      <!-- 确认处方 -->
      <template v-else-if="selectStep === 'ConfirmPrescription' && cureData.allowCheckBefore">
        <el-button size="large" @click="handleRejectPerscriptionClick">
          拒绝
        </el-button>
        <el-button type="primary" size="large" @click="handleSaveClick">
          确定
        </el-button>
      </template>
      <!-- 透前评估 -->
      <template v-else-if="selectStep === 'BeforeDialysisEvaluation'">
        <el-button type="primary" size="large" @click="handleSaveClick">
          确定
        </el-button>
      </template>
      <!-- 透析上机 -->
      <template v-else-if="selectStep === 'OperateComputer' && cureData.allowOnMiddle">
        <el-button type="primary" size="large" @click="handleSaveClick">
          确定
        </el-button>
      </template>
      <!-- 交叉核对 -->
      <template v-else-if="selectStep === 'CrossCheck' && cureData.allowVerifyMiddle">
        <el-button type="primary" size="large" @click="handleSaveClick">
          确定
        </el-button>
      </template>
      <!-- 透中监测 -->
      <template v-else-if="selectStep === 'Monitoring'">
        <el-button type="primary" size="large" @click="handleSaveClick">
          确定
        </el-button>
      </template>
      <!-- 下机 -->
      <template v-else-if="selectStep === 'OffAfter' && cureData.allowOffAfter">
        <el-button type="primary" size="large" @click="handleSaveClick">
          确定
        </el-button>
      </template>
      <!-- 消毒 -->
      <template v-else-if="selectStep === 'Disinfect' && cureData.allowDisinfectAfter">
        <el-button type="primary" size="large" @click="handleSaveClick">
          确定
        </el-button>
      </template>
      <!-- 透后评估 -->
      <template v-else-if="selectStep === 'AfterDialysisEvaluation'">
        <el-button type="primary" size="large" @click="handleSaveClick">
          确定
        </el-button>
      </template>
      <!-- 透后小结 -->
      <template v-else-if="selectStep === 'AfterSummary'">
        <el-button type="primary" size="large" @click="handleSaveClick">
          确定
        </el-button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CureTodayView, MeasureCureBeforeEditModel } from '@/services/CureServiceProxies'
import { CureServiceProxy, CureStatusView } from '@/services/CureServiceProxies'
import { useAppStore } from '@/stores'
import { convertDialysisUnit } from '@/utils/dialysis'
import { showNotify } from 'vant'

const { cureData } = defineProps({
  cureData: {
    type: Object as PropType<CureTodayView>,
  },
})
/** 流程状态 */
const cureStatusData = ref<CureStatusView>(new CureStatusView())

const { getParametersValue } = useAppStore()

interface Step {
  name: string
  show: boolean
  action: number
  child: DialysisStepType
  isDone: string
  canDo: string
  comp?: Component
}

const stepList = reactive<Step[]>([
  { name: '透前测量', show: true, action: 1, child: 'Signin', isDone: 'hasMeasureBefore', canDo: 'allowMeasureBefore', comp: markRaw(defineAsyncComponent(() => import('./Signin.vue'))) },
  { name: '透析评估', show: true, action: 12, child: 'DialysisEvaluation', isDone: 'hasAssementDialysis', canDo: 'allowAssementDialysis' },
  { name: '制定处方', show: true, action: 2, child: 'MakePrescription', isDone: 'hasEnactBefore', canDo: 'allowEnactBefore', comp: markRaw(defineAsyncComponent(() => import('./Prescription.vue'))) },
  { name: '确认处方', show: true, action: 3, child: 'ConfirmPrescription', isDone: 'hasCheckBefore', canDo: 'allowCheckBefore', comp: markRaw(defineAsyncComponent(() => import('./Prescription.vue'))) },
  { name: '透前评估', show: true, action: 4, child: 'BeforeDialysisEvaluation', isDone: 'hasAssementBefore', canDo: 'allowAssementBefore' },
  { name: '透析上机', show: true, action: 5, child: 'OperateComputer', isDone: 'hasOnMiddle', canDo: 'allowOnMiddle', comp: markRaw(defineAsyncComponent(() => import('./OperateComputer.vue'))) },
  { name: '交叉核对', show: true, action: 6, child: 'CrossCheck', isDone: 'hasVerifyMiddle', canDo: 'allowVerifyMiddle', comp: markRaw(defineAsyncComponent(() => import('./OperateComputer.vue'))) },
  { name: '透中监测', show: true, action: 7, child: 'Monitoring', isDone: 'hasMonitorMiddle', canDo: 'allowMonitorMiddle' },
  { name: '下机', show: true, action: 8, child: 'OffAfter', isDone: 'hasOffAfter', canDo: 'allowOffAfter', comp: markRaw(defineAsyncComponent(() => import('./OffAfter.vue'))) },
  { name: '消毒', show: true, action: 11, child: 'Disinfect', isDone: 'hasDisinfectAfter', canDo: 'allowDisinfectAfter', comp: markRaw(defineAsyncComponent(() => import('./Disinfect.vue'))) },
  { name: '透后评估', show: true, action: 9, child: 'AfterDialysisEvaluation', isDone: 'hasAssementAfter', canDo: 'allowAssementAfter' },
  { name: '透后小结', show: true, action: 10, child: 'AfterSummary', isDone: 'hasSummaryAfter', canDo: 'allowSummaryAfter', comp: markRaw(defineAsyncComponent(() => import('./AfterSummary.vue'))) },
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
/** 所有可用节点 */
const getActionList = computed(() => {
  return stepList.filter(x => x.show)
})
/** 当前流程节点 */
const selectStep = ref<DialysisStepType>(null)
/** 查询当前流程节点信息 */
async function getCureStatusData() {
  const cureServiceProxy = new CureServiceProxy()
  const { success, data } = await cureServiceProxy.cureStatus(cureData.cureRecordId || cureData.cureScheduleId)
  if (success) {
    cureStatusData.value = new CureStatusView({ ...cureData, ...data, timeOn: data.timeOn })
    for (let index = 0; index < getActionList.value.length; index++) {
      const ele = stepList[index]
      if (cureStatusData.value[ele.canDo] && !cureStatusData.value[ele.isDone]) {
        selectStep.value = ele.child
        break
      }
    }
  }
}
/** 切换流程节点 */
function handleStepClick(val: Step) {
  if (cureStatusData.value[val.isDone] || cureStatusData.value[val.canDo]) {
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
  const { signinRef, paramDeductionUnit, paramUfgUnit } = componentRef.value
  if (signinRef.abnormalInfoRef.getAbnormal && signinRef.abnormalInfoRef.getAbnormal.length > 0) {
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
/** 另存为处方 */
function handleSaveTempPerscriptionClick() {
}
/** 拒绝处方 */
function handleRejectPerscriptionClick() {

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
