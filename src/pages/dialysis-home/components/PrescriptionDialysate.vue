<template>
  <div>
    <div class="dialysis-procedure-title-div">
      透析液 - {{ formData.dialysateName }}
    </div>
    <el-row :gutter="16">
      <!-- 透析液 -->
      <el-col v-if="getFieldDialysateName" :span="8" :style="{ order: getFieldDialysateName.sequence }">
        <el-form-item :label="getFieldDialysateName.label" prop="dialysateName">
          <el-select v-model="formData.dialysateName" :placeholder="getFieldDialysateName.placeholder" @change="handleDialysateChange">
            <el-option v-for="item in dialysisStore.dialysateList" :key="item.id" :label="item.name" :value="item.name" />
          </el-select>
        </el-form-item>
      </el-col>
      <!-- 流量 -->
      <el-col v-if="getFieldFlowRate" :span="8" :style="{ order: getFieldFlowRate.sequence }">
        <el-form-item :label="getFieldFlowRate.label" prop="flowRate">
          <el-input v-model="formData.flowRate" type="number" :placeholder="getFieldFlowRate.placeholder">
            <template #append>
              ml/min
            </template>
          </el-input>
        </el-form-item>
      </el-col>
      <!-- 温度 -->
      <el-col v-if="getFieldTemp" :span="8" :style="{ order: getFieldTemp.sequence }">
        <el-form-item :label="getFieldTemp.label" prop="temp">
          <el-input v-model="formData.temp" type="number" :placeholder="getFieldTemp.placeholder">
            <template #append>
              ℃
            </template>
          </el-input>
        </el-form-item>
      </el-col>
      <!-- 电导度 -->
      <el-col v-if="getFieldCond" :span="8" :style="{ order: getFieldCond.sequence }">
        <el-form-item :label="getFieldCond.label" prop="cond">
          <el-input v-model="formData.cond" type="number" :placeholder="getFieldCond.placeholder">
            <template #append>
              mS/cm
            </template>
          </el-input>
        </el-form-item>
      </el-col>
      <!-- 钾 -->
      <el-col v-if="getFieldK" :span="8" :style="{ order: getFieldK.sequence }">
        <el-form-item :label="getFieldK.label" prop="k">
          <el-input v-model="formData.k" type="number" :placeholder="getFieldK.placeholder">
            <template #append>
              mmol/L
            </template>
          </el-input>
        </el-form-item>
      </el-col>
      <!-- 钙 -->
      <el-col v-if="getFieldCa" :span="8" :style="{ order: getFieldCa.sequence }">
        <el-form-item :label="getFieldCa.label" prop="ca">
          <el-input v-model="formData.ca" type="number" :placeholder="getFieldCa.placeholder">
            <template #append>
              mmol/L
            </template>
          </el-input>
        </el-form-item>
      </el-col>
      <!-- 钠 -->
      <el-col v-if="getFieldNa" :span="8" :style="{ order: getFieldNa.sequence }">
        <el-form-item :label="getFieldNa.label" prop="na">
          <el-input v-model="formData.na" type="number" :placeholder="getFieldNa.placeholder">
            <template #append>
              mmol/L
            </template>
          </el-input>
        </el-form-item>
      </el-col>
      <!-- 碳酸氢根 -->
      <el-col v-if="getFieldHco" :span="8" :style="{ order: getFieldHco.sequence }">
        <el-form-item :label="getFieldHco.label" prop="hco">
          <el-input v-model="formData.hco" type="number" :placeholder="getFieldHco.placeholder">
            <template #append>
              mmol/L
            </template>
          </el-input>
        </el-form-item>
      </el-col>
      <!-- 葡萄糖 -->
      <el-col v-if="getFieldGlucose" :span="8" :style="{ order: getFieldGlucose.sequence }">
        <el-form-item :label="getFieldGlucose.label" prop="glucose">
          <el-input v-model="formData.glucose" type="number" :placeholder="getFieldGlucose.placeholder">
            <template #append>
              mmol/L
            </template>
          </el-input>
        </el-form-item>
      </el-col>
      <!-- 自定义字段 -->
      <el-col v-for="item in getCustomFieldList?.filter(x => x.sysFieldTypeCode === getFieldType)" :key="item.fieldKey" :span="8" :style="{ order: item.sequence }">
        <DialysisCustomFiled v-model="formData.cureRecordFieldItems.find(x => x.fieldKey === item.fieldKey).fieldValue" :item="item" :index="formData.cureRecordFieldItems.findIndex(x => x.fieldKey === item.fieldKey)" />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import type { OnCureMiddleView, PrescriptionCureBeforeView } from '@/services/CureServiceProxies'
import { TmplDialysateServiceProxy } from '@/services/TmplServiceProxies'
import { useDialysisStore } from '@/stores'

const props = defineProps({
  modelValue: {
    type: Object as PropType<PrescriptionCureBeforeView | OnCureMiddleView>,
    required: true,
  },
  stepType: { type: String as PropType<DialysisStepType>, required: true },
})

const emit = defineEmits(['update:modelValue'])
const dialysisStore = useDialysisStore()
const formData = computed<PrescriptionCureBeforeView | OnCureMiddleView>({
  get: () => {
    return props.modelValue
  },
  set: (value) => {
    emit('update:modelValue', value)
  },
})
onMounted(() => {
  initLoad()
})
async function initLoad() {
  if (dialysisStore.dialysateList.length === 0) {
    await getTmplDialysateData()
  }
}
/** 查询透析液模板 */
async function getTmplDialysateData() {
  const filter = {
    pageIndex: 1,
    pageSize: 1000,
    order: 'Name asc',
  }
  const tmplDialysateServiceProxy = new TmplDialysateServiceProxy()
  const { success, data } = await tmplDialysateServiceProxy.filter13(JSON.stringify(filter), undefined)
  if (success) {
    dialysisStore.setDialysateList(data)
  }
}

const getFieldType = computed(() => {
  let type = 'Prescribing.Dialysate'
  switch (props.stepType) {
    case 'MakePrescription':
      type = 'Prescribing.Dialysate'
      break
    case 'OperateComputer':
      type = 'OnCureMiddle.Dialysate'
      break
    case 'CrossCheck':
      type = 'VerifyCureMiddle.Dialysate'
      break
  }
  return type
})
const getSysFieldProperty = inject<SysFieldProperty>('getSysFieldProperty')
const getCustomFieldList = inject<any[]>('getCustomFieldList')
const getFieldDialysateName = computed(() => getSysFieldProperty('dialysateName', getFieldType.value))
const getFieldFlowRate = computed(() => getSysFieldProperty('flowRate', getFieldType.value))
const getFieldTemp = computed(() => getSysFieldProperty('temp', getFieldType.value))
const getFieldCond = computed(() => getSysFieldProperty('cond', getFieldType.value))
const getFieldK = computed(() => getSysFieldProperty('k', getFieldType.value))
const getFieldCa = computed(() => getSysFieldProperty('ca', getFieldType.value))
const getFieldNa = computed(() => getSysFieldProperty('na', getFieldType.value))
const getFieldHco = computed(() => getSysFieldProperty('hco', getFieldType.value))
const getFieldGlucose = computed(() => getSysFieldProperty('glucose', getFieldType.value))

function handleDialysateChange() {
  const res = dialysisStore.dialysateList.find(x => x.name === formData.value.dialysateName)
  if (res) {
    Object.assign(formData.value, {
      flowRate: res.flowRate,
      temp: res.temp,
      cond: res.cond,
      k: res.k,
      ca: res.ca,
      na: res.na,
      hco: res.hco,
      glucose: res.glucose,
    })
  }
}
</script>

<style scoped>

</style>
