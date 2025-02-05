<template>
  <el-form ref="ruleFormRef" :model="formData" :rules="formRules" label-width="auto" :disabled="formDisabled">
    <div>
      <slot name="header">
        消毒
      </slot>
    </div>
    <el-row :gutter="16">
      <!-- 机器号 -->
      <el-col v-if="getFieldDialysisMachineNo" :span="8" :style="{ order: getFieldDialysisMachineNo.sequence }">
        <el-form-item :label="getFieldDialysisMachineNo.label" prop="dialysisMachineNo">
          <el-input v-model="formData.dialysisMachineNo" type="number" :placeholder="getFieldDialysisMachineNo.placeholder" :disabled="true" />
        </el-form-item>
      </el-col>
      <!-- 开始日期 -->
      <el-col v-if="getFieldBeginDate" :span="8" :style="{ order: getFieldBeginDate.sequence }">
        <el-form-item :label="getFieldBeginDate.label" prop="beginDate">
          <el-date-picker v-model="formData.beginDate as unknown as Date" type="datetime" :clearable="false" :placeholder="getFieldBeginDate.placeholder" format="YYYY-MM-DD" value-format="YYYY-MM-DD HH:mm:ss" @change="handleTimeChange" />
        </el-form-item>
      </el-col>
      <!-- 开始时间 -->
      <el-col v-if="getFieldBeginTime" :span="8" :style="{ order: getFieldBeginTime.sequence }">
        <el-form-item :label="getFieldBeginTime.label" prop="beginTime">
          <el-time-picker v-model="formData.beginDate as unknown as Date" :clearable="false" :placeholder="getFieldBeginTime.placeholder" format="HH:mm" value-format="YYYY-MM-DD HH:mm:ss" @change="handleTimeChange" />
        </el-form-item>
      </el-col>
      <!-- 结束日期 -->
      <el-col v-if="getFieldEndDate" :span="8" :style="{ order: getFieldEndDate.sequence }">
        <el-form-item :label="getFieldEndDate.label" prop="endDate">
          <el-date-picker v-model="formData.endDate as unknown as Date" type="datetime" :clearable="false" :placeholder="getFieldEndDate.placeholder" format="YYYY-MM-DD" value-format="YYYY-MM-DD HH:mm:ss" @change="handleTimeChange" />
        </el-form-item>
      </el-col>
      <!-- 结束时间 -->
      <el-col v-if="getFieldEndTime" :span="8" :style="{ order: getFieldEndTime.sequence }">
        <el-form-item :label="getFieldEndTime.label" prop="endTime">
          <el-time-picker v-model="formData.endDate as unknown as Date" :clearable="false" :placeholder="getFieldEndTime.placeholder" format="HH:mm" value-format="YYYY-MM-DD HH:mm:ss" @change="handleTimeChange" />
        </el-form-item>
      </el-col>
      <!-- 消毒时长 -->
      <el-col v-if="getFieldDisinfectTime" :span="8" :style="{ order: getFieldDisinfectTime.sequence }">
        <el-form-item :label="getFieldDisinfectTime.label" prop="disinfectTime">
          <el-input v-model="formData.disinfectTime" type="number" :placeholder="getFieldDisinfectTime.placeholder" @change="handleDisinfectTimeChange">
            <template #append>
              min
            </template>
          </el-input>
        </el-form-item>
      </el-col>
      <!-- 机内消毒 -->
      <el-col v-if="getFieldProgramInternal" :span="8" :style="{ order: getFieldProgramInternal.sequence }">
        <el-form-item :label="getFieldProgramInternal.label" prop="programInternal">
          <Dictionary v-model="formData.programInternal" :dic-code="DIC_DEV_DIS_PROGRAM_INTERNAL" type="select" :is-multiple="true" split-value=";" :placeholder="getFieldProgramInternal.placeholder" />
        </el-form-item>
      </el-col>
      <!-- 机内消毒人 -->
      <el-col v-if="getFieldInternalOperatorId" :span="8" :style="{ order: getFieldInternalOperatorId?.sequence }">
        <el-form-item :label="getFieldInternalOperatorId.label" prop="internalOperatorId">
          <UserInfoSelect v-model="formData.internalOperatorId" user-type="nurse" :placeholder="getFieldInternalOperatorId.placeholder" />
        </el-form-item>
      </el-col>
      <!-- 机外消毒 -->
      <el-col v-if="getFieldProgramExterior" :span="8" :style="{ order: getFieldProgramExterior.sequence }">
        <el-form-item :label="getFieldProgramExterior.label" prop="programExterior">
          <Dictionary v-model="formData.programExterior" :dic-code="DIC_DEV_DIS_PROGRAM_EXTERIOR" type="select" :is-multiple="true" :placeholder="getFieldProgramExterior.placeholder" />
        </el-form-item>
      </el-col>
      <!-- 机外消毒人 -->
      <el-col v-if="getFieldExternalOperatorId" :span="8" :style="{ order: getFieldExternalOperatorId?.sequence }">
        <el-form-item :label="getFieldExternalOperatorId.label" prop="externalOperatorId">
          <UserInfoSelect v-model="formData.externalOperatorId" user-type="nurse" :placeholder="getFieldExternalOperatorId.placeholder" />
        </el-form-item>
      </el-col>
      <template v-if="formData.sphygmomanometerCuff">
        <!-- 袖带消毒方式 -->
        <el-col :span="8" :style="{ order: getFieldExternalOperatorId?.sequence }">
          <el-form-item :label="getFieldExternalOperatorId.label">
            <Dictionary v-model="formData.programSphygmomanometerCuff" :dic-code="DIC_DEV_DIS_PROGRAM_SPHYGMOMANOMETERCUFF" type="select" />
          </el-form-item>
        </el-col>
        <!-- 袖带消毒人 -->
        <el-col :span="8" :style="{ order: getFieldExternalOperatorId?.sequence }">
          <el-form-item :label="getFieldExternalOperatorId.label">
            <UserInfoSelect v-model="formData.sphygmomanometerCuffOperatorId" user-type="nurse" />
          </el-form-item>
        </el-col>
      </template>
      <template v-if="formData.programInternal">
        <!-- 消毒温度 -->
        <el-col v-if="getFieldDisinfectTemp && formData.programInternal.includes('热消毒')" :span="8" :style="{ order: getFieldDisinfectTemp?.sequence }">
          <el-form-item :label="getFieldDisinfectTemp.label" prop="disinfectTemp">
            <el-input v-model="formData.disinfectTemp" type="number" :placeholder="getFieldDisinfectTemp.placeholder">
              <template #append>
                ℃
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <!-- 柠檬酸消毒温度 -->
        <el-col v-if="getFieldCitricAcidTemp && formData.programInternal.includes('柠檬酸')" :span="8" :style="{ order: getFieldCitricAcidTemp?.sequence }">
          <el-form-item :label="getFieldCitricAcidTemp.label" prop="citricAcidTemp">
            <el-input v-model="formData.citricAcidTemp" type="number" :placeholder="getFieldCitricAcidTemp.placeholder">
              <template #append>
                ℃
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </template>
      <!-- 床单元清洁 -->
      <el-col v-if="getFieldBedUnitCleaning" :span="8" :style="{ order: getFieldBedUnitCleaning.sequence }">
        <el-form-item :label="getFieldBedUnitCleaning.label" prop="bedUnitCleaning">
          <el-input v-if="paramBedUnitClean === '1' || paramBedUnitClean === '3'" v-model="formData.bedUnitCleaning" :placeholder="getFieldBedUnitCleaning.placeholder" />
          <el-switch v-else v-model="formData.bedUnitCleaning" active-value="是" inactive-value="否" />
        </el-form-item>
      </el-col>
      <!-- 过滤网清洗与更换 -->
      <el-col v-if="getFieldFilterScreenChanging && paramFilterScreenChange" :span="8" :style="{ order: getFieldFilterScreenChanging.sequence }">
        <el-form-item :label="getFieldFilterScreenChanging.label" prop="filterScreenChanging">
          <el-switch v-model="formData.filterScreenChanging" />
        </el-form-item>
      </el-col>
      <!-- 消毒说明模板 -->
      <el-col v-if="getFieldTmplDisinfectInstructions" :span="8" :style="{ order: getFieldTmplDisinfectInstructions.sequence }">
        <el-form-item :label="getFieldTmplDisinfectInstructions.label" prop="tmplDisinfectInstructions">
          <el-select v-model="tmplDisinfectInstructions" placeholder="请选择消毒说明模板" @change="handleTmplDisinfectInstructionChange">
            <el-option
              v-for="item in dialysisStore.tmplDisinfectInstructionList"
              :key="item.id"
              :label="item.name"
              :value="item.content"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <!-- 设备状态 -->
      <el-col v-if="getFieldEquipmentStatus" :span="8" :style="{ order: getFieldEquipmentStatus.sequence }">
        <el-form-item :label="getFieldEquipmentStatus.label" prop="equipmentStatus">
          <Dictionary v-model="formData.equipmentStatus" :dic-code="EQUIPMENTSTATUS" type="select" :placeholder="getFieldEquipmentStatus.placeholder" />
        </el-form-item>
      </el-col>
      <!-- 消毒说明 -->
      <el-col v-if="getFieldDisinfectInstructions" :span="24" :style="{ order: getFieldDisinfectInstructions.sequence }">
        <el-form-item :label="getFieldDisinfectInstructions.label" prop="disinfectInstructions">
          <el-input v-model="formData.disinfectInstructions" type="textarea" :rows="2" :placeholder="getFieldDisinfectInstructions.placeholder" />
        </el-form-item>
      </el-col>
      <!-- 自定义字段 -->
      <el-col v-for="item in getCustomFieldList?.filter(x => x.sysFieldTypeCode === getFieldType)" :key="item.fieldKey" :span="8" :style="{ order: item.sequence }">
        <DialysisCustomFiled v-model="formData.cureRecordFieldItems.find(x => x.fieldKey === item.fieldKey).fieldValue" :item="item" :index="formData.cureRecordFieldItems.findIndex(x => x.fieldKey === item.fieldKey)" />
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup lang="ts">
import type { CureTodayView } from '@/services/CureServiceProxies'
import { CureServiceProxy, DisinfectCureAfterView } from '@/services/CureServiceProxies'
import { TmplDisinfectInstructionsServiceProxy } from '@/services/TmplServiceProxies'
import { useAppStore, useDialysisStore } from '@/stores'
import { formatToDate, formatToDateTime, formatToTimeHM } from '@/utils/date'
import type { FormInstance, FormRules } from 'element-plus'
import { showNotify } from 'vant'
import {
  DIALYSIS_BEDUNIT_CLEAN,
  DIC_DEV_DIS_PROGRAM_EXTERIOR,
  DIC_DEV_DIS_PROGRAM_INTERNAL,
  DIC_DEV_DIS_PROGRAM_SPHYGMOMANOMETERCUFF,
  EQUIPMENTSTATUS,
} from '@/utils/constant'
import dayjs, { type Dayjs } from 'dayjs'

interface CustomDisinfectCureAfterView extends DisinfectCureAfterView {
  beginTime?: dayjs.Dayjs | undefined
  endTime?: dayjs.Dayjs | undefined
}
const { cureData, formDisabled } = defineProps({
  cureData: {
    type: Object as PropType<CureTodayView>,
  },
  stepType: { type: String as PropType<DialysisStepType>, required: true },
  formDisabled: { type: Boolean, default: false },
})
const emit = defineEmits(['hanldeChangeLoading'])
const dialysisStore = useDialysisStore()
const { sysFiledList, getParametersValue } = useAppStore()

onBeforeMount(async () => {
  // 加载自定义字段
  await getAllFieldList()
})
onMounted(() => {
  initLoad()
})
const ruleFormRef = ref<FormInstance>()
const formData = ref<DisinfectCureAfterView>(new DisinfectCureAfterView()) // 消毒表单数据
// 表单校验规则
const formRules = reactive<FormRules<CustomDisinfectCureAfterView>>({
  beginDate: [{ required: false, validator: beginDateRule, trigger: 'change' }],
  beginTime: [{ required: false, validator: beginTimeRule, trigger: 'change' }],
  endDate: [{ required: false, validator: endDateRule, trigger: 'change' }],
  endTime: [{ required: false, validator: endTimeRule, trigger: 'change' }],
})

function beginDateRule(rule, _value, callback) {
  if (rule.required) {
    if (formData.value.beginDate) {
      if (formatToDate(formData.value.beginDate) < formatToDate(formData.value.timeOff)) {
        callback(new Error(`开始日期不能小于${formatToDate(formData.value.timeOff)}`))
      }
      callback()
    }
    callback(new Error('请选择开始日期'))
  }
  callback()
}
function beginTimeRule(rule, _value, callback) {
  if (rule.required) {
    if (formData.value.beginDate) {
      if (formatToTimeHM(formData.value.beginDate) < formatToTimeHM(formData.value.timeOff)) {
        callback(new Error(`开始时间不能小于${formatToTimeHM(formData.value.timeOff)}`))
      }
      callback()
    }
    callback(new Error('请选择开始时间'))
  }
  callback()
}
function endDateRule(rule, _value, callback) {
  if (rule.required) {
    if (formData.value.endDate) {
      if (formatToDate(formData.value.endDate) < formatToDate(formData.value.beginDate)) {
        callback(new Error(`结束日期不能小于${formatToDate(formData.value.beginDate)}`))
      }
      callback()
    }
    callback(new Error('请选择结束日期'))
  }
  callback()
}
function endTimeRule(rule, _value, callback) {
  if (rule.required) {
    if (formData.value.beginDate) {
      if (formatToTimeHM(formData.value.endDate) < formatToTimeHM(formData.value.beginDate)) {
        callback(new Error(`结束时间不能小于${formatToTimeHM(formData.value.beginDate)}`))
      }
      callback()
    }
    callback(new Error('请选择结束时间'))
  }
  callback()
}
const tmplDisinfectInstructions = ref('')
/** 床单元清洁 */
const paramBedUnitClean = getParametersValue(DIALYSIS_BEDUNIT_CLEAN)
/** 过滤网更换 */
const paramFilterScreenChange = getParametersValue('DIALYSIS.FILTERSCREEN.CHANGE', true)
/** 下机时间增加时长(分钟)替换消毒时间 */
const paramAutoDisinfectTime = getParametersValue('CUREFLOW.AUTO.DISINFECTTIME')
/** 初始化消毒数据 */
async function initLoad() {
  emit('hanldeChangeLoading', true)
  if (dialysisStore.tmplDisinfectInstructionList.length === 0) {
    await getTmplDisinfectInstructions()
  }
  await getOffCureAfterData()
  if (!cureData.hasDisinfectAfter) {
    const { dialysisMachineType, dialysisMachineModel, shiftId, filterScreenChanging } = formData.value
    const obj = dialysisStore.getDevDisinfectSettingData(dialysisMachineType, dialysisMachineModel, shiftId)
    const beginDate = formData.value.timeOff.add(Number(paramAutoDisinfectTime), 'm')
    const endDate = beginDate.add(Number(obj?.disinfectTime || 0), 'm')
    if (obj) {
      Object.assign(formData.value, {
        ...obj,
        beginDate: formatToDateTime(beginDate),
        endDate: formatToDateTime(endDate),
        filterScreenChanging: filterScreenChanging ?? false,
      })
    }
  }
  if (ruleFormRef.value) {
    ruleFormRef.value.clearValidate()
  }
  emit('hanldeChangeLoading', false)
}
/** 获取消毒数据 */
async function getOffCureAfterData() {
  const cureServiceProxy = new CureServiceProxy()
  const { success, data, message } = await cureServiceProxy.disinfectCureAfterGET(cureData.cureRecordId)
  if (success) {
    data.cureRecordFieldItems.forEach((x) => {
      x.cureRecordId = x.cureRecordId || cureData.cureRecordId || cureData.cureScheduleId
    })
    data.bedUnitCleaning = cureData.hasDisinfectAfter ? data.bedUnitCleaning : ((paramBedUnitClean === '0' || paramBedUnitClean === '1') ? '是' : '否')
    formData.value = data
  }
  else {
    showNotify({ type: 'danger', message })
  }
}

/** 获取消毒说明模板 */
async function getTmplDisinfectInstructions() {
  const tmplDisinfectInstructionsServiceProxy = new TmplDisinfectInstructionsServiceProxy()
  const { success, data } = await tmplDisinfectInstructionsServiceProxy.filter14(undefined)
  if (success) {
    dialysisStore.setTmplDisinfectInstructionList(data)
  }
}
const getFieldType = 'Disinfect'
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
const getFieldDialysisMachineNo = computed(() => {
  return getSysFieldProperty('dialysisMachineNo', getFieldType)
})
const getFieldBeginDate = computed(() => {
  return getSysFieldProperty('beginDate', getFieldType)
})
const getFieldBeginTime = computed(() => {
  return getSysFieldProperty('beginTime', getFieldType)
})
const getFieldEndDate = computed(() => {
  return getSysFieldProperty('endDate', getFieldType)
})
const getFieldEndTime = computed(() => {
  return getSysFieldProperty('endTime', getFieldType)
})
const getFieldDisinfectTime = computed(() => {
  return getSysFieldProperty('disinfectTime', getFieldType)
})
const getFieldProgramInternal = computed(() => {
  return getSysFieldProperty('programInternal', getFieldType)
})
const getFieldInternalOperatorId = computed(() => {
  return getSysFieldProperty('internalOperatorId', getFieldType)
})
const getFieldProgramExterior = computed(() => {
  return getSysFieldProperty('programExterior', getFieldType)
})
const getFieldExternalOperatorId = computed(() => {
  return getSysFieldProperty('externalOperatorId', getFieldType)
})
const getFieldDisinfectTemp = computed(() => {
  return getSysFieldProperty('disinfectTemp', getFieldType)
})
const getFieldCitricAcidTemp = computed(() => {
  return getSysFieldProperty('citricAcidTemp', getFieldType)
})
const getFieldBedUnitCleaning = computed(() => {
  return getSysFieldProperty('bedUnitCleaning', getFieldType)
})
const getFieldFilterScreenChanging = computed(() => {
  return getSysFieldProperty('filterScreenChanging', getFieldType)
})
const getFieldTmplDisinfectInstructions = computed(() => {
  return getSysFieldProperty('tmplDisinfectInstructions', getFieldType)
})
const getFieldEquipmentStatus = computed(() => {
  return getSysFieldProperty('equipmentStatus', getFieldType)
})
const getFieldDisinfectInstructions = computed(() => {
  return getSysFieldProperty('disinfectInstructions', getFieldType)
})
function handleTmplDisinfectInstructionChange() {
  formData.value.disinfectInstructions = tmplDisinfectInstructions.value
}
// 开始、结束事件变更
function handleTimeChange() {
  if (formData.value.beginDate && formData.value.endDate) {
    formData.value.disinfectTime = dayjs(formData.value.endDate).diff(dayjs(formData.value.beginDate), 'minute')
  }
}

function handleDisinfectTimeChange() {
  if (formData.value.beginDate && (formData.value.disinfectTime || formData.value.disinfectTime === 0)) {
    formData.value.endDate = formatToDateTime(dayjs(formData.value.beginDate).add(formData.value.disinfectTime, 'minute')) as unknown as Dayjs
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
  handleSaveForm,
})
</script>

<style scoped lang="less">
</style>
