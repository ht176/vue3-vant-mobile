<template>
  <el-form ref="ruleFormRef" :model="formData" :rules="formRules" label-width="auto" :disabled="formDisabled">
    <div>
      <slot name="header">
        透后下机
      </slot>
    </div>
    <div class="my-2">
      <AbnormalInfo
        ref="abnormalInfoRef" :patient-id="cureData.patientId" :blood-pressure-show="!!getFieldBloodPressure" :sbp="formData.afterSbp" :dbp="formData.afterDbp"
        :pulse-show="!!getFieldAfterPulse" :pulse="formData.afterPulse" :temp-show="!!(getFieldOffTemp && paramShowTemp)" :temp="formData.offTemp"
      />
    </div>
    <el-row :gutter="16">
      <!-- 下机日期 -->
      <el-col v-if="getFieldTimeOffDate && showTimeOffDate" :span="8" :style="{ order: getFieldTimeOffDate.sequence }">
        <el-form-item :label="getFieldTimeOffDate.label" prop="timeOffDate">
          <el-date-picker v-model="formData.timeOff as unknown as Date" type="datetime" :clearable="false" :placeholder="getFieldTimeOffDate.placeholder" format="YYYY-MM-DD" />
        </el-form-item>
      </el-col>
      <!-- 下机时间 -->
      <el-col v-if="getFieldTimeOffTime" :span="8" :style="{ order: getFieldTimeOffTime.sequence }">
        <el-form-item :label="getFieldTimeOffTime.label" prop="timeOffTime">
          <el-time-picker v-model="formData.timeOff as unknown as Date" :clearable="false" :placeholder="getFieldTimeOffTime.placeholder" />
        </el-form-item>
      </el-col>
      <!-- 实际透析时长 -->
      <el-col v-if="getFieldDialysisDurationFact" :span="8" :style="{ order: getFieldDialysisDurationFact.sequence }">
        <el-form-item :label="getFieldDialysisDurationFact.label" prop="dialysisDurationFact">
          <DialysisDuration v-model="formData.dialysisDurationFact" />
        </el-form-item>
      </el-col>
      <!-- 测量方式 -->
      <el-col v-if="getFieldAfterWeightMode" :span="8" :style="{ order: getFieldAfterWeightMode.sequence }">
        <el-form-item :label="getFieldAfterWeightMode.label" prop="afterWeightMode">
          <Dictionary v-model="formData.afterWeightMode" :dic-code="DIC_PATIENT_MEASURE_WEIGHT_MODE" type="select" :placeholder="getFieldAfterWeightMode.placeholder" @change="handleAfterWeightModeChange" />
        </el-form-item>
      </el-col>
      <!-- 透后体重 -->
      <el-col v-if="getFieldAfterWeight" :span="8" :style="{ order: getFieldAfterWeight.sequence }">
        <el-form-item :label="getFieldAfterWeight.label" prop="afterWeight">
          <el-input v-model="formData.afterWeight" type="number" :placeholder="getFieldAfterWeight.placeholder" @change="handleAfterWeightChange">
            <template #append>
              kg
            </template>
          </el-input>
        </el-form-item>
      </el-col>
      <!-- 透前体重 -->
      <el-col v-if="getFieldBeforeWeight" :span="8" :style="{ order: getFieldBeforeWeight.sequence }">
        <el-form-item :label="getFieldBeforeWeight.label" prop="beforeWeight">
          <el-input v-model="formData.beforeWeight" type="number" :placeholder="getFieldBeforeWeight.placeholder" :disabled="true">
            <template #append>
              kg
            </template>
          </el-input>
        </el-form-item>
      </el-col>
      <!-- 实际脱水量 -->
      <el-col v-if="getFieldUfv" :span="8" :style="{ order: getFieldUfv.sequence }">
        <el-form-item :label="getFieldUfv.label" prop="ufv">
          <el-input v-model="formData.ufv" type="number" :placeholder="getFieldUfv.placeholder">
            <template #append>
              {{ paramUfUnit }}
            </template>
          </el-input>
        </el-form-item>
      </el-col>
      <!-- 净脱水量 -->
      <el-col v-if="paramShowUfc" :span="8" :style="{ order: getFieldUfv?.sequence }">
        <el-form-item label="净脱水量：" prop="ufc">
          <el-input v-model="formData.ufc" type="number" placeholder="请输入净脱水量">
            <template #append>
              {{ paramUfUnit }}
            </template>
          </el-input>
        </el-form-item>
      </el-col>
      <!-- 测量位置 -->
      <el-col v-if="getFieldAfterBpPosition" :span="8" :style="{ order: getFieldAfterBpPosition.sequence }">
        <el-form-item :label="getFieldAfterBpPosition.label" prop="afterBpPosition">
          <Dictionary v-model="formData.afterBpPosition" :dic-code="DIC_PATIENT_MEASURE_BP_POSITION" type="select" :placeholder="getFieldAfterBpPosition.placeholder" @change="handleAfterBpPositionChange" />
        </el-form-item>
      </el-col>
      <!-- 血压 -->
      <el-col v-if="getFieldBloodPressure" :span="8" :style="{ order: getFieldBloodPressure.sequence }">
        <el-form-item :label="getFieldBloodPressure.label" prop="bloodPressure" :rules="getBloodPressureRule">
          <BloodPressure v-model="formData" sbp-field="afterSbp" dbp-field="afterDbp" :disabled="disabledSbp(formData.afterBpPosition)" :is-error="bloodPressureError" @change="handleBloodPressureChange" />
        </el-form-item>
      </el-col>
      <!-- 脉搏 -->
      <el-col v-if="getFieldAfterPulse" :span="8" :style="{ order: getFieldAfterPulse.sequence }">
        <el-form-item prop="afterPulse" :label="getFieldAfterPulse.label" :rules="getBeforePulseRule">
          <el-input v-model="formData.afterPulse" type="number" :placeholder="getFieldAfterPulse.placeholder" :disabled="disabledSbp(formData.afterBpPosition)">
            <template #append>
              bpm
            </template>
          </el-input>
        </el-form-item>
      </el-col>
      <!-- 体温 -->
      <el-col v-if="getFieldOffTemp && paramShowTemp" :span="8" :style="{ order: getFieldOffTemp.sequence }">
        <el-form-item :label="getFieldOffTemp.label" prop="offTemp">
          <el-input v-model="formData.offTemp" type="number" :placeholder="getFieldOffTemp.placeholder" :disabled="disabledSbp(formData.afterBpPosition)">
            <template #append>
              ℃
            </template>
          </el-input>
        </el-form-item>
      </el-col>
      <!-- 呼吸 -->
      <el-col v-if="getFieldOffBreathe && paramShowBreathe" :span="8" :style="{ order: getFieldOffBreathe.sequence }">
        <el-form-item :label="getFieldOffBreathe.label" prop="offBreathe">
          <el-input v-model="formData.offBreathe" type="number" :placeholder="getFieldOffBreathe.placeholder">
            <template #append>
              次/分
            </template>
          </el-input>
        </el-form-item>
      </el-col>
      <template v-if="showOffEarly && getFieldOffEarly">
        <!-- 是否提前下机 -->
        <el-col :span="8" :style="{ order: getFieldOffEarly.sequence }">
          <el-form-item :label="getFieldOffEarly.label" prop="offEarly">
            <el-switch v-model="formData.offEarly" />
          </el-form-item>
        </el-col>
        <template v-if="formData.offEarly">
          <!-- 提前下机模板 -->
          <el-col :span="24" :style="{ order: getFieldOffEarly.sequence }">
            <el-form-item label="提前下机模板：">
              <Dictionary v-model="tempEarlyValue" :dic-code="DIC_DIALYSIS_OFFEARLY_TMPL" type="select" :is-multiple="true" placeholder="请选择提前下机模板" @change="handleTempOffEarlyChange" />
            </el-form-item>
          </el-col>
          <!-- 提前下机原因 -->
          <el-col :span="24" :style="{ order: getFieldOffEarly.sequence }">
            <el-form-item label="提前下机原因：">
              <el-input v-model="formData.offEarlyCause" type="textarea" :rows="2" placeholder="请输入提前下机原因" />
            </el-form-item>
          </el-col>
        </template>
      </template>
      <!-- 自定义字段 -->
      <el-col v-for="item in getCustomFieldList?.filter(x => x.sysFieldTypeCode === getFieldType)" :key="item.fieldKey" :span="8" :style="{ order: item.sequence }">
        <DialysisCustomFiled v-model="formData.cureRecordFieldItems.find(x => x.fieldKey === item.fieldKey).fieldValue" :item="item" :index="formData.cureRecordFieldItems.findIndex(x => x.fieldKey === item.fieldKey)" />
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup lang="ts">
import type { CureTodayView } from '@/services/CureServiceProxies'
import { CureServiceProxy, OffCureAfterView } from '@/services/CureServiceProxies'
import { useAppStore } from '@/stores'
import { dateUtil, formatToDate, formatToDateTime, formatToTimeHM, getNowDate } from '@/utils/date'
import { calcUfvValue, disabledSbp, disabledWeight } from '@/utils/dialysis'
import type { FormInstance, FormRules } from 'element-plus'
import { showNotify } from 'vant'
import { DIC_DIALYSIS_OFFEARLY_TMPL, DIC_PATIENT_MEASURE_BP_POSITION, DIC_PATIENT_MEASURE_WEIGHT_MODE } from '@/utils/constant'
import dayjs from 'dayjs'

interface CustomOffCureAfterView extends OffCureAfterView {
  timeOffDate?: dayjs.Dayjs | undefined
  timeOffTime?: dayjs.Dayjs | undefined
}
const { cureData, formDisabled } = defineProps({
  cureData: {
    type: Object as PropType<CureTodayView>,
  },
  stepType: { type: String as PropType<DialysisStepType>, required: true },
  formDisabled: { type: Boolean, default: false },
})
const emit = defineEmits(['hanldeChangeLoading'])
const { sysFiledList, getParametersValue, getDicDataByCode } = useAppStore()

onBeforeMount(async () => {
  // 加载自定义字段
  await getAllFieldList()
})
onMounted(() => {
  initLoad()
})
const ruleFormRef = ref<FormInstance>()
const formData = ref<OffCureAfterView>(new OffCureAfterView()) // 下机表单数据
// 表单校验规则
const formRules = reactive<FormRules<CustomOffCureAfterView>>({
  timeOffDate: [{ required: false, validator: timeOffDateRule, trigger: 'change' }],
  timeOffTime: [{ required: false, validator: timeOffTimeRule, trigger: 'change' }],
  ufc: [{ required: true, message: '请输入净脱水量', trigger: 'blur' }],
})
function timeOffDateRule(rule, _value, callback) {
  if (rule.required) {
    if (formData.value.timeOff) {
      if (formatToDate(formData.value.timeOff) < formatToDate(formData.value.timeOn)) {
        callback(new Error(`下机日期不能小于${formatToDate(formData.value.timeOn)}`))
      }
      callback()
    }
    callback(new Error('请选择下机日期'))
  }
  callback()
}
function timeOffTimeRule(rule, _value, callback) {
  if (rule.required) {
    if (formData.value.timeOff) {
      if (formatToTimeHM(formData.value.timeOff) < formatToTimeHM(formData.value.timeOn)) {
        callback(new Error(`下机时间不能小于${formatToTimeHM(formData.value.timeOn)}`))
      }
      callback()
    }
    callback(new Error('请选择下机时间'))
  }
  callback()
}
const abnormalInfoRef = ref(null)
/** 上机时间是否当天 */
const showTimeOffDate = computed(() => {
  return getNowDate() !== formatToDate(formData.value.timeOn)
})
/** 透后体重默认测量方式 */
const paramDefaultWeightModeAfter = getParametersValue('CUREFLOW.DEFAULT.WEIGHT.MODE.AFTER')
/** 超滤单位 */
const paramUfUnit = getParametersValue('DIALYSIS.UF.UNIT')
/** 显示净脱水量 */
const paramShowUfc = getParametersValue('CUREFLOW.UFC.SHOW', true)
/** 体温是否展示 */
const paramShowTemp = getParametersValue('CUREFLOW.TEMP.SHOW', true)
/** 下机呼吸展示 */
const paramShowBreathe = getParametersValue('CUREFLOW.BREATHE.SHOW', true)
/** 提前下机 */
const showOffEarly = computed(() => {
  return formatToDateTime(dayjs(formData.value.timeOn).add(formData.value.dialysisDurationSet, 'm'), 'YYYY-MM-DD HH:mm') > formatToDateTime(formData.value.timeOff, 'YYYY-MM-DD HH:mm')
})
/** 初始化下机数据 */
async function initLoad() {
  emit('hanldeChangeLoading', true)
  await getOffCureAfterData()
  if (ruleFormRef.value) {
    ruleFormRef.value.clearValidate()
  }
  emit('hanldeChangeLoading', false)
}
/** 获取下机数据 */
async function getOffCureAfterData() {
  const cureServiceProxy = new CureServiceProxy()
  const { success, data, message } = await cureServiceProxy.offCureAfterGET(cureData.cureRecordId)
  if (success) {
    data.cureRecordFieldItems.forEach((x) => {
      x.cureRecordId = x.cureRecordId || cureData.cureRecordId || cureData.cureScheduleId
    })
    data.timeOff = data.timeOff || dateUtil()
    if (!data.afterWeightMode) {
      data.afterWeightMode = paramDefaultWeightModeAfter
    }
    if ((data.ufv || data.ufv === 0) && paramUfUnit === 'kg') {
      data.ufv = Number(data.ufv) / 1000
    }
    formData.value = data
  }
  else {
    showNotify({ type: 'danger', message })
  }
}
const getFieldType = 'OffCure'
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
/** 获取模块所有字段 */
function getAllFieldList() {
  allFiledList.value = sysFiledList.filter(x => x.show && x.sysFieldTypeCode === getFieldType).map((x) => {
    const label = x.name2 || x.name
    return { ...x, label: `${label}：`, placeholder: `${x.dataType === 'OPTION' ? '请选择' : '请输入'}${label}` }
  })
}
function getSysFieldProperty(key, typeCode) {
  return getSysFieldList.value.find(x => x.value === key && x.sysFieldTypeCode === typeCode)
}
const getFieldTimeOffDate = computed(() => {
  return getSysFieldProperty('timeOffDate', getFieldType)
})
const getFieldTimeOffTime = computed(() => {
  return getSysFieldProperty('timeOffTime', getFieldType)
})
const getFieldDialysisDurationFact = computed(() => {
  return getSysFieldProperty('dialysisDurationFact', getFieldType)
})
const getFieldAfterWeightMode = computed(() => {
  return getSysFieldProperty('afterWeightMode', getFieldType)
})
const getFieldAfterWeight = computed(() => {
  return getSysFieldProperty('afterWeight', getFieldType)
})
const getFieldBeforeWeight = computed(() => {
  return getSysFieldProperty('beforeWeight', getFieldType)
})
const getFieldUfv = computed(() => {
  return getSysFieldProperty('ufv', getFieldType)
})
const getFieldAfterBpPosition = computed(() => {
  return getSysFieldProperty('afterBpPosition', getFieldType)
})
const getFieldBloodPressure = computed(() => {
  return getSysFieldProperty('bloodPressure', getFieldType)
})
// 血压错误状态
const bloodPressureError = ref(false)
const getBloodPressureRule = computed(() => [{ required: getFieldBloodPressure.value.required || (formData.value.afterBpPosition !== 'NOMEASURE' && !(disabledSbp(formData.value.afterBpPosition))), validator: validateBloodRule, trigger: 'blur' }])
function validateBloodRule(_rule, _value, callback) {
  setTimeout(() => {
    bloodPressureError.value = true
    const { afterSbp, afterDbp } = formData.value
    if ((!disabledSbp(formData.value.afterBpPosition) && formData.value.afterBpPosition !== 'NOMEASURE') || getFieldBloodPressure.value.required) {
      if ((!afterSbp && afterDbp) && afterSbp !== 0) {
        callback(new Error('请输入收缩压'))
      }
      else if ((afterSbp && !afterDbp) && afterDbp !== 0) {
        callback(new Error('请输入舒张压'))
      }
      else if (!afterSbp && !afterDbp && afterSbp !== 0 && afterDbp !== 0) {
        callback(new Error('请输入血压'))
      }
      else if (afterSbp > 999 || afterSbp < 0 || afterDbp > 999 || afterDbp < 0) {
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
const getFieldAfterPulse = computed(() => {
  return getSysFieldProperty('afterPulse', getFieldType)
})
const getBeforePulseRule = computed(() => [{ required: getFieldAfterPulse.value.required || (formData.value.afterBpPosition !== 'NOMEASURE' && !(disabledSbp(formData.value.afterBpPosition))), message: getFieldAfterPulse.value.placeholder, trigger: 'blur' }])
const getFieldOffTemp = computed(() => {
  return getSysFieldProperty('offTemp', getFieldType)
})
const getFieldOffBreathe = computed(() => {
  return getSysFieldProperty('offBreathe', getFieldType)
})
const getFieldOffEarly = computed(() => {
  return getSysFieldProperty('offEarly', getFieldType)
})
const tempEarlyValue = ref(null)
/** 改变透后体重测量方式 */
function handleAfterWeightModeChange(val) {
  if (disabledWeight(val)) {
    formData.value.afterWeight = null
  }
}
/** 改变透后血压测量方式 */
function handleAfterBpPositionChange() {
  if (disabledSbp(formData.value.afterBpPosition)) {
    formData.value.afterSbp = null
    formData.value.afterDbp = null
  }
}
/** 是否自动计算实际脱水量 */
const paramAutoCalcUfv = getParametersValue('CUREFLOW.AUTO.CALCULATEDEHYDRATION')
/** 变更透后体重 */
function handleAfterWeightChange() {
  const { beforeWeight, afterWeight } = formData.value
  if (paramAutoCalcUfv) {
    formData.value.ufv = calcUfvValue(beforeWeight, afterWeight, paramUfUnit) || formData.value.ufv
  }
}
const dicBpPosition = getDicDataByCode(DIC_PATIENT_MEASURE_BP_POSITION)
/** 改变透后血压 */
function handleBloodPressureChange() {
  const { afterSbp, afterDbp, afterBpPosition } = formData.value
  if ((afterSbp || afterDbp) && afterBpPosition === (dicBpPosition.find(x => x.value === 'NOMEASURE')?.value || '')) {
    formData.value.afterBpPosition = (dicBpPosition.find(x => x.value === 'UP')?.value || '')
  }
}
watch(() => [formData.value.afterSbp, formData.value.afterDbp], () => {
  handleBloodPressureChange()
})
/** 变更提前下机模板 */
function handleTempOffEarlyChange(val) {
  formData.value.offEarlyCause = val?.toString()
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
  paramUfUnit,
})
</script>

<style scoped lang="less">
</style>
