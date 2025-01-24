<template>
  <el-form ref="ruleFormRef" :model="formData" :rules="formRules" label-width="auto" :disabled="formDisabled">
    <PerscriptionSignin ref="signinRef" v-model="formData" :cure-data="cureData" :step-type="stepType" />
  </el-form>
</template>

<script setup lang="ts">
import type { CureTodayView } from '@/services/CureServiceProxies'
import { CureServiceProxy, MeasureCureBeforeView } from '@/services/CureServiceProxies'
import { useAppStore } from '@/stores'
import { convertDialysisUnit } from '@/utils/dialysis'
import type { FormInstance, FormRules } from 'element-plus'
import { showNotify } from 'vant'

const { cureData, stepType, formDisabled } = defineProps({
  cureData: {
    type: Object as PropType<CureTodayView>,
  },
  stepType: { type: String as PropType<DialysisStepType>, required: true },
  formDisabled: { type: Boolean, default: false },
})
const emit = defineEmits(['hanldeChangeLoading'])

const { sysFiledList, getParametersValue, getParameterData } = useAppStore()

onBeforeMount(async () => {
  // 加载自定义字段
  await getAllFieldList()
})
onMounted(() => {
  initLoad()
})
const ruleFormRef = ref<FormInstance>()
const formData = ref<MeasureCureBeforeView>(new MeasureCureBeforeView()) // 透前测量表单数据
// 表单校验规则
const formRules = reactive<FormRules<MeasureCureBeforeView>>({})
const signinRef = ref(null)
const lastDeductionWeight = ref(null)
/** 透前体重默认测量方式 */
const paramDefaultBeforeWeightModeData = getParameterData('CUREFLOW.DEFAULT.WEIGHT.MODE.BEFORE')
/** 透前血压默认测量位置 */
const paramDefaultBeforeBpPositionData = getParameterData('CUREFLOW.DEFAULT.BP.POSITION.BEFORE')
/** 超滤单位 */
const paramUfgUnit = getParametersValue('DIALYSIS.UF.UNIT')
/** 偏移量单位 */
const paramDeductionUnit = getParametersValue('DIALYSIS.DEDUCTION.UNIT')
/** 初始化透前测量 */
async function initLoad() {
  emit('hanldeChangeLoading', true)
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
provide('getCustomFieldList', getCustomFieldList)
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
provide('getSysFieldProperty', getSysFieldProperty)
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
  signinRef,
  handleSaveForm,
  paramDeductionUnit,
  paramUfgUnit,
})
</script>

<style scoped lang="less">
</style>
