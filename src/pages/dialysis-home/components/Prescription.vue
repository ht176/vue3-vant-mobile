<template>
  <el-form v-if="formData.patientId" ref="ruleFormRef" :model="formData" :rules="formRules" label-width="auto" :disabled="stepType === 'ConfirmPrescription'">
    <div class="flex flex-col">
      <!-- 来源 -->
      <PrescriptionSource v-model="formData" :step-type="stepType" />
      <!-- 快捷处方 -->
      <PrescriptionQuick v-model="formData" />
      <!-- 处方信息 -->
      <PrescriptionInfo v-model="formData" :step-type="stepType" />
      <!-- 生命体征 -->
      <PerscriptionSignin v-model="formData" :cure-data="cureData" :step-type="stepType">
        <template #header>
          生命体征
        </template>
        <template #headerOperation>
          {{ `上次透析情况 透前体重：${formData.lastBeforeWeight ?? '-'}kg | 预脱：${convertDialysisUnit(formData.lastUfg, paramUfgUnit)}${paramUfgUnit}
           | 透后体重：${formData.lastAfterWeight ?? '-'}kg | 实脱：${convertDialysisUnit(formData.lastUfv, paramUfgUnit)}${paramUfgUnit}` }}
        </template>
      </PerscriptionSignin>
      <!-- 医嘱 -->
      <PrescriptionAdvice v-model="formData" :step-type="stepType" />
      <div class="py-2">
        <div class="dialysis-procedure-title-div">
          抗凝剂 - {{ formData.anticoagulantName }}
        </div>
        <el-row :gutter="16">
          <Anticoagulant v-model="formData" />
        </el-row>
      </div>
      <!-- 透析液 -->
      <PrescriptionDialysate v-model="formData" :step-type="stepType" />
      <!-- 项目 -->
      <PrescriptionProjectItem v-model="formData" :cure-data="cureData" :step-type="stepType" />
    </div>
  </el-form>
</template>

<script setup lang="ts">
import type { CureTodayView } from '@/services/CureServiceProxies'
import { CureServiceProxy, PrescriptionCureBeforeView } from '@/services/CureServiceProxies'
import { useAppStore } from '@/stores'
import { dateUtil } from '@/utils/date'
import { convertDialysisUnit } from '@/utils/dialysis'
import type { FormInstance, FormRules } from 'element-plus'
import { showNotify } from 'vant'

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

const formData = ref<PrescriptionCureBeforeView>(new PrescriptionCureBeforeView()) // 处方数据
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
/** 超滤单位 */
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
    // 血管通路Id转数组(如果多个血管通路，将其它血管通路也加到数组中)
    data.patientVascularAccessId = (typeof data.patientVascularAccessId === 'string' ? (data.patientVascularAccessId ? data.patientVascularAccessId.split(',') : null) : null) as unknown as string
    if (data.patientOtherVascularAccessId) {
      (data.patientVascularAccessId as unknown as Array<string>).push(data.patientOtherVascularAccessId)
    }
    // 处方开立时间默认
    data.timeEnactDoctor = data.timeEnactDoctor || dateUtil()
    formData.value = data
  }
  else {
    showNotify({ type: 'danger', message })
  }
}
/** 保存 */
async function handleSaveForm() {
  let formSaveData = null
  await ruleFormRef.value?.validate((valid) => {
    if (valid) {
      const { patientVascularAccessId, iuf, ufg } = formData.value
      const newUfg = convertDialysisUnit(ufg, paramUfgUnit, 1 / 1000)
      formSaveData = {
        ...toRaw(formData.value),
        check: 1,
        iuf: iuf ? 1 : 0,
        patientVascularAccessId: patientVascularAccessId ? patientVascularAccessId[0] : null,
        ufg: newUfg,
      }
    }
  })
  return formSaveData
}
defineExpose({
  handleSaveForm,
})
</script>

<style scoped lang="less">
</style>
