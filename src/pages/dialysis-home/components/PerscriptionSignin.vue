<template>
  <div class="px-2">
    <div>
      <slot name="header">
        透前测量
      </slot>
    </div>
    <div class="my-2">
      <AbnormalInfo
        ref="abnormalInfoRef" :patient-id="cureData.patientId" :blood-pressure-show="!!getFieldBloodPressure" :sbp="formData.beforeSbp" :dbp="formData.beforeDbp" :ufg-show="!!getFieldUfg" :ufg="formData.ufg"
        :best-weight="formData.bestWeight" :pulse-show="!!getFieldBeforePulse" :pulse="formData.beforePulse" :temp-show="!!(getFieldOnTemp && paramShowTemp)" :temp="formData.onTemp"
      />
    </div>
    <el-row :gutter="16">
      <!-- 签到时间 -->
      <el-col v-if="getFieldTimeSignin" :span="8" :style="{ order: getFieldTimeSignin.sequence }">
        <el-form-item :label="getFieldTimeSignin.label" prop="timeSignin">
          <el-date-picker v-model="formData.timeSignin as unknown as Date" class="!w-full" type="datetime" :clearable="false" :placeholder="getFieldTimeSignin.placeholder" format="HH:mm" />
        </el-form-item>
      </el-col>
      <!-- 测量方式 -->
      <el-col v-if="getFieldBeforeWeightMode" :span="8" :style="{ order: getFieldBeforeWeightMode.sequence }">
        <el-form-item :label="getFieldBeforeWeightMode.label" prop="beforeWeightMode">
          <Dictionary v-model="formData.beforeWeightMode" :dic-code="DIC_PATIENT_MEASURE_WEIGHT_MODE" type="select" :placeholder="getFieldBeforeWeightMode.placeholder" @change="handleBeforeWeightModeChange" />
        </el-form-item>
      </el-col>
      <!-- 透前体重 -->
      <el-col v-if="getFieldBeforeWeight" :span="8" :style="{ order: getFieldBeforeWeight.sequence }">
        <el-form-item :label="getFieldBeforeWeight.label" prop="beforeWeight" :rules="getBeforeWeightRule">
          <el-input v-model="formData.beforeWeight" type="number" :placeholder="getFieldBeforeWeight.placeholder" :disabled="disabledWeight(formData.beforeWeightMode)" @change="handleBeforeWeightChange">
            <template #append>
              kg
            </template>
          </el-input>
        </el-form-item>
      </el-col>
      <!-- 干体重 -->
      <el-col v-if="getFieldBestWeight" :span="8" :style="{ order: getFieldBestWeight.sequence }">
        <el-form-item :label="getFieldBestWeight.label" prop="bestWeight">
          <el-input v-model="formData.bestWeight" type="number" :placeholder="getFieldBestWeight.placeholder" :disabled="!authTodayDoctorOperate && stepType === 'Signin'" @change="calcUfg">
            <template #append>
              kg
            </template>
          </el-input>
        </el-form-item>
      </el-col>
      <!-- 偏移调整 -->
      <el-col v-if="getFieldDeductionWeight" :span="8" :style="{ order: getFieldDeductionWeight.sequence }">
        <el-form-item :label="getFieldDeductionWeight.label" prop="deductionWeight">
          <el-input v-model="formData.deductionWeight" :placeholder="getFieldDeductionWeight.placeholder" type="number" @change="calcUfg">
            <template #append>
              {{ paramDeductionUnit }}
            </template>
          </el-input>
        </el-form-item>
      </el-col>
      <!-- 预脱 -->
      <el-col v-if="getFieldUfg" :span="8" :style="{ order: getFieldUfg.sequence }">
        <el-form-item :label="getFieldUfg.label" prop="ufg">
          <el-input v-model="formData.ufg" type="number" :placeholder="getFieldUfg.placeholder" :disabled="!authTodayDoctorOperate && stepType === 'Signin'">
            <template #append>
              {{ paramUfgUnit }}
            </template>
          </el-input>
        </el-form-item>
      </el-col>
      <!-- 测量位置 -->
      <el-col v-if="getFieldBeforeBpPosition" :span="8" :style="{ order: getFieldBeforeBpPosition.sequence }">
        <el-form-item :label="getFieldBeforeBpPosition.label" prop="beforeBpPosition">
          <Dictionary v-model="formData.beforeBpPosition" :dic-code="DIC_PATIENT_MEASURE_BP_POSITION" type="select" :placeholder="getFieldBeforeBpPosition.placeholder" @change="handleBeforeBpPositionChange" />
        </el-form-item>
      </el-col>
      <!-- 血压 -->
      <el-col v-if="getFieldBloodPressure" :span="8" :style="{ order: getFieldBloodPressure.sequence }">
        <el-form-item :label="getFieldBloodPressure.label" prop="bloodPressure" :rules="getBloodPressureRule">
          <BloodPressure v-model="formData" sbp-field="beforeSbp" dbp-field="beforeDbp" :disabled="disabledSbp(formData.beforeBpPosition)" :is-error="bloodPressureError" @change="handleBloodPressureChange" />
        </el-form-item>
      </el-col>
      <!-- 脉搏 -->
      <el-col v-if="getFieldBeforePulse" :span="8" :style="{ order: getFieldBeforePulse.sequence }">
        <el-form-item prop="beforePulse" :label="getFieldBeforePulse.label" :rules="getBeforePulseRule">
          <el-input v-model="formData.beforePulse" type="number" :placeholder="getFieldBeforePulse.placeholder" :disabled="disabledSbp(formData.beforeBpPosition)">
            <template #append>
              bpm
            </template>
          </el-input>
        </el-form-item>
      </el-col>
      <!-- 体温 -->
      <el-col v-if="getFieldOnTemp && paramShowTemp" :span="8" :style="{ order: getFieldOnTemp.sequence }">
        <el-form-item :label="getFieldOnTemp.label" prop="onTemp">
          <el-input v-model="formData.onTemp" type="number" :placeholder="getFieldOnTemp.placeholder" :disabled="disabledSbp(formData.beforeBpPosition)">
            <template #append>
              ℃
            </template>
          </el-input>
        </el-form-item>
      </el-col>
      <!-- 上次透后体重 -->
      <el-col v-if="getFieldLastAfterWeight" :span="8" :style="{ order: getFieldLastAfterWeight.sequence }">
        <el-form-item :label="getFieldLastAfterWeight.label" prop="LastAfterWeight">
          <el-input v-model="formData.lastAfterWeight" :disabled="true">
            <template #append>
              kg
            </template>
          </el-input>
        </el-form-item>
      </el-col>
      <!-- 自定义字段 -->
      <el-col v-for="item in getCustomFieldList?.filter(x => x.sysFieldTypeCode === getFieldType)" :key="item.fieldKey" :span="8" :style="{ order: item.sequence }">
        <DialysisCustomFiled v-model="formData.cureRecordFieldItems.find(x => x.fieldKey === item.fieldKey).fieldValue" :item="item" :index="formData.cureRecordFieldItems.findIndex(x => x.fieldKey === item.fieldKey)" />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import type { CureTodayView, MeasureCureBeforeView, OnCureMiddleView, PrescriptionCureBeforeView } from '@/services/CureServiceProxies'
import { useAppStore } from '@/stores'
import { auth, calcUfgValue, disabledSbp, disabledWeight } from '@/utils/dialysis'
import { DIC_PATIENT_MEASURE_BP_POSITION, DIC_PATIENT_MEASURE_WEIGHT_MODE } from '@/utils/constant'

const { cureData, modelValue, stepType } = defineProps({
  cureData: {
    type: Object as PropType<CureTodayView>,
  },
  modelValue: {
    type: Object as PropType<MeasureCureBeforeView | PrescriptionCureBeforeView | OnCureMiddleView>,
    required: true,
  },
  stepType: { type: String as PropType<DialysisStepType>, required: true },
})
const emit = defineEmits(['update:modelValue'])

const formData = computed<MeasureCureBeforeView | PrescriptionCureBeforeView | OnCureMiddleView>({
  get: () => modelValue,
  set: (value) => {
    console.log('value.beforeBpPosition', value.beforeBpPosition)

    emit('update:modelValue', value)
  },
})
const { getParametersValue, getDicDataByCode } = useAppStore()

const abnormalInfoRef = ref(null)

const lastDeductionWeight = ref(null)
/** 预脱单位 */
const paramUfgUnit = getParametersValue('DIALYSIS.UF.UNIT')
/** 偏移量单位 */
const paramDeductionUnit = getParametersValue('DIALYSIS.DEDUCTION.UNIT')
const authTodayDoctorOperate = auth('pad.today.doctoroperate')

const getFieldType = computed(() => {
  let formType = 'MeasureCureBefore'
  switch (stepType) {
    case 'Signin':
      formType = 'MeasureCureBefore'
      break
    case 'MakePrescription':
      formType = 'Prescribing.VitalSigns'
      break
    case 'OperateComputer':
      formType = 'OnCureMiddle.MeasureCureBefore'
      break
    case 'CrossCheck':
      formType = 'VerifyCureMiddle.MeasureCureBefore'
      break
  }
  return formType
})
const getSysFieldProperty = inject<SysFieldProperty>('getSysFieldProperty')
const getCustomFieldList = inject<any[]>('getCustomFieldList')

const getFieldTimeSignin = computed(() => {
  return getSysFieldProperty('timeSignin', getFieldType.value)
})
const getFieldBeforeWeightMode = computed(() => {
  return getSysFieldProperty('beforeWeightMode', getFieldType.value)
})
const getFieldBeforeWeight = computed(() => {
  return getSysFieldProperty('beforeWeight', getFieldType.value)
})
const getBeforeWeightRule = computed(() => [{ required: !!getFieldBeforeWeight.value.required || (!disabledWeight(formData.value.beforeWeightMode) && formData.value.beforeWeightMode !== 'NOMEASURE'), message: getFieldBeforeWeight.value.placeholder, trigger: 'blur' }])
const getFieldBestWeight = computed(() => {
  return getSysFieldProperty('bestWeight', getFieldType.value)
})
const getFieldDeductionWeight = computed(() => {
  return getSysFieldProperty('deductionWeight', getFieldType.value)
})
const getFieldUfg = computed(() => {
  return getSysFieldProperty('ufg', getFieldType.value)
})
const getFieldBeforeBpPosition = computed(() => {
  return getSysFieldProperty('beforeBpPosition', getFieldType.value)
})
const getFieldBloodPressure = computed(() => {
  return getSysFieldProperty('bloodPressure', getFieldType.value)
})
// 血压错误状态
const bloodPressureError = ref(false)
const getBloodPressureRule = computed(() => [{ required: getFieldBloodPressure.value.required || (formData.value.beforeBpPosition !== 'NOMEASURE' && !(disabledSbp(formData.value.beforeBpPosition))), validator: validateBloodRule, trigger: 'blur' }])
function validateBloodRule(_rule, _value, callback) {
  setTimeout(() => {
    bloodPressureError.value = true
    const { beforeSbp, beforeDbp } = formData.value
    if ((!disabledSbp(formData.value.beforeBpPosition) && formData.value.beforeBpPosition !== 'NOMEASURE') || getFieldBloodPressure.value.required) {
      if ((!beforeSbp && beforeDbp) && beforeSbp !== 0) {
        callback(new Error('请输入收缩压'))
      }
      else if ((beforeSbp && !beforeDbp) && beforeDbp !== 0) {
        callback(new Error('请输入舒张压'))
      }
      else if (!beforeSbp && !beforeDbp && beforeSbp !== 0 && beforeDbp !== 0) {
        callback(new Error('请输入血压'))
      }
      else if (beforeSbp > 999 || beforeSbp < 0 || beforeDbp > 999 || beforeDbp < 0) {
        callback(new Error('请输入正确的正整数'))
      }
      else {
        bloodPressureError.value = false
        callback()
      }
    }
    else {
      bloodPressureError.value = false
      callback()
    }
  }, 200)
}
const getFieldBeforePulse = computed(() => {
  return getSysFieldProperty('beforePulse', getFieldType.value)
})
const getBeforePulseRule = computed(() => [{ required: getFieldBeforePulse.value.required || (formData.value.beforeBpPosition !== 'NOMEASURE' && !(disabledSbp(formData.value.beforeBpPosition))), message: getFieldBeforePulse.value.placeholder, trigger: 'blur' }])
const getFieldOnTemp = computed(() => {
  return getSysFieldProperty('onTemp', getFieldType.value)
})
/** 体温是否展示 */
const paramShowTemp = getParametersValue('CUREFLOW.TEMP.SHOW', true)
const getFieldLastAfterWeight = computed(() => {
  return getSysFieldProperty('lastAfterWeight', getFieldType.value)
})
/** 改变透前体重测量方式 */
function handleBeforeWeightModeChange(val) {
  if (disabledWeight(val)) {
    formData.value.beforeWeight = null
  }
}
/** 体重测量方式 */
const dicWeightMode = getDicDataByCode(DIC_PATIENT_MEASURE_WEIGHT_MODE)
/** 改变透前体重 */
function handleBeforeWeightChange() {
  const { beforeWeight, beforeWeightMode } = formData.value
  if ((beforeWeight || beforeWeight === 0) && beforeWeightMode === (dicWeightMode.find(x => x.value === 'NOMEASURE')?.value || '')) {
    formData.value.beforeWeightMode = (dicWeightMode.find(x => x.value === 'NORMAL')?.value || '')
  }
  calcUfg()
}
/** 计算预脱值 */
function calcUfg() {
  const { beforeWeight, bestWeight, deductionWeight, lastAfterWeight } = formData.value
  const data: CalcUfgModel = {
    beforeWeight,
    bestWeight,
    deductionWeight,
    deductionWeightUnit: paramDeductionUnit,
    ufgUnit: paramUfgUnit,
    lastAfterWeight: lastAfterWeight ? Number(lastAfterWeight) : 0,
    lastDeductionWeight: lastDeductionWeight.value,
  }
  formData.value.ufg = calcUfgValue(data)
}
/** 改变透前血压测量方式 */
function handleBeforeBpPositionChange() {
  if (disabledSbp(formData.value.beforeBpPosition)) {
    formData.value.beforeSbp = null
    formData.value.beforeDbp = null
  }
}
const dicBpPosition = getDicDataByCode(DIC_PATIENT_MEASURE_BP_POSITION)
/** 改变透前血压 */
function handleBloodPressureChange() {
  const { beforeSbp, beforeDbp, beforeBpPosition } = formData.value
  if ((beforeSbp || beforeDbp) && beforeBpPosition === (dicBpPosition.find(x => x.value === 'NOMEASURE')?.value || '')) {
    formData.value.beforeBpPosition = (dicBpPosition.find(x => x.value === 'UP')?.value || '')
  }
}
watch(() => [formData.value.beforeSbp, formData.value.beforeDbp], () => {
  handleBloodPressureChange()
})

defineExpose({
  abnormalInfoRef,
  paramDeductionUnit,
  paramUfgUnit,
})
</script>

<style scoped lang="less">
</style>
