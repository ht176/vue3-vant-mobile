<template>
  <div class="p-2">
    <div>
      <div class="mb-3 text-right">
        <!-- 编辑 -->
        <el-button type="primary" size="small" @click="AddDialysiscard">
          新增
        </el-button>
      </div>
      <el-table :data="tableData" border>
        <el-table-column label="门诊卡号" prop="cardNumber">
          <template #default="scope">
            <el-form v-if="scope.row.edit || scope.row.add" ref="ruleFormRef" :model="scope.row" :rules="ruleCardNumber" size="small">
              <el-form-item prop="hospitalNumberOut">
                <el-input v-model="scope.row.hospitalNumberOut" maxlength="32" size="small" />
              </el-form-item>
            </el-form>
            <span v-else>{{ scope.row.hospitalNumberOut }}</span>
          </template>
        </el-table-column>
        <el-table-column property="remark" label="备注">
          <template #default="scope">
            <el-input v-if="scope.row.edit || scope.row.add" v-model="scope.row.remark" maxlength="32" size="small" />
            <span v-else>{{ scope.row.remark }}</span>
          </template>
        </el-table-column>
        <el-table-column property="Enabled" label="状态" width="180px">
          <template #default="scope">
            <el-switch v-model="scope.row.enabled" :active-value="1" :inactive-value="0" :active-text="scope.row.enabled === '0' ? '禁用' : '启用'" active-color="#13ce66" inactive-color="#DCDFE6" @change="switchChange(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template #default="scope">
            <el-button v-if="scope.row.edit || scope.row.add" size="small" @click="saveRow(ruleFormRef, scope.row)">
              保存
            </el-button>
            <el-button v-if="!scope.row.edit && !scope.row.add" size="small" @click="editRow(scope.row)">
              编辑
            </el-button>
            <el-button v-if="!scope.row.edit && !scope.row.add" size="small" @click="deleteRow(scope.row)">
              删除
            </el-button>
            <el-button v-if="scope.row.edit || scope.row.add" size="small" @click="closeRow(scope.$index, scope.row)">
              取消
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
</script>

<script setup lang="ts">
import { ElMessageBox } from 'element-plus'
import { showNotify } from 'vant'
import type { FormInstance, FormRules } from 'element-plus'
import type { PatientHospitalNumberOutView } from '@/services/PatientServiceProxies'
import { PatientHospitalNumberOutServiceProxy, PatientView } from '@/services/PatientServiceProxies'

const { patient } = defineProps({
  patient: PatientView,
})
const tableData = ref<PatientHospitalNumberOutView[]>([])
const ruleFormRef = ref<FormInstance>()
const loading = ref(false)
const rowRecord = ref({})

const ruleCardNumber = reactive<FormRules<PatientHospitalNumberOutView>>({
  hospitalNumberOut: [
    { required: true, message: '请输入门诊卡号', trigger: 'change' },
    { max: 32, message: '不能超过32个字符', trigger: 'change' },
  ],
})

onMounted(() => {
  getPatientHospitalNumberOut()
})

const patientHospitalNumberOutServiceProxy = new PatientHospitalNumberOutServiceProxy()
function AddDialysiscard() {
  const newObj = {
    id: '',
    cardNumber: '',
    enabled: 1,
    patientId: patient.id,
    remark: '',
    edit: true,
    add: true,
  } as unknown as PatientHospitalNumberOutView
  tableData.value.unshift(newObj)
}
async function saveRow(formEl: FormInstance | undefined, row) {
  if (!formEl)
    return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      loading.value = true
      const { success } = !row.id ? await patientHospitalNumberOutServiceProxy.patientHospitalNumberOutPOST2(row) : await patientHospitalNumberOutServiceProxy.patientHospitalNumberOutPOST(row.id, row)
      if (success) {
        getPatientHospitalNumberOut()
        showNotify({ type: 'success', message: '保存成功' })
        loading.value = false
      }
    }
    else {
      console.log('error submit!', fields)
    }
  })
}
/* 改变状态 */
async function switchChange(row) {
  const { success } = await patientHospitalNumberOutServiceProxy.switch3(row.id)
  if (success) {
    getPatientHospitalNumberOut()
    showNotify({ type: 'success', message: '保存成功' })
  }
  else {
    showNotify({ type: 'danger', message: '保存失败' })
  }
}
function closeRow(index, row) {
  console.log('取消', index, row)
  if (!row.id) {
    console.log('取消', index, row)
    tableData.value.splice(index, 1)
  }
  else {
    row.edit = false
    tableData.value.splice(index, 1, row)
  }
}
function editRow(row) {
  row.edit = true
  rowRecord.value = row
}
async function deleteRow(row) {
  ElMessageBox.confirm('此操作将永久删除该数据, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    showNotify({ type: 'success', message: '删除成功' })
    const result = await patientHospitalNumberOutServiceProxy.delete26(row.id)
    if (result.success) {
      showNotify({ type: 'success', message: '删除成功' })
      getPatientHospitalNumberOut()
    }
    else {
      showNotify({ type: 'danger', message: result.message })
    }
  }).catch(() => {
    showNotify({ type: 'danger', message: '取消删除' })
  })
}
async function getPatientHospitalNumberOut() {
  const filter = {
    PageIndex: 1,
    PageSize: 1000,
  }
  const { success, data } = await patientHospitalNumberOutServiceProxy.patientGET6(patient.id, JSON.stringify(filter))
  tableData.value = data
  if (success) {
    const array = data.map((x) => {
      return {
        ...x,
        add: false,
        edit: false,
      }
    })
    tableData.value = array as any
  }
}
</script>
