<template>
  <div class="px-2">
    <div>
      <slot name="header">
        处方信息
      </slot>
    </div>
    <el-row :gutter="16">
      <!-- 上机时间 -->
      <el-col v-if="getFieldTimeOn" :span="8" :style="{ order: getFieldTimeOn.sequence }">
        <el-form-item :label="getFieldTimeOn.label" prop="timeOn">
          <el-date-picker v-model="((formData as OnCureMiddleView).timeOn) as unknown as Date" class="!w-full" type="datetime" :clearable="false" :placeholder="getFieldTimeOn.placeholder" format="HH:mm" />
        </el-form-item>
      </el-col>
      <!-- 开立日期 -->
      <el-col v-if="getFieldTimeEnactDoctorDate" :span="8" :style="{ order: getFieldTimeEnactDoctorDate.sequence }">
        <el-form-item :label="getFieldTimeEnactDoctorDate.label" prop="timeEnactDoctor">
          <el-date-picker v-model="formData.timeEnactDoctor as unknown as Date" class="!w-full" type="datetime" :clearable="false" :placeholder="getFieldTimeEnactDoctorDate.placeholder" format="YYYY-MM-DD" />
        </el-form-item>
      </el-col>
      <!-- 开立时间 -->
      <el-col v-if="getFieldTimeEnactDoctorTime" :span="8" :style="{ order: getFieldTimeEnactDoctorTime.sequence }">
        <el-form-item :label="getFieldTimeEnactDoctorTime.label" prop="timeEnactDoctor">
          <el-date-picker v-model="formData.timeEnactDoctor as unknown as Date" class="!w-full" type="datetime" :clearable="false" :placeholder="getFieldTimeEnactDoctorTime.placeholder" format="HH:mm" />
        </el-form-item>
      </el-col>
      <!-- 透析处方 -->
      <el-col v-if="getFieldTimeEnactDoctorTime" :span="8" :style="{ order: getFieldTimeEnactDoctorTime.sequence }">
        <el-form-item label="透析处方：">
          <el-select placeholder="请选择透析处方">
            <el-option v-for="item in prescriptionList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-col>
      <!-- 透析方式 -->
      <el-col v-if="getFieldDialysisMode" :span="8" :style="{ order: getFieldDialysisMode.sequence }">
        <el-form-item :label="getFieldDialysisMode.label" prop="dialysisMode">
          <div class="w-full flex items-center gap-1">
            <Dictionary v-model="formData.dialysisMode" class="flex-1" :dic-code="DIC_DIALYSIS_MODE" type="select" :placeholder="getFieldDialysisMode.placeholder" />
            <el-popover placement="right" :width="400" trigger="click">
              <template #reference>
                <el-icon color="red" size="24" @click="getPatientSummary">
                  <InfoFilled />
                </el-icon>
              </template>
              <el-table :data="chargeTableData" border max-height="60vh">
                <el-table-column prop="roomItemListName" min-width="180" label="项目名称" />
                <el-table-column prop="surplusCount" label="次数">
                  <template #default="scope">
                    <span v-if="scope.row.surplusCount > paramCostRemindCount">
                      {{ scope.row.surplusCount }}
                    </span>
                    <span v-else class="text-red">{{ scope.row.surplusCount }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-popover>
          </div>
        </el-form-item>
      </el-col>
      <!-- 透析时长 -->
      <el-col v-if="getFieldDialysisDurationSet" :span="8" :style="{ order: getFieldDialysisDurationSet.sequence }">
        <el-form-item :label="getFieldDialysisDurationSet.label" prop="dialysisDurationSet">
          <DialysisDuration v-model="formData.dialysisDurationSet" />
          <!-- <el-input v-model="formData.dialysisDurationSet" type="number" :placeholder="getFieldDialysisDurationSet.placeholder" @change="handleChangeRfr" /> -->
        </el-form-item>
      </el-col>
      <!-- 血管通路 -->
      <el-col v-if="getFieldPatientVascularAccessId" :span="8" :style="{ order: getFieldPatientVascularAccessId.sequence }">
        <el-form-item :label="getFieldPatientVascularAccessId.label" prop="patientVascularAccessId">
          <el-select :model-value="formData.patientVascularAccessId" multiple :placeholder="getFieldPatientVascularAccessId.placeholder" @change="handlePatientVascularAccessChange">
            <el-option v-for="item in patientVascularAccessList" :key="item.id" :label="item.typeName" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-col>
      <!-- 血管通路图片 -->
      <el-col v-if="getFieldPatientVascularAccessId" :span="8" :style="{ order: getFieldPatientVascularAccessId.sequence }">
        <el-form-item label="血管通路图片：">
          <div v-if="selectVascularAccessImgList.length > 0" class="item-center flex gap-2">
            <el-image class="h-8 w-10" :src=" selectVascularAccessImgList[0]" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2" :preview-src-list="selectVascularAccessImgList" :initial-index="4" fit="cover" />
            <div class="text-xs text-gray">
              点击查<br>看大图
            </div>
          </div>
        </el-form-item>
      </el-col>
      <!-- 通路位置 -->
      <el-col v-if="getFieldVascularAccessPosition" :span="8" :style="{ order: getFieldVascularAccessPosition.sequence }">
        <el-form-item :label="getFieldVascularAccessPosition.label">
          {{ selectVascularAccessList.map(x => `${x.location}-${x.position} `).join('；') }}
        </el-form-item>
      </el-col>
      <template v-if="showPunctureMethod">
        <!-- 穿刺方法 -->
        <el-col :span="8" :style="{ order: getFieldVascularAccessPosition?.sequence || getFieldPatientVascularAccessId.sequence }">
          <el-form-item label="穿刺方法：" prop="punctureMethod">
            <Dictionary v-model="formData.punctureMethod" :dic-code="DIC_DIALYSIS_PUNCTURE_METHOD" type="select" placeholder="请选择穿刺方法" />
          </el-form-item>
        </el-col>
        <!-- 穿刺护士 -->
        <el-col v-if="['OperateComputer', 'CrossCheck'].includes(stepType)" :span="8" :style="{ order: getFieldVascularAccessPosition?.sequence || getFieldPatientVascularAccessId.sequence }">
          <el-form-item label="穿刺护士：" prop="punctureNurseId">
            <UserInfoSelect v-model="formData.punctureNurseId" user-type="nurse" placeholder="请选择穿刺护士" />
          </el-form-item>
        </el-col>
      </template>
      <!-- 血流量 -->
      <el-col v-if="getFieldBloodFlowRate" :span="8" :style="{ order: getFieldBloodFlowRate.sequence }">
        <el-form-item :label="getFieldBloodFlowRate.label" prop="bloodFlowRate">
          <el-input v-model="formData.bloodFlowRate" type="number" :placeholder="getFieldBloodFlowRate.placeholder" :disabled="stepType === 'OperateComputer' ? !paramBloodFlowRateReadOnly : stepType !== 'MakePrescription'">
            <template #append>
              ml/min
            </template>
          </el-input>
        </el-form-item>
      </el-col>
      <!-- 核对护士 -->
      <el-col v-if="getFieldVerifyNurseId" :span="8" :style="{ order: getFieldVerifyNurseId.sequence }">
        <el-form-item :label="getFieldVerifyNurseId.label" prop="verifyNurseId">
          <el-select v-model="(formData as VerifyCureMiddleView).verifyNurseId" :placeholder="getFieldVerifyNurseId.placeholder">
            <el-option v-for="item in userNurseList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-col>
      <!-- 单超相关 -->
      <template v-if="paramShowIuf && getFieldIuf">
        <!-- 是否单超 -->
        <el-col :span="8" :style="{ order: getFieldIuf.sequence }">
          <el-form-item :label="getFieldIuf.label" prop="iuf">
            <el-switch v-model="formData.iuf" @change="handleIufChange" />
          </el-form-item>
        </el-col>
        <template v-if="formData.iuf">
          <el-col :span="8" :style="{ order: getFieldIuf.sequence }">
            <el-form-item label="单超方式：">
              <el-select v-model="formData.iufMode" placeholder="请选择单超方式">
                <el-option v-for="item in ['透析前', '透析中', '透析后']" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" :style="{ order: getFieldIuf.sequence }">
            <el-form-item label="单超开始时间：">
              <el-date-picker v-model="((formData as PrescriptionCureBeforeView).iufStartTime) as unknown as Date" class="!w-full" type="datetime" :clearable="false" placeholder="请选择单超开始时间" format="HH:mm" />
            </el-form-item>
          </el-col>
          <el-col :span="8" :style="{ order: getFieldIuf.sequence }">
            <el-form-item label="单超时间：">
              <el-input v-model="formData.iufHour" type="number" placeholder="请输入单超时间">
                <template #append>
                  h
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" :style="{ order: getFieldIuf.sequence }">
            <el-form-item label="单超量：">
              <el-input v-model="formData.iufValue" type="number" placeholder="请输入单超量">
                <template #append>
                  {{ paramUfgUnit }}
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </template>
      </template>
      <!-- 置换液相关 -->
      <template v-if="showHdfMethod">
        <el-col :span="8" :style="{ order: getFieldIuf?.sequence || getFieldBloodFlowRate?.sequence }">
          <el-form-item label="置换方式：" prop="rfm">
            <Dictionary v-model="formData.rfm" :dic-code="DIC_DIALYSIS_RFM" type="select" placeholder="请选择置换方式" />
          </el-form-item>
        </el-col>
        <el-col :span="8" :style="{ order: getFieldIuf?.sequence || getFieldBloodFlowRate?.sequence }">
          <el-form-item label="置换液流量：" prop="rfr">
            <el-input v-model="formData.rfr" type="number" placeholder="请输入置换液流量" @change="handleChangeRfr">
              <template #append>
                ml/min
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" :style="{ order: getFieldIuf?.sequence || getFieldBloodFlowRate?.sequence }">
          <el-form-item label="置换液量：" prop="rfv">
            <el-input v-model="formData.rfv" type="number" placeholder="请输入置换液量" @change="handleChangeRfr">
              <template #append>
                L
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </template>
      <el-col v-if="showPlacementMethod && stepType === 'OperateComputer'" :span="8" :style="{ order: getFieldPatientVascularAccessId?.sequence }">
        <el-form-item label="置管护士：" prop="placementNurseId">
          <UserInfoSelect v-model="(formData as OnCureMiddleView).placementNurseId" user-type="nurse" placeholder="请选择置管护士" />
        </el-form-item>
      </el-col>
      <!-- 管床护士 -->
      <el-col v-if="stepType === 'OperateComputer' && getFieldBedNurseId" :span="8" :style="{ order: getFieldBedNurseId.sequence }">
        <el-form-item :label="getFieldBedNurseId.label" prop="bedNurseId">
          <UserInfoSelect v-model="(formData as OnCureMiddleView).bedNurseId" user-type="nurse" :placeholder="getFieldBedNurseId.placeholder" />
        </el-form-item>
      </el-col>
      <!-- 质控护士 -->
      <el-col v-if="stepType === 'OperateComputer' && getFieldQualityNurseId" :span="8" :style="{ order: getFieldQualityNurseId.sequence }">
        <el-form-item :label="getFieldQualityNurseId.label" prop="qualityNurseId">
          <UserInfoSelect v-model="(formData as OnCureMiddleView).qualityNurseId" user-type="nurse" :placeholder="getFieldQualityNurseId.placeholder" />
        </el-form-item>
      </el-col>
      <template v-if="stepType !== 'CrossCheck'">
        <el-col v-if="getFieldSuggestion" :span="24" :style="{ order: getFieldSuggestion.sequence }">
          <el-form-item :label="getFieldSuggestion.label" prop="suggestion">
            <el-input v-model="formData.suggestion" type="textarea" :autosize="{ minRows: 2 }" :placeholder="getFieldSuggestion.placeholder" />
          </el-form-item>
        </el-col>
        <el-col v-if="getFieldSuggestionNext" :span="24" :style="{ order: getFieldSuggestionNext.sequence }">
          <el-form-item :label="getFieldSuggestionNext.label" prop="suggestionNext">
            <el-input v-model="(formData as PrescriptionCureBeforeView).suggestionNext" type="textarea" :autosize="{ minRows: 2 }" :placeholder="getFieldSuggestionNext.placeholder" />
          </el-form-item>
        </el-col>
      </template>
      <!-- 自定义字段 -->
      <el-col v-for="item in getCustomFieldList?.filter(x => x.sysFieldTypeCode === getFieldType)" :key="item.fieldKey" :span="8" :style="{ order: item.sequence }">
        <DialysisCustomFiled v-model="formData.cureRecordFieldItems.find(x => x.fieldKey === item.fieldKey).fieldValue" :item="item" :index="formData.cureRecordFieldItems.findIndex(x => x.fieldKey === item.fieldKey)" />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import type { OnCureMiddleView, PrescriptionCureBeforeView, VerifyCureMiddleView } from '@/services/CureServiceProxies'
import type { CostBalanceView } from '@/services/RoomItemListServiceProxies'
import { CostBalanceServiceProxy } from '@/services/RoomItemListServiceProxies'
import { useAppStore, useDialysisStore } from '@/stores'
import { CUREFLOW_MODIFY_BLOODFLOWRATE, DIC_DIALYSIS_MODE, DIC_DIALYSIS_PUNCTURE_METHOD, DIC_DIALYSIS_RFM } from '@/utils/constant'
import { dateUtil } from '@/utils/date'
import { InfoFilled } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: {
    type: Object as PropType<PrescriptionCureBeforeView | OnCureMiddleView | VerifyCureMiddleView>,
    required: true,
  },
  stepType: { type: String as PropType<DialysisStepType>, required: true },
})

const emit = defineEmits(['update:modelValue'])
const { getParametersValue } = useAppStore()
const formData = computed({
  get: () => {
    const patientVascularAccessIdArray = (typeof props.modelValue.patientVascularAccessId === 'string' ? (props.modelValue.patientVascularAccessId ? props.modelValue.patientVascularAccessId.split(',') : null) : null) as unknown as string
    return Object.assign({ ...props.modelValue }, { patientVascularAccessId: patientVascularAccessIdArray })
  },
  set: value => emit('update:modelValue', value),
})
/** 患者处方列表 */
const prescriptionList = ref([])
/** 患者血管通路列表 */
const { selectDialysisPatientVascularAccessList: patientVascularAccessList } = useDialysisStore()
/** 患者透析中使用的血管通路 */
const selectVascularAccessList = computed(() => {
  return patientVascularAccessList.filter(x => formData.value.patientVascularAccessId.includes(x.id))
})
/** 患者透析中使用的血管图片 */
const selectVascularAccessImgList = computed(() => {
  return selectVascularAccessList.value.flatMap(item => item.files.map(file => file.hfsFiless.url))
})
/** 护士列表 */
const userNurseList = ref([])
const getSysFieldProperty = inject<SysFieldProperty>('getSysFieldProperty')
const getCustomFieldList = inject<any[]>('getCustomFieldList')

const getFieldType = computed(() => {
  let type = 'Prescribing.PrescriptionInfo'
  switch (props.stepType) {
    case 'MakePrescription':
      type = 'Prescribing.PrescriptionInfo'
      break
    case 'OperateComputer':
      type = 'OnCureMiddle.CureMode'
      break
    case 'CrossCheck':
      type = 'VerifyCureMiddle.CureMode'
      break
  }
  return type
})
const getFieldTimeOn = computed(() => getSysFieldProperty('timeOn', getFieldType.value))
const getFieldTimeEnactDoctorDate = computed(() => getSysFieldProperty('timeEnactDoctorDate', getFieldType.value))
const getFieldTimeEnactDoctorTime = computed(() => getSysFieldProperty('timeEnactDoctorTime', getFieldType.value))
const getFieldDialysisMode = computed(() => getSysFieldProperty('dialysisMode', getFieldType.value))
const getFieldDialysisDurationSet = computed(() => getSysFieldProperty('dialysisDurationSet', getFieldType.value))
const getFieldPatientVascularAccessId = computed(() => getSysFieldProperty('patientVascularAccessId', getFieldType.value))
const getFieldVascularAccessPosition = computed(() => getSysFieldProperty('position', getFieldType.value))
const getFieldBloodFlowRate = computed(() => getSysFieldProperty('bloodFlowRate', getFieldType.value))
/** 上机修改血流量 */
const paramBloodFlowRateReadOnly = getParametersValue(CUREFLOW_MODIFY_BLOODFLOWRATE, true)
/** 显示穿刺相关 */
const showPunctureMethod = computed(() => {
  const array = ['AVF', 'AVG']
  return array.includes(formData.value.patientOtherVascularAccessType || formData.value.patientVascularAccessType)
})
const getFieldVerifyNurseId = computed(() => getSysFieldProperty('verifyNurseId', getFieldType.value))
/** 显示HDF相关 */
const showHdfMethod = computed(() => {
  const array = ['HDF', 'HF', 'PE', 'HDF+HP']
  return array.includes(formData.value.dialysisMode)
})
/** 预脱单位 */
const paramUfgUnit = getParametersValue('DIALYSIS.UF.UNIT')
/** 制定处方是否显示单超 */
const paramShowIuf = getParametersValue('CUREFLOW.SHOW.IUF', true)
const getFieldIuf = computed(() => getSysFieldProperty('iuf', getFieldType.value))
function handleIufChange() {
  (formData.value as unknown as PrescriptionCureBeforeView).iufStartTime = formData.value.iuf ? dateUtil() : null
  formData.value.iufHour = null
  formData.value.iufMode = null
  formData.value.iufValue = null
}
/** 置换液量计算 */
function handleChangeRfr() {
  const { rfr, dialysisDurationSet } = formData.value
  if ((rfr || rfr === 0) && (dialysisDurationSet || dialysisDurationSet === 0)) {
    formData.value.rfv = Number((rfr * dialysisDurationSet / 1000).toFixed(2))
  }
  else {
    formData.value.rfv = null
  }
}
/** 显示置管相关 */
const showPlacementMethod = computed(() => {
  const array = ['TCVC', 'LCVC']
  return array.includes(formData.value.patientOtherVascularAccessType || formData.value.patientVascularAccessType)
})
const getFieldQualityNurseId = computed(() => getSysFieldProperty('qualityNurseId', getFieldType.value))
const getFieldBedNurseId = computed(() => getSysFieldProperty('bedNurseId', getFieldType.value))
const getFieldSuggestion = computed(() => getSysFieldProperty('suggestion', getFieldType.value))
const getFieldSuggestionNext = computed(() => getSysFieldProperty('suggestionNext', getFieldType.value))
/** 预警次数 */
const paramCostRemindCount = Number(getParametersValue('COST.REMIND.COUNT', false, 0))
/** 费用数据 */
const chargeTableData = ref<CostBalanceView[]>([])
async function getPatientSummary() {
  const costBalanceServiceProxy = new CostBalanceServiceProxy()
  const { success, data } = await costBalanceServiceProxy.summary(formData.value.patientId)
  if (success) {
    chargeTableData.value = data
  }
}
function handlePatientVascularAccessChange(val) {
  emit('update:modelValue', { ...formData.value, patientVascularAccessId: val.toString() })
}
</script>

<style lang="scss" scoped>

</style>
