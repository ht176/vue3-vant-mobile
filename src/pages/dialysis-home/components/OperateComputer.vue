<template>
  <el-form v-if="formData.patientId" ref="ruleFormRef" :model="formData" :rules="formRules" label-width="120px" scroll-to-error :disabled="stepType === 'CrossCheck'">
    <div class="flex flex-col">
      <div v-if="formData.suggestion">
        <div>透析建议</div>
        <div>
          {{ formData.suggestion }}
        </div>
      </div>
      <!-- 来源 -->
      <el-form ref="sourceFormRef" :model="formData" :rules="formRules" label-width="120px" scroll-to-error>
        <PrescriptionSource v-model="formData" :step-type="stepType" />
      </el-form>
      <!-- 治疗方式 -->
      <el-form ref="infoFormRef" :model="formData" :rules="formRules" label-width="120px" scroll-to-error>
        <PrescriptionInfo v-model="formData" :step-type="stepType" :form-rules="formRules" :disabled="stepType === 'CrossCheck'" :has-verify-middle="cureData.hasVerifyMiddle">
          <template #header>
            治疗方式
          </template>
          <template #headerOperation>
            <template v-if="stepType === 'OperateComputer' && (formData as OnCureMiddleView).onNurseName">
              {{ `上机护士：${(formData as OnCureMiddleView).onNurseName} | 上机时间：${formatToDateTime((formData as OnCureMiddleView).timeOn)}` }}
            </template>
          </template>
        </PrescriptionInfo>
      </el-form>
      <!-- 透前测量 -->
      <PerscriptionSignin v-model="formData" :cure-data="cureData" :step-type="stepType" />
      <div>
        <div>抗凝剂 - {{ formData.anticoagulantName }}</div>
        <el-row :gutter="16">
          <Anticoagulant v-model="formData" />
        </el-row>
      </div>
      <!-- 透析液 -->
      <PrescriptionDialysate v-model="formData" :step-type="stepType" />
      <!-- 项目 -->
      <PrescriptionProjectItem v-model="formData" :cure-data="cureData" :step-type="stepType" />
      <!-- 今日收费项目 -->
      <ChargeTable v-if="stepType === 'CrossCheck'" v-model="formData" :cure-data="cureData" />
    </div>
  </el-form>
</template>

<script setup lang="ts">
import type { CureTodayView, OnCureMiddleView } from '@/services/CureServiceProxies'
import { CureServiceProxy, VerifyCureMiddleView } from '@/services/CureServiceProxies'
import { useAppStore } from '@/stores'
import { dateUtil, formatToDateTime } from '@/utils/date'
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
const sourceFormRef = ref<FormInstance>()
const infoFormRef = ref<FormInstance>()

const formData = ref<VerifyCureMiddleView | OnCureMiddleView>(new VerifyCureMiddleView()) // 上机数据
// 表单校验规则
const formRules = reactive<FormRules<VerifyCureMiddleView>>({
  punctureMethod: [{ required: true, message: '请选择穿刺方法', trigger: 'change' }],
  punctureNurseId: [{ required: true, message: '请选择穿刺护士', trigger: 'change' }],
})

async function initLoad() {
  emit('hanldeChangeLoading', true)
  if (stepType === 'OperateComputer') {
    await getOnCureMiddleData()
  }
  else if (stepType === 'CrossCheck') {
    await getVerifyCureMiddleData()
  }
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
  const onCureMiddleFieldTypeList = ['OnCureMiddle.PatientSource', 'OnCureMiddle.CureMode', 'OnCureMiddle.MeasureCureBefore', 'OnCureMiddle.Dialysate']
  const crossCheckFieldTypeList = ['VerifyCureMiddle.PatientSource', 'VerifyCureMiddle.CureMode', 'VerifyCureMiddle.MeasureCureBefore', 'VerifyCureMiddle.Dialysate']
  const fieldTypeList = stepType === 'OperateComputer' ? onCureMiddleFieldTypeList : crossCheckFieldTypeList
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
/** 查询患者上机数据 */
async function getOnCureMiddleData() {
  const cureServiceProxy = new CureServiceProxy()
  const { success, data, message } = await cureServiceProxy.onCureMiddleGET(cureData.cureRecordId)
  if (success) {
    // 上机时间默认
    (data as OnCureMiddleView).timeOn = (data as OnCureMiddleView).timeOn || dateUtil()
    transFormData(data)
    formData.value = data
  }
  else {
    showNotify({ type: 'danger', message })
  }
}
/** 查询患者交叉核对数据 */
async function getVerifyCureMiddleData() {
  const cureServiceProxy = new CureServiceProxy()
  const { success, data, message } = await cureServiceProxy.verifyCureMiddleGET(cureData.cureRecordId, false)
  if (success) {
    data.timeVerify = data.timeVerify || dateUtil()
    // 保存接口中拒绝状态与查询返回的治疗状态字段重复，将值清除防止保存报错
    data.status = undefined
    transFormData(data)
    formData.value = data
  }
  else {
    showNotify({ type: 'danger', message })
  }
}
/** 预脱、偏移调整、通路数据转换 */
function transFormData(data: OnCureMiddleView | VerifyCureMiddleView) {
  // 预脱根据单位转换
  data.ufg = convertDialysisUnit(data.ufg, paramUfgUnit)
  // 偏移调整根据单位转换
  data.deductionWeight = convertDialysisUnit(data.deductionWeight, paramDeductionUnit)
  // 血管通路Id转数组(如果多个血管通路，将其它血管通路也加到数组中)
  data.patientVascularAccessId = (typeof data.patientVascularAccessId === 'string' ? (data.patientVascularAccessId ? data.patientVascularAccessId.split(',') : null) : null) as unknown as string
  if (data.patientOtherVascularAccessId) {
    (data.patientVascularAccessId as unknown as Array<string>).push(data.patientOtherVascularAccessId)
  }
}
/** 保存 */
async function handleSaveForm() {
  let formSaveData = null
  // el-form中disabled优先级高于表单内组件，故el-form中嵌套el-form解决大部分内容需要禁用但某些字段不禁用，待后期组件库修复该问题可改用一个el-form
  await sourceFormRef.value?.validate(async (valid) => {
    if (valid) {
      await infoFormRef.value?.validate(async (valid) => {
        if (valid) {
          await ruleFormRef.value?.validate((valid) => {
            if (valid) {
              const { patientVascularAccessId, iuf, ufg } = formData.value
              let newUfg = null
              if ((ufg || ufg === 0) && paramUfgUnit === 'kg') {
                newUfg = Number(ufg) * 1000
              }
              formSaveData = {
                ...toRaw(formData.value),
                check: 1,
                iuf: iuf ? 1 : 0,
                patientVascularAccessId: patientVascularAccessId ? patientVascularAccessId[0] : null,
                ufg: newUfg,
              }
            }
          })
        }
      })
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
