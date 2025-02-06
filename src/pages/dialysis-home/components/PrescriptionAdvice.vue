<template>
  <div class="dialysis-procedure-title-div">
    医嘱 -
    <template v-if="stepType === 'MakePrescription'">
      {{ longAdviceCount }}条长期医嘱 -
    </template>
    {{ adviceCount }}条临时医嘱
  </div>
  <el-tabs v-model="activeName" :before-leave="tabBeforeChange">
    <el-tab-pane label="His" name="hisAdvice">
      <el-table :data="hisOrderData" border style="width: 100%" :span-method="objectSpanMethod">
        <el-table-column prop="Group" label="组合" width="70" align="center" />
        <el-table-column prop="DoctorName" label="开立医生" width="100px;" />
        <el-table-column prop="DoctorCreateTime" :formatter="(_row, _column, cellValue) => formatToDate(cellValue)" align="center" label="开立时间" width="120" />
        <el-table-column prop="Content" label="医嘱内容">
          <template #default="scope">
            <span v-if="scope.row.Status === 'VOIDED'" style="text-decoration: line-through red;">{{ scope.row.Content }}</span>
            <template v-else>
              {{ scope.row.Content }}
            </template>
          </template>
        </el-table-column>
        <!-- 状态 -->
        <el-table-column prop="StatusLabel" label="状态" width="80" />
      </el-table>
    </el-tab-pane>
    <el-tab-pane v-if="stepType !== 'ConfirmPrescription'" label="长期医嘱" name="longAdvice">
      <div class="flex justify-between">
        <AdviceTemp @handlde-advice-tmpl-click="handldeAdviceTmplClick" />
        <div class="flex-none">
          <el-button>作废记录</el-button>
          <el-button v-if="adviceTableRef?.isEdit" type="primary" @click="handleSaveAllAdviceClick">
            保存全部
          </el-button>
          <el-button type="primary" @click="handleAddAdviceClick">
            新增
          </el-button>
        </div>
      </div>
      <AdviceTable
        ref="longAdviceTableRef"
        :step-type="stepType"
        :patient-id="modelValue.patientId"
        :cure-record-id="modelValue.cureRecordId"
        advice-type="long"
        :advice-data="formData.daLongterm"
        :show-inventory-count="modelValue.source === 'OUTPATIENT'"
        @update-advice-data="handleUpdateAdviceData"
      />
    </el-tab-pane>
    <el-tab-pane label="临时医嘱" name="temporaryAdvice">
      <div class="flex justify-between">
        <AdviceTemp v-if="stepType !== 'ConfirmPrescription'" @handlde-advice-tmpl-click="handldeAdviceTmplClick" />
        <div class="flex-none">
          <el-button>作废记录</el-button>
          <el-button v-if="adviceTableRef?.isEdit" type="primary" @click="handleSaveAllAdviceClick">
            保存全部
          </el-button>
          <el-button type="primary" @click="handleAddAdviceClick">
            新增
          </el-button>
        </div>
      </div>
      <AdviceTable
        ref="adviceTableRef"
        :step-type="stepType"
        :patient-id="modelValue.patientId"
        :cure-record-id="modelValue.cureRecordId"
        :advice-data="formData.cureDa"
        :show-inventory-count="modelValue.source === 'OUTPATIENT'"
        @update-advice-data="handleUpdateAdviceData"
      />
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
import { CureServiceProxy, type PrescriptionCureBeforeView } from '@/services/CureServiceProxies'
import { PatientDaHisServiceProxy, PatientDaLongtermServiceProxy } from '@/services/PatientServiceProxies'
import type { TmplDaDetailView } from '@/services/TmplServiceProxies'
import { useAppStore } from '@/stores'
import { formatToDate } from '@/utils/date'
import { showNotify } from 'vant'

const { modelValue } = defineProps({
  modelValue: {
    type: Object as PropType<PrescriptionCureBeforeView>,
    required: true,
  },
  stepType: { type: String as PropType<DialysisStepType>, required: true },
})

const emit = defineEmits(['update:modelValue'])
const { getParametersValue } = useAppStore()

const formData = computed({
  get: () => modelValue,
  set: value => emit('update:modelValue', value),
})
const adviceTableRef = ref(null)
const longAdviceTableRef = ref(null)
const paramShowHisDa = getParametersValue('DIALYSIS.RECORD.HISDA.SHOW', true)
const activeName = ref(paramShowHisDa ? 'hisAdvice' : 'temporaryAdvice')
const hisOrderData = ref([])
onMounted(() => {
  if (paramShowHisDa) {
    getHisOrderDaData()
  }
})

/** 医嘱tab切换前判断是否有编辑内容 */
function tabBeforeChange() {
  if (adviceTableRef.value?.isEdit) {
    showNotify({ type: 'danger', message: '请保存医嘱后再切换' })
    return false
  }
}
/** 医嘱模板点击 */
function handldeAdviceTmplClick(val: TmplDaDetailView[]) {
  if (activeName.value === 'temporaryAdvice' && adviceTableRef.value) {
    adviceTableRef.value.addTmplAdviceData(val)
  }
  else {
    if (longAdviceTableRef.value) {
      longAdviceTableRef.value.addTmplAdviceData(val)
    }
  }
}
/** 长期医嘱条数 */
const longAdviceCount = computed(() => {
  return new Set(modelValue.daLongterm.map(x => x.groupId)).size
})
/** 临时医嘱条数 */
const adviceCount = computed(() => {
  return new Set(modelValue.cureDa.map(x => x.groupId)).size
})
/** 新增医嘱 */
function handleAddAdviceClick() {
  if (activeName.value === 'temporaryAdvice' && adviceTableRef.value) {
    adviceTableRef.value.addAdviceData()
  }
  else {
    if (longAdviceTableRef.value) {
      longAdviceTableRef.value.addAdviceData()
    }
  }
}
/** 保存全部医嘱 */
function handleSaveAllAdviceClick() {
  if (adviceTableRef.value) {
    adviceTableRef.value.saveAllAdviceData()
  }
}
/** 刷新医嘱 */
async function handleUpdateAdviceData() {
  if (activeName.value === 'temporaryAdvice') {
    const cureServiceProxy = new CureServiceProxy()
    const { success, data } = await cureServiceProxy.daCureMiddleGET(formData.value.cureRecordId, undefined, undefined)
    if (success) {
      formData.value.cureDa = data
    }
  }
  else {
    const patientDaLongtermServiceProxy = new PatientDaLongtermServiceProxy()
    const filter = {
      pageIndex: 1,
      pageSize: 1000,
      Enabled: {
        value: 1,
        type: '=',
      },
    }
    const { success, data } = await patientDaLongtermServiceProxy.byPatientId2(JSON.stringify(filter), formData.value.patientId, undefined)
    if (success) {
      formData.value.daLongterm = data
    }
  }
}
/** his医嘱合并单元格 */
function objectSpanMethod({ row, column: _column, rowIndex: _rowIndex, columnIndex }) {
  // 待完善，缺少测试，merge数据源，his医嘱需要merge吗？
  // 取反，数组中的是不合并的列
  if (!([0, 3].includes(columnIndex))) {
    if (row.merge) {
      return [row.merge, 1]
    }
    else {
      return [0, 0]
    }
  }
}
/** 查询his医嘱 */
async function getHisOrderDaData() {
  const patientDaHisServiceProxy = new PatientDaHisServiceProxy()
  const filter = {
    CureId: {
      value: formData.value.cureRecordId,
      type: '=',
      dbName: '',
    },
    Date: {
      value: formData.value.dialysisDate,
      type: '=', // 默认like ,= >=  <= > <
      dbName: 'ExecDate',
    },
    pageIndex: 1,
    pageSize: 10000,
    order: 'DoctorCreateTime desc',
  }
  const { success, data } = await patientDaHisServiceProxy.filterGET9(JSON.stringify(filter))
  if (success) {
    hisOrderData.value = data
  }
}
</script>
