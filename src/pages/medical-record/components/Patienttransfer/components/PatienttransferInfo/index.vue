<template>
  <div class="p-4">
    <div align="left">
      <div class="mb-4">
        <span class="font-bold">转归信息</span>
        <el-button-group class="float-right">
          <el-button type="primary" size="small" @click="addTransFer">
            新增
          </el-button>
        </el-button-group>
      </div>
      <patientTransferTable v-loading="loading" :data-list="tableData" @delete="deleteItem" @edit="editItem" />
      <PatientTransferForm v-model="formData" :disabled="disabled" :data-list="tableData" :dialog-visiable="dialogVisiable" @update-table="getTransferData()" @close-dialog="closeDialog" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { PatientPrognosisServiceProxy, PatientPrognosisView, PatientView } from '@/services/PatientServiceProxies'
import { formatToDate } from '@/utils/date'
import { showNotify } from 'vant'

const { patient } = defineProps({
  patient: PatientView,
})
const tableData = ref<PatientPrognosisView[]>([])
const formData = ref<PatientPrognosisView>(new PatientPrognosisView())
const dialogVisiable = ref(false)
const loading = ref(false)
const disabled = ref()
function addTransFer() {
  dialogVisiable.value = true
  initForm()
}
function initForm() {
  formData.value = {
    patientId: patient.id,
    date: formatToDate(new Date()) as any,
    type: tableData.value[0].type === 'IN' ? 'OUT' : 'IN',
    outLocation: '',
    outCause: '',
    outCauseOther: '',
    quitCause: '',
    quitDieCause: [] as any,
    quitDieCauseCve: '',
    quitDieCauseCveOther: '',
    quitDieCauseMacce: '',
    quitDieCauseMacceOther: '',
    quitDieCauseInfection: '',
    quitDieCauseInfectionOther: '',
    quitDieCauseOther: '',
    quitCauseOther: '',
  } as PatientPrognosisView
}
function editItem(item) {
  formData.value = { ...item }
  formData.value.quitDieCause = formData.value.quitDieCause?.split(',') as any
  formData.value.outLocation = formData.value.outLocation?.split(';') as any
  dialogVisiable.value = true
}
function closeDialog() {
  dialogVisiable.value = false
}
const patientPrognosisServiceProxy = new PatientPrognosisServiceProxy()

onMounted(() => {
  getTransferData()
})
function deleteItem(item) {
  ElMessageBox.confirm('此操作将永久删除该数据, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    const result = await patientPrognosisServiceProxy.delete39(item.id)
    if (result.success) {
      showNotify({ type: 'success', message: '删除成功' })
      getTransferData()
    }
    else {
      showNotify({ type: 'danger', message: result.message })
    }
  }).catch(() => {
    showNotify({ type: 'danger', message: '取消删除' })
  })
}
async function getTransferData() {
  const filter = {
    PageIndex: 1,
    PageSize: 1000,
  }
  loading.value = true
  const { success, data, message } = await patientPrognosisServiceProxy.patientGET8(patient.id, JSON.stringify(filter))
  if (success) {
    tableData.value = data
    if (data.length > 0) {
      formData.value = data[0]
      disabled.value = data[0].type === 'IN'
    }
  }
  else {
    showNotify({ type: 'danger', message })
  }
  loading.value = false
}
</script>

  <style lang="less">

  </style>
