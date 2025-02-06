<template>
  <div>
    <div class="dialysis-procedure-title-div">快捷处方</div>
    <el-row :gutter="16">
      <!-- 透析方式 -->
      <el-col v-if="getFieldDialysisMode" :span="8" :style="{ order: getFieldDialysisMode.sequence }">
        <el-form-item :label="getFieldDialysisMode.label" prop="dialysisMode">
          <Dictionary v-model="formData.dialysisMode" :dic-code="DIC_DIALYSIS_MODE" type="select" :placeholder="getFieldDialysisMode.placeholder" />
        </el-form-item>
      </el-col>
      <!-- 透析时长 -->
      <el-col v-if="getFieldDialysisDurationSet" :span="8" :style="{ order: getFieldDialysisDurationSet.sequence }">
        <el-form-item :label="getFieldDialysisDurationSet.label" prop="dialysisDurationSet">
          <DialysisDuration v-model="formData.dialysisDurationSet" />
        </el-form-item>
      </el-col>
      <!-- 干体重 -->
      <el-col v-if="getFieldBestWeight" :span="8" :style="{ order: getFieldBestWeight.sequence }">
        <el-form-item :label="getFieldBestWeight.label" prop="bestWeight">
          <el-input v-model.number="formData.bestWeight" type="number" :placeholder="getFieldBestWeight.placeholder" @change="calcUfg">
            <template #append>
              kg
            </template>
          </el-input>
        </el-form-item>
      </el-col>
      <!-- 预脱 -->
      <el-col v-if="getFieldUfg" :span="8" :style="{ order: getFieldUfg.sequence }">
        <el-form-item :label="getFieldUfg.label" prop="ufg">
          <el-input v-model="formData.ufg" :placeholder="getFieldUfg.placeholder">
            <template #append>
              {{ paramUfgUnit }}
            </template>
          </el-input>
        </el-form-item>
      </el-col>
      <!-- 抗凝剂 -->
      <template v-if="getFieldAnticoagulantName">
        <Anticoagulant v-model="formData" :label="getFieldAnticoagulantName.label" prop="anticoagulantName" :sequence="getFieldAnticoagulantName.sequence" :placeholder="getFieldAnticoagulantName.placeholder" />
      </template>
      <!-- 自定义字段 -->
      <el-col v-for="item in getCustomFieldList?.filter(x => x.sysFieldTypeCode === 'Prescribing.PatientSource')" :key="item.fieldKey" :span="8" :style="{ order: item.sequence }">
        <DialysisCustomFiled v-model="formData.cureRecordFieldItems.find(x => x.fieldKey === item.fieldKey).fieldValue" :item="item" :index="formData.cureRecordFieldItems.findIndex(x => x.fieldKey === item.fieldKey)" />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { DIC_DIALYSIS_MODE } from '@/utils/constant'
import type { PrescriptionCureBeforeView } from '@/services/CureServiceProxies'
import { useAppStore } from '@/stores'
import { calcUfgValue } from '@/utils/dialysis'

const props = defineProps({
  modelValue: {
    type: Object as PropType<PrescriptionCureBeforeView>,
    required: true,
  },
})
const emit = defineEmits(['update:modelValue'])
const lastDeductionWeight = ref(null)
const { getParametersValue } = useAppStore()
const formData = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const getSysFieldProperty = inject<SysFieldProperty>('getSysFieldProperty')
const getCustomFieldList = inject<any[]>('getCustomFieldList')

const getFieldDialysisMode = computed(() => getSysFieldProperty('dialysisMode', 'Prescribing.QuickPrescription'))
const getFieldDialysisDurationSet = computed(() => getSysFieldProperty('dialysisDurationSet', 'Prescribing.QuickPrescription'))
const getFieldBestWeight = computed(() => getSysFieldProperty('bestWeight', 'Prescribing.QuickPrescription'))
const getFieldUfg = computed(() => getSysFieldProperty('ufg', 'Prescribing.QuickPrescription'))
const getFieldAnticoagulantName = computed(() => getSysFieldProperty('anticoagulantName', 'Prescribing.QuickPrescription'))

/** 超滤单位 */
const paramUfgUnit = getParametersValue('DIALYSIS.UF.UNIT')
/** 偏移量单位 */
const paramDeductionUnit = getParametersValue('DIALYSIS.DEDUCTION.UNIT')
/** 计算预脱值 */
function calcUfg() {
  const { beforeWeight, bestWeight, deductionWeight, lastAfterWeight } = formData.value
  const data: CalcUfgModel = {
    beforeWeight,
    bestWeight,
    deductionWeight,
    deductionWeightUnit: paramDeductionUnit,
    ufgUnit: paramUfgUnit,
    lastAfterWeight: lastAfterWeight ? Number(lastAfterWeight) : 0,
    lastDeductionWeight: lastDeductionWeight.value,
  }
  formData.value.ufg = calcUfgValue(data)
}
</script>
