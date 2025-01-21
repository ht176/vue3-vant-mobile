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
    <el-form ref="ruleFormRef" :model="formData" :rules="formRules" label-width="auto" :disabled="formDisabled">
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
            <BloodPressure v-model="formData" sbp-field="beforeSbp" dbp-field="beforeDbp" :disabled="disabledSbp(formData.beforeBpPosition)" @change="handleBloodPressureChange" />
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
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { CureServiceProxy, CureTodayView, MeasureCureBeforeView, PrescriptionCureBeforeView } from '@/services/CureServiceProxies'
import { useAppStore } from '@/stores'
import { auth, calcUfgValue, convertDialysisUnit, disabledSbp, disabledWeight } from '@/utils/dialysis'
import { DIC_PATIENT_MEASURE_BP_POSITION, DIC_PATIENT_MEASURE_WEIGHT_MODE } from '@/utils/constant'
import type { FormInstance, FormRules } from 'element-plus'
import { showNotify } from 'vant'

const { cureData, modelValue, stepType, formDisabled } = defineProps({
  cureData: CureTodayView,
  modelValue: {
    type: Object as PropType<MeasureCureBeforeView | PrescriptionCureBeforeView>,
    // required: true,
  },
  stepType: { type: String as PropType<DialysisStepType>, default: 'Signin' },
  formDisabled: { type: Boolean, default: false },
})
const emit = defineEmits(['hanldeChangeLoading'])

const { sysFiledList, getParametersValue, getParameterData, getDicDataByCode } = useAppStore()

onBeforeMount(async () => {
  // 加载自定义字段
  await getAllFieldList()
})
onMounted(() => {
  initLoad()
})
const abnormalInfoRef = ref(null)
const ruleFormRef = ref<FormInstance>()
const formData = ref<MeasureCureBeforeView | PrescriptionCureBeforeView>(new MeasureCureBeforeView()) // 透前测量表单数据
// 表单校验规则
const formRules = reactive<FormRules<MeasureCureBeforeView>>({})

const lastDeductionWeight = ref(null)
/** 透前体重默认测量方式 */
const paramDefaultBeforeWeightModeData = getParameterData('CUREFLOW.DEFAULT.WEIGHT.MODE.BEFORE')
/** 透前血压默认测量位置 */
const paramDefaultBeforeBpPositionData = getParameterData('CUREFLOW.DEFAULT.BP.POSITION.BEFORE')
/** 预脱单位 */
const paramUfgUnit = getParametersValue('DIALYSIS.UF.UNIT')
/** 偏移量单位 */
const paramDeductionUnit = getParametersValue('DIALYSIS.DEDUCTION.UNIT')
/** 初始化透前测量 */
async function initLoad() {
  emit('hanldeChangeLoading', true)
  if (stepType === 'Signin') {
    await getMeasureCureBeforeData()
    await getPatientRoutine()
    // 体重测量方式默认值
    if (!formData.value.beforeWeightMode) {
      formData.value.beforeWeightModeLabel = paramDefaultBeforeWeightModeData?.valueLabel || null
      formData.value.beforeWeightMode = paramDefaultBeforeWeightModeData?.value || null
    }
    // 血压测量方式默认值
    if (!formData.value.beforeBpPosition) {
      (formData.value as MeasureCureBeforeView).beforeBpPositionLable = paramDefaultBeforeBpPositionData?.valueLabel || null
      formData.value.beforeBpPosition = paramDefaultBeforeBpPositionData?.value || null
    }
    if (ruleFormRef.value) {
      ruleFormRef.value.clearValidate()
    }
  }
  else {
    formData.value = Object.assign(new PrescriptionCureBeforeView(), modelValue)
  }
  emit('hanldeChangeLoading', false)
}
/** 获取透前测量数据 */
async function getMeasureCureBeforeData() {
  const cureServiceProxy = new CureServiceProxy()
  const { success, data, message } = await cureServiceProxy.measureCureBeforeGET2(cureData.cureRecordId || cureData.cureScheduleId)
  if (success) {
    data.cureRecordFieldItems.forEach((x) => {
      x.cureRecordId = x.cureRecordId || cureData.cureRecordId || cureData.cureScheduleId
    })
    // 预脱根据单位转换
    data.ufg = convertDialysisUnit(data.ufg, paramUfgUnit)
    // 偏移调整根据单位转换
    data.deductionWeight = convertDialysisUnit(data.deductionWeight, paramDeductionUnit)
    formData.value = data
  }
  else {
    showNotify({ type: 'danger', message })
  }
}
/** 获取患者干体重与偏移量调整数据 */
async function getPatientRoutine() {
  const cureServiceProxy = new CureServiceProxy()

  const { success, data } = await cureServiceProxy.patientRoutine(cureData.patientId, cureData.cureRecordId || cureData.cureScheduleId)
  if (success) {
    formData.value.bestWeight = formData.value.bestWeight || data.bestWeight
    formData.value.deductionWeight = (formData.value.deductionWeight || formData.value.deductionWeight === 0) ? formData.value.deductionWeight : data.deductionWeight
    formData.value.lastAfterWeight = data.lastAfterWeight
    lastDeductionWeight.value = data.lastDeductionWeight
  }
}
const authTodayDoctorOperate = auth('pad.today.doctoroperate')
const allFiledList = ref<CustomSysFieldItemView[]>([]) // 模块自定义字段
// 内置字段
const getSysFieldList = computed(() => {
  const sysFieldList = allFiledList.value.filter(x => x.system)
  sysFieldList.forEach((x) => {
    const requiredRule = { required: !!x.required, message: `${x.dataType === 'OPTION' ? '请选择' : '请输入'}${x.label.replace('：', '')}`, trigger: ['blur', 'change'] }
    // 常规字段
    if (formRules[x.value]) {
      let isBeing = false
      formRules[x.value].forEach((e) => {
        if ('required' in e) {
          isBeing = true
          e.required = !!x.required
        }
      })
      if (!isBeing) {
        formRules[x.value].push(requiredRule)
      }
    }
    else {
      formRules[x.value] = [requiredRule]
    }
  })
  return sysFieldList
})
// 非内置字段
const getCustomFieldList = computed (() => {
  const customFieldList = allFiledList.value.filter(x => !x.system)
  return formData.value?.cureRecordFieldItems?.map((item) => {
    const details = customFieldList.find(x => x.value === item.fieldKey)
    return details ? { ...item, ...details } : undefined
  }).filter(x => x)
})
const getFieldType = computed(() => {
  let formType = 'MeasureCureBefore'
  switch (stepType) {
    case 'Signin':
      formType = 'MeasureCureBefore'
      break
    case 'MakePrescription':
      formType = 'Prescribing.VitalSigns'
      break
    case 'CrossCheck':
      formType = 'VerifyCureMiddle.MeasureCureBefore'
      break
  }
  return formType
})
/** 获取模块所有字段 */
function getAllFieldList() {
  allFiledList.value = sysFiledList.filter(x => x.show && x.sysFieldTypeCode === getFieldType.value).map((x) => {
    const label = x.name2 || x.name
    return { ...x, label: `${label}：`, placeholder: `${x.dataType === 'OPTION' ? '请选择' : '请输入'}${label}` }
  })
}
function getSysFieldProperty(key, typeCode) {
  return getSysFieldList.value.find(x => x.value === key && x.sysFieldTypeCode === typeCode)
}
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
const getBloodPressureRule = computed(() => [{ required: getFieldBloodPressure.value.required || (formData.value.beforeBpPosition !== 'NOMEASURE' && !(disabledSbp(formData.value.beforeBpPosition))), validator: validateBloodRule, trigger: ['blur', 'change'] }])
function validateBloodRule(_rule, _value, callback) {
  const { beforeSbp, beforeDbp } = formData.value
  if ((!disabledSbp(formData.value.beforeBpPosition) && formData.value.beforeBpPosition !== 'NOMEASURE') || getFieldBloodPressure.value.required) {
    if (!beforeSbp && beforeDbp) {
      callback(new Error('请输入收缩压'))
    }
    else if (beforeSbp && !beforeDbp) {
      callback(new Error('请输入舒张压'))
    }
    else if (!beforeSbp && !beforeDbp) {
      callback(new Error('请输入血压'))
    }
    else if (beforeSbp > 999 || beforeSbp < 0 || beforeDbp > 999 || beforeDbp < 0) {
      callback(new Error('请输入正确的正整数'))
    }
    else {
      callback()
    }
  }
  else {
    callback()
  }
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
/** 保存 */
async function handleSaveForm() {
  let formSaveData = null
  await ruleFormRef.value?.validate((valid) => {
    if (valid) {
      formSaveData = toRaw(formData.value)
    }
  })
  return formSaveData
}
defineExpose({
  abnormalInfoRef,
  handleSaveForm,
  paramDeductionUnit,
  paramUfgUnit,
})
</script>

<style scoped lang="less">
</style>
