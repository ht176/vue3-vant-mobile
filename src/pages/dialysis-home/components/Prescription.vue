<template>
  <el-form v-if="formData.patientId" ref="ruleFormRef" :model="formData" :rules="formRules" label-width="auto" :disabled="formDisabled">
    <div class="flex flex-col">
      <!-- 来源 -->
      <PrescriptionSource v-model="formData" />
      <!-- 快捷处方 -->
      <PrescriptionQuick v-model="formData" />
      <!-- 处方信息 -->
      <PrescriptionInfo v-model="formData" :step-type="stepType" />
      <!-- 治疗信息 -->
      <Signin v-model="formData" :cure-data="cureData" :step-type="stepType">
        <template #header>
          治疗信息
        </template>
      </Signin>
      <!-- 医嘱 -->
      <PrescriptionAdvice v-model="formData" />
      <div class="py-2">
        <div>抗凝剂 - {{ formData.anticoagulantName }}</div>
        <el-row :gutter="16">
          <Anticoagulant v-model="formData" />
        </el-row>
      </div>
      <PrescriptionDialysate v-model="formData" :step-type="stepType" />
      <PrescriptionProjectItem v-model="formData" :cure-data="cureData" :step-type="stepType" />
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { CureServiceProxy, CureTodayView, PrescriptionCureBeforeView } from '@/services/CureServiceProxies'
import { useAppStore } from '@/stores'
import { convertDialysisUnit } from '@/utils/dialysis'
import type { FormInstance, FormRules } from 'element-plus'

const { cureData, stepType, formDisabled } = defineProps({
  cureData: CureTodayView,
  stepType: { type: String as PropType<DialysisStepType>, default: 'MakePrescription' },
  formDisabled: { type: Boolean, default: false },
})
const emit = defineEmits(['hanldeChangeLoading'])
provide('getSysFieldProperty', getSysFieldProperty)
const { sysFiledList, getParametersValue } = useAppStore()
onBeforeMount(async () => {
  getAllFieldList()
})
onMounted(() => {
  initLoad()
})
const ruleFormRef = ref<FormInstance>()

const formData = ref<PrescriptionCureBeforeView>(new PrescriptionCureBeforeView()) // 透前测量表单数据
// 表单校验规则
const formRules = reactive<FormRules<PrescriptionCureBeforeView>>({})

async function initLoad() {
  emit('hanldeChangeLoading', true)
  await getPrescriptionCureBeforeData()
  emit('hanldeChangeLoading', false)
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
/** 获取模块所有字段 */
function getAllFieldList() {
  const fieldTypeList = ['Prescribing.PatientSource', 'Prescribing.QuickPrescription', 'Prescribing.PrescriptionInfo', 'Prescribing.VitalSigns', 'Prescribing.Dialysate']
  allFiledList.value = sysFiledList.filter(x => x.show && fieldTypeList.includes(x.sysFieldTypeCode)).map((x) => {
    const label = x.name2 || x.name
    return { ...x, label: `${label}：`, placeholder: `${x.dataType === 'OPTION' ? '请选择' : '请输入'}${label}` }
  })
}
function getSysFieldProperty(key: string, typeCode: string) {
  const val = getSysFieldList.value.find(x => x.value === key && x.sysFieldTypeCode === typeCode)
  return val
}
/** 预脱单位 */
const paramUfgUnit = getParametersValue('DIALYSIS.UF.UNIT')
/** 偏移量单位 */
const paramDeductionUnit = getParametersValue('DIALYSIS.DEDUCTION.UNIT')
/** 查询患者处方 */
async function getPrescriptionCureBeforeData() {
  const cureServiceProxy = new CureServiceProxy()
  const { success, data, message } = await cureServiceProxy.prescriptionCureBeforeGET2(0, cureData.cureRecordId || cureData.cureScheduleId)
  if (success) {
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
</script>

<style scoped lang="less">
</style>
