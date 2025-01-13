<template>
  <div>
    透前测量
  </div>
  <div>
    异常信息
    <!-- {{ getAbnormal }} -->
  </div>
  <el-form ref="ruleFormRef" :model="formData" status-icon :rules="formRules" label-width="auto">
    <el-row :gutter="20">
      <!-- 签到时间 -->
      <el-col v-if="getFieldTimeSignin" :span="8" :style="{ order: getFieldTimeSignin.sequence }">
        <el-form-item :label="getFieldTimeSignin.label" prop="timeSignin">
          <el-date-picker v-model="formData.timeSignin as unknown as Date" class="!w-full" type="datetime" :placeholder="getFieldTimeSignin.placeholder" format="HH:mm" />
        </el-form-item>
      </el-col>
      <!-- 测量方式 -->
      <el-col v-if="getFieldBeforeWeightMode" :span="8" :style="{ order: getFieldBeforeWeightMode.sequence }">
        <el-form-item :label="getFieldBeforeWeightMode.label" prop="beforeWeightMode">
          <Dictionary v-model="formData.beforeWeightMode" :dic-code="DIC_PATIENT_MEASURE_WEIGHT_MODE" type="select" :placeholder="getFieldBeforeWeightMode.placeholder" />
        </el-form-item>
      </el-col>
      <!-- 透前体重 -->
      <el-col v-if="getFieldBeforeWeight" :span="8" :style="{ order: getFieldBeforeWeight.sequence }">
        <el-form-item :label="getFieldBeforeWeight.label" prop="beforeWeight">
          <el-input v-model="formData.beforeWeight" type="number" :placeholder="getFieldBeforeWeight.placeholder">
            <template #append>
              kg
            </template>
          </el-input>
        </el-form-item>
      </el-col>
      <!-- 干体重 -->
      <el-col v-if="getFieldBestWeight" :span="8" :style="{ order: getFieldBestWeight.sequence }">
        <el-form-item :label="getFieldBestWeight.label" prop="bestWeight">
          <el-input v-model="formData.bestWeight" type="number" :placeholder="getFieldBestWeight.placeholder">
            <template #append>
              kg
            </template>
          </el-input>
        </el-form-item>
      </el-col>
      <!-- 偏移调整 -->
      <el-col v-if="getFieldDeductionWeight" :span="8" :style="{ order: getFieldDeductionWeight.sequence }">
        <el-form-item :label="getFieldDeductionWeight.label" prop="deductionWeight">
          <el-input v-model="formData.deductionWeight" :placeholder="getFieldDeductionWeight.placeholder" type="number">
            <template #append>
              {{ paramDeductionUnit }}
            </template>
          </el-input>
        </el-form-item>
      </el-col>
      <!-- 预脱 -->
      <el-col v-if="getFieldUfg" :span="8" :style="{ order: getFieldUfg.sequence }">
        <el-form-item :label="getFieldUfg.label" prop="ufg">
          <el-input v-model="formData.ufg" type="number" :placeholder="getFieldUfg.placeholder">
            <template #append>
              {{ paramPreStrippingUnit }}
            </template>
          </el-input>
        </el-form-item>
      </el-col>
      <!-- 测量位置 -->
      <el-col v-if="getFieldBeforeBpPosition" :span="8" :style="{ order: getFieldBeforeBpPosition.sequence }">
        <el-form-item :label="getFieldBeforeBpPosition.label" prop="beforeBpPosition">
          <Dictionary v-model="formData.beforeBpPosition" :dic-code="DIC_PATIENT_MEASURE_BP_POSITION" type="select" :placeholder="getFieldBeforeBpPosition.placeholder" />
        </el-form-item>
      </el-col>
      <!-- 血压 -->
      <el-col v-if="getFieldBloodPressure" :span="8" :style="{ order: getFieldBloodPressure.sequence }">
        <el-form-item :label="getFieldBloodPressure.label">
          <BloodPressure v-model="formData" sbp-field="beforeSbp" dbp-field="beforeDbp" />
        </el-form-item>
      </el-col>
      <!-- 脉搏 -->
      <el-col v-if="getFieldBeforePulse" :span="8" :style="{ order: getFieldBeforePulse.sequence }">
        <el-form-item prop="beforePulse" :label="getFieldBeforePulse.label">
          <el-input v-model="formData.beforePulse" type="number" :placeholder="getFieldBeforePulse.placeholder">
            <template #append>
              bpm
            </template>
          </el-input>
        </el-form-item>
      </el-col>
      <!-- 体温 -->
      <el-col v-if="getFieldOnTemp && paramShowTemp" :span="8" :style="{ order: getFieldOnTemp.sequence }">
        <el-form-item :label="getFieldOnTemp.label" prop="onTemp">
          <el-input v-model="formData.onTemp" type="number" :placeholder="getFieldOnTemp.placeholder">
            <template #append>
              ℃
            </template>
          </el-input>
        </el-form-item>
      </el-col>
      <!-- 上次透后体重 -->
      <el-col v-if="getFieldLastAfterWeight" :span="8" :style="{ order: getFieldLastAfterWeight.sequence }">
        <el-form-item :label="getFieldLastAfterWeight.label" prop="LastAfterWeight">
          <el-input v-model="formData.lastAfterWeight" disabled>
            <template #append>
              kg
            </template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col v-for="item in getCustomFieldList?.filter(x => x.sysFieldTypeCode === getFieldType)" :key="item.fieldKey" :span="8" :style="{ order: item.sequence }">
        <DialysisCustomFiled v-model="formData.cureRecordFieldItems.find(x => x.fieldKey === item.fieldKey).fieldValue" :item="item" :index="formData.cureRecordFieldItems.findIndex(x => x.fieldKey === item.fieldKey)" />
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup lang="ts">
import { CureServiceProxy, CureTodayView, MeasureCureBeforeView } from '@/services/CureServiceProxies'
import { useAppStore } from '@/stores'
import { DIC_PATIENT_MEASURE_BP_POSITION, DIC_PATIENT_MEASURE_WEIGHT_MODE } from '@/utils/constant'
import type { FormInstance, FormRules } from 'element-plus'

const { cureData, type } = defineProps({
  cureData: CureTodayView,
  type: {
    type: Number,
    default: 1,
  },
})

const { sysFiledList, getParametersValue } = useAppStore()

onBeforeMount(() => {
  // 加载自定义字段
  getAllFieldList()
})
onMounted(() => {
  // 加载透前测量数据
  getData()
})
const ruleFormRef = ref<FormInstance>()
const formData = ref<MeasureCureBeforeView>(new MeasureCureBeforeView()) // 透前测量表单数据
const formRules = reactive<FormRules<typeof formData>>({}) // 表单校验规则
async function getData() {
  const cureServiceProxy = new CureServiceProxy()
  const { success, data } = await cureServiceProxy.measureCureBeforeGET2(cureData.cureRecordId)
  if (success) {
    formData.value = data
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
const getFieldType = computed(() => {
  let formType = ''
  switch (type) {
    case 1:
      formType = 'MeasureCureBefore'
      break
    case 2:
      formType = 'VerifyCureMiddle.MeasureCureBefore'
      break
    default:
      formType = 'MeasureCureBefore'
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
  return getSysFieldProperty('TimeSignin', getFieldType.value)
})
const getFieldBeforeWeightMode = computed(() => {
  return getSysFieldProperty('BeforeWeightMode', getFieldType.value)
})
const getFieldBeforeWeight = computed(() => {
  return getSysFieldProperty('BeforeWeight', getFieldType.value)
})
const getFieldBestWeight = computed(() => {
  return getSysFieldProperty('BestWeight', getFieldType.value)
})
const getFieldDeductionWeight = computed(() => {
  return getSysFieldProperty('DeductionWeight', getFieldType.value)
})
/** 偏移量单位 */
const paramDeductionUnit = getParametersValue('DIALYSIS.DEDUCTION.UNIT')
const getFieldUfg = computed(() => {
  return getSysFieldProperty('Ufg', getFieldType.value)
})
/** 预脱单位 */
const paramPreStrippingUnit = getParametersValue('DIALYSIS.UF.UNIT')
const getFieldBeforeBpPosition = computed(() => {
  return getSysFieldProperty('BeforeBpPosition', getFieldType.value)
})
const getFieldBloodPressure = computed(() => {
  return getSysFieldProperty('BloodPressure', getFieldType.value)
})
const getFieldBeforePulse = computed(() => {
  return getSysFieldProperty('BeforePulse', getFieldType.value)
})
const getFieldOnTemp = computed(() => {
  return getSysFieldProperty('OnTemp', getFieldType.value)
})
/** 体温是否展示 */
const paramShowTemp = getParametersValue('CUREFLOW.TEMP.SHOW', true)
const getFieldLastAfterWeight = computed(() => {
  return getSysFieldProperty('LastAfterWeight', getFieldType.value)
})

// // 收缩压系统配置最高范围
// function paramMaxSbpValue() {
//   const patientThreshold = this.patientThresholdData.find(_ => _.PatientId === this.signinfo.PatientId)
//   const code = 'VITALSIGNS.SBP.HIGH'
//   const itemFind = this.sysSettingData.find(_ => _.Code === code)
//   if (patientThreshold) {
//     return patientThreshold.SbpHigh
//   }
//   else {
//     if (itemFind) {
//       return itemFind.Value
//     }
//     else {
//       return ''
//     }
//   }
// }
// /** 异常信息 */
// const getAbnormal = computed(() => {
//   const array = []
//   if (getFieldBloodPressure.value && formData.value.beforeSbp && (Number(this.sbphigh) < Number(this.signinfo.blood.sbp) || Number(this.sbplower) > Number(this.signinfo.blood.sbp))) {
//     array.push({
//       type: 'sbp',
//       message: `收缩压不在范围内（ 参考范围：${this.sbplower}${this.bpunit} ~ ${this.sbphigh}${this.bpunit}）`,
//     })
//   }
//   return array
// })
</script>

<style scoped lang="less">
</style>
