<template>
  <el-form v-if="formData.patientId" ref="ruleFormRef" :model="formData" :rules="formRules" label-width="auto" :disabled="stepType === 'CrossCheck'">
    <div class="flex flex-col">
      <!-- 来源 -->
      <PrescriptionSource v-model="formData" :step-type="stepType" />
      <!-- 治疗方式 -->
      <PrescriptionInfo v-model="formData" :step-type="stepType">
        <template #header>
          治疗方式
        </template>
      </PrescriptionInfo>
      <!-- 透前测量 -->
      <PerscriptionSignin v-model="formData" :cure-data="cureData" :step-type="stepType" />
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
import type { CureTodayView } from '@/services/CureServiceProxies'
import { CureServiceProxy, OnCureMiddleView } from '@/services/CureServiceProxies'
import { useAppStore } from '@/stores'
import { convertDialysisUnit } from '@/utils/dialysis'
import type { FormInstance, FormRules } from 'element-plus'

const { cureData, stepType } = defineProps({
  cureData: {
    type: Object as PropType<CureTodayView>,
  },
  stepType: { type: String as PropType<DialysisStepType>, required: true },
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

const formData = ref<OnCureMiddleView>(new OnCureMiddleView()) // 上机数据
// 表单校验规则
const formRules = reactive<FormRules<OnCureMiddleView>>({
  punctureMethod: [{ required: true, message: '请选择穿刺方法', trigger: 'change' }],
  punctureNurseId: [{ required: true, message: '请选择穿刺护士', trigger: 'change' }],
})

async function initLoad() {
  emit('hanldeChangeLoading', true)
  await getOnCureMiddleData()
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
  const fieldTypeList = ['OnCureMiddle.PatientSource', 'OnCureMiddle.CureMode', 'OnCureMiddle.MeasureCureBefore', 'OnCureMiddle.Dialysate']
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
async function getOnCureMiddleData() {
  const cureServiceProxy = new CureServiceProxy()
  const { success, data, message } = await cureServiceProxy.onCureMiddleGET(cureData.cureRecordId || cureData.cureScheduleId)
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
