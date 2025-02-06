<template>
  <div>
    <div class="dialysis-procedure-title-div">
      患者来源
    </div>
    <el-row :gutter="16">
      <!-- 来源 -->
      <el-col v-if="getFieldSource" :span="8" :style="{ order: getFieldSource.sequence }">
        <el-form-item :label="getFieldSource.label" prop="source">
          <Dictionary v-model="formData.source" :dic-code="DIC_PATIENT_SOURCE" type="select" :placeholder="getFieldSource.placeholder" />
        </el-form-item>
      </el-col>
      <!-- 门诊卡号 -->
      <el-col v-if="getFieldHospitalNumberOut" :span="8" :style="{ order: getFieldHospitalNumberOut.sequence }">
        <el-form-item :label="getFieldHospitalNumberOut.label" prop="hospitalNumberOut">
          <el-input v-model="formData.hospitalNumberOut" :placeholder="getFieldHospitalNumberOut.placeholder" />
        </el-form-item>
      </el-col>
      <!-- 住院卡号 -->
      <el-col v-if="getFieldHospitalNumberIn" :span="8" :style="{ order: getFieldHospitalNumberIn.sequence }">
        <el-form-item :label="getFieldHospitalNumberIn.label" prop="hospitalNumberIn">
          <el-input v-model="formData.hospitalNumberIn" :placeholder="getFieldHospitalNumberIn.placeholder" />
        </el-form-item>
      </el-col>
      <!-- 床号 -->
      <el-col v-if="!formData.dialysisAreaId" :span="8" :style="{ order: getFieldHospitalNumberIn?.sequence }">
        <el-form-item label="床号">
          <el-input v-model="formData.bedName" readonly>
            <template #append>
              <el-button icon="el-icon-search" @click="handleSelectBed(formData.dialysisAreaId)" />
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
import { DIC_PATIENT_SOURCE } from '@/utils/constant'
import type { OnCureMiddleView, PrescriptionCureBeforeView } from '@/services/CureServiceProxies'

const props = defineProps({
  modelValue: {
    type: Object as PropType<PrescriptionCureBeforeView | OnCureMiddleView>,
    required: true,
  },
  stepType: {
    type: String as PropType<DialysisStepType>,
    required: true,
  },
})
const emit = defineEmits(['update:modelValue'])

const formData = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})
const getFieldType = computed(() => {
  let type = 'Prescribing.PatientSource'
  switch (props.stepType) {
    case 'MakePrescription':
      type = 'Prescribing.PatientSource'
      break
    case 'OperateComputer':
      type = 'OnCureMiddle.PatientSource'
      break
    case 'CrossCheck':
      type = 'VerifyCureMiddle.PatientSource'
      break
  }
  return type
})
const getSysFieldProperty = inject<SysFieldProperty>('getSysFieldProperty')
const getCustomFieldList = inject<any[]>('getCustomFieldList')

const getFieldSource = computed(() => getSysFieldProperty?.('source', getFieldType.value))
const getFieldHospitalNumberOut = computed(() => props.modelValue.source === 'OUTPATIENT' ? getSysFieldProperty?.('hospitalNumberOut', getFieldType.value) : null)
const getFieldHospitalNumberIn = computed(() => props.modelValue.source === 'INPATIENT' ? getSysFieldProperty?.('hospitalNumberIn', getFieldType.value) : null)

/**
 * 选择床位
 * @param dialysisAreaId 分区Id
 */
function handleSelectBed(dialysisAreaId: string) {
  // 待完善
  console.log('dialysisAreaId', dialysisAreaId)
}
</script>
