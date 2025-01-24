<template>
  <div class="p-1">
    <el-row>
      <el-col :span="24" align="right">
        <van-button size="small" :disabled="!rowId" @click="handleRemoveClick">
          删除
        </van-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="19" style="padding:0.9vw">
        <National v-if="patientInfo.tmplId === '0' || (!patientInfo.tmplId && Number(showTMPL) === 0)" :hospital-name="hospitalName" :patient-info="patientInfo" :summarys="summarys" :historys="historys" :prescription-plans="prescriptionPlans" />
        <Local v-else :hospital-name="hospitalName" :patient-info="patientInfo" :historys="historys" :summarys="summarys" />
      </el-col>
      <el-col :span="5">
        <el-table
          ref="singleTable"
          :data="tableData"
          highlight-current-row border
          style="width: 100%;margin-top:20px;"
          @current-change="handleCurrentChange"
        >
          <el-table-column
            prop="date"
            label="转归日期"
          >
            <template #default="scope">
              {{ typeFormat(scope.row.date) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="operator"
            label="操作人"
          />
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { showNotify } from 'vant'
import { } from '@/utils/constant'
import type { PrescriptionPlan } from '@/services/PatientServiceProxies'
import { PatientMedicalHistoryCustom, PatientMedicalHistoryServiceProxy, PatientView } from '@/services/PatientServiceProxies'
import { SysHospitalServiceProxy } from '@/services/SysServiceProxies'
import dayjs from 'dayjs'
import { useAppStore } from '@/stores'

const { patient } = defineProps({
  patient: PatientView,
})
const { getParametersValue } = useAppStore()
const rowId = ref()
const singleTable = ref()
const patientInfo = ref(new PatientMedicalHistoryCustom())
const hospitalName = ref('')
const prescriptionPlans = ref<PrescriptionPlan[]>()
const summarys = ref([])
const historys = ref([])
const showTMPL = getParametersValue('PATIENT.MEDICALRECORD.HOMEPAGE.TMPL')
const patientMedicalHistoryServiceProxy = new PatientMedicalHistoryServiceProxy()
const sysHospitalServiceProxy = new SysHospitalServiceProxy()
watch(
  () => patient,
  () => {
    getPatientMedicalHistory()
  },
  { immediate: true, deep: true },
)

onMounted(() => {

})
const tableData = ref([])
function typeFormat(val) {
  return val ? dayjs(val).format('YYYYMMDD') : ''
}
function handleCurrentChange(val) {
  patientInfo.value = val
  rowId.value = val.id
  querySummaries(patientInfo.value)
  queryHistorise(patientInfo.value)
  prescriptionPlans.value = val.prescriptionPlans
}
// 查询干体重、血管通路、抗凝剂汇总
function querySummaries(data) {
  const length = Math.max(...[data.lastAnticoagulant.length, data.lastBestWeight.length, data.lastVascularAccess.length])
  const summaries = []
  for (let i = 0; i < length; i++) {
    const form = {
      WeightBestDate: data.lastBestWeight[i] ? (data.lastBestWeight[i].date ? dayjs(data.lastBestWeight[i].date).format('YYYY-MM-DD') : '') : '',
      WeightBest: data.lastBestWeight[i] ? (data.lastBestWeight[i].Data ? data.lastBestWeight[i].Data : '') : '',
      VascularAccessDate: data.lastVascularAccess[i] ? (data.lastVascularAccess[i].date ? dayjs(data.lastVascularAccess[i].date).format('YYYY-MM-DD') : '') : '',
      VascularAccessName: data.lastVascularAccess[i] ? (data.lastVascularAccess[i].data ? data.lastVascularAccess[i].data : '') : '',
      AnticoagulantDate: data.lastAnticoagulant[i] ? (data.lastAnticoagulant[i].date ? dayjs(data.lastAnticoagulant[i].date).format('YYYY-MM-DD') : '') : '',
      AnticoagulantType: data.lastAnticoagulant[i] ? (data.lastAnticoagulant[i].data ? data.lastAnticoagulant[i].data : '') : '',
    }
    summaries.push(form)
  }
  const res = {
    WeightBestDate: '',
    WeightBest: '',
    VascularAccessDate: '',
    VascularAccessName: '',
    AnticoagulantDate: '',
    AnticoagulantType: '',
  }
  while (summaries.length < 7) {
    summaries.push(res)
  }
  summarys.value = summaries
}
// 查询病史记录
function queryHistorise(data) {
  const length = Math.max(...[data.lastDiagnosisInfectiousDisease.length, data.lastTumour.length, data.lastAllergicReaction.length])
  const historise = []
  for (let i = 0; i < length; i++) {
    const form = {
      InfectiousDiseasesDate: data.lastDiagnosisInfectiousDisease[i] ? (data.lastDiagnosisInfectiousDisease[i].date ? data.lastDiagnosisInfectiousDisease[i].date : '') : '',
      InfectiousDiseasesName: data.lastDiagnosisInfectiousDisease[i] ? (data.lastDiagnosisInfectiousDisease[i].Data ? data.lastDiagnosisInfectiousDisease[i].Data : '') : '',
      TumorDate: data.lastTumour[i] ? (data.lastTumour[i].date ? data.lastTumour[i].date : '') : '',
      TumorName: data.lastTumour[i] ? (data.lastTumour[i].Data ? data.lastTumour[i].Data : '') : '',
      AllergyDate: data.lastAllergicReaction[i] ? (data.lastAllergicReaction[i].date ? data.lastAllergicReaction[i].date : '') : '',
      AllergyName: data.lastAllergicReaction[i] ? (data.lastAllergicReaction[i].Data ? data.lastAllergicReaction[i].Data : '') : '',
    }
    historise.push(form)
  }
  const res = {
    InfectiousDiseasesDate: '',
    InfectiousDiseasesName: '',
    TumorDate: '',
    TumorName: '',
    AllergyDate: '',
    AllergyName: '',
  }
  while (historise.length < 7) {
    historise.push(res)
  }
  historys.value = historise
}

async function getPatientMedicalHistory() {
  const { success, data } = await patientMedicalHistoryServiceProxy.byPatientId9(patient.id, undefined)
  if (success) {
    tableData.value = data
    if (tableData.value.length) {
      patientInfo.value = tableData.value[0]
      rowId.value = tableData.value[0].id
      singleTable.value.setCurrentRow(tableData.value[0])
    }
  }
  const filter = {
    pageIndex: 1,
    pageSize: 15,
  }
  const result = await sysHospitalServiceProxy.filter13(JSON.stringify(filter), undefined)
  if (result.success) {
    hospitalName.value = result.data[0].name
  }
}
async function handleRemoveClick() {
  ElMessageBox.confirm('此操作将永久删除该数据, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    console.log('确认')
    showNotify({ type: 'success', message: '删除成功' })
    const result = await patientMedicalHistoryServiceProxy.delete32(rowId.value, undefined)
    if (result.success) {
      showNotify({ type: 'success', message: '删除成功' })
      getPatientMedicalHistory()
    }
    else {
      showNotify({ type: 'danger', message: result.message })
    }
  }).catch(() => {
    showNotify({ type: 'danger', message: '取消删除' })
  })
}
</script>
