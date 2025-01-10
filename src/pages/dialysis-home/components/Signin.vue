<template>
  <div>
    透前测量
  </div>
  <div>
    内置字段
    <el-form ref="ruleFormRef" :model="formData" status-icon :rules="formRules" label-width="auto">
      <el-row :gutter="20">
        <!-- 签到时间 -->
        <el-col v-if="getFieldTimeSignin" :span="8" :style="{ order: getFieldTimeSignin.sequence }">
          <el-form-item :label="getFieldTimeSignin.label" prop="timeSignin">
            <el-date-picker v-model="formData.timeSignin" class="!w-full" type="datetime" :placeholder="getFieldTimeSignin.placeholder" format="HH:mm" />
          </el-form-item>
        </el-col>
        <!-- 测量方式 -->
        <el-col v-if="getFieldBeforeWeightMode" :span="8" :style="{ order: getFieldBeforeWeightMode.sequence }">
          <el-form-item :label="getFieldBeforeWeightMode.label" prop="beforeWeightMode">
            <Dictionary v-model="formData.beforeWeightMode" :dic-code="DIC_PATIENT_MEASURE_WEIGHT_MODE" type="select" placeholder="请选择透析方式" />
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
      </el-row>
    </el-form>
  </div>
  <div>
    非内置字段
    {{ getCustomFieldList }}
  </div>
</template>

<script setup lang="ts">
import { CureServiceProxy, CureTodayView, MeasureCureBeforeView } from '@/services/CureServiceProxies'
import type { SysFieldItemView } from '@/services/SysServiceProxies'
import { useAppStore } from '@/stores'
import { DIC_PATIENT_MEASURE_WEIGHT_MODE } from '@/utils/constant'
import type { FormInstance, FormRules } from 'element-plus'

interface CustomSysFieldItemView extends SysFieldItemView {
  label?: string
  placeholder?: string
}

const { cureData, type } = defineProps({
  cureData: CureTodayView,
  type: {
    type: Number,
    default: 1,
  },
})

const appStore = useAppStore()

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
  allFiledList.value = appStore.sysFiledList.filter(x => x.show && x.sysFieldTypeCode === getFieldType.value).map((x) => {
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
</script>

<style scoped lang="less">
</style>
