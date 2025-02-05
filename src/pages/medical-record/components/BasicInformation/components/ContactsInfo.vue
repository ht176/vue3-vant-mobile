<template>
  <div class="p-2">
    <div>
      <div class="mb-3 text-right">
        <!-- 编辑 -->
        <el-button type="primary" size="small" @click="AddContact">
          新增联系人信息
        </el-button>
      </div>
      <el-table :data="tableData" border>
        <el-table-column label="与患者关系" prop="relation" />
        <el-table-column label="联系人姓名" prop="name" />
        <el-table-column label="手机号码" prop="phone" />
        <el-table-column label="住宅电话" prop="tel" />
        <el-table-column label="邮箱" prop="email" />
        <el-table-column label="地址" prop="address">
          <template #default="scope">
            <span> {{ scope.row.province }}</span>&nbsp;
            <span> {{ scope.row.city }}</span>&nbsp;
            <span> {{ scope.row.area }}</span>&nbsp;
            <span> {{ scope.row.address }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="190px">
          <template #default="scope">
            <el-button size="small" @click="editRow(scope.row)">
              编辑
            </el-button>
            <el-button size="small" @click="deleteRow(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <AddContacts v-model="formData" :patient="patient" :edit-id="editId" :dialog-visiable="dialogVisiables" @update-table="getContactInfo()" @close-dialog="dialogVisiables = false" />
</template>

<script setup lang="ts">
import { ElMessageBox } from 'element-plus'
import { showNotify } from 'vant'
import { PatientContactsServiceProxy, PatientContactsViewModel, PatientView } from '@/services/PatientServiceProxies'

const { patient } = defineProps({
  patient: PatientView,
})
const tableData = ref([])
const editId = ref()
const dialogVisiables = ref(false)

onMounted(() => {
  getContactInfo()
})

const patientContactsServiceProxy = new PatientContactsServiceProxy()
const formData = ref<PatientContactsViewModel>(new PatientContactsViewModel())
function AddContact() {
  editId.value = ''
  dialogVisiables.value = true
}
function editRow(row) {
  formData.value = row
  editId.value = row.id
  dialogVisiables.value = true
}
async function deleteRow(row) {
  ElMessageBox.confirm('此操作将永久删除该数据, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    console.log('确认')
    showNotify({ type: 'success', message: '删除成功' })
    const result = await patientContactsServiceProxy.delete8(row.id)
    if (result.success) {
      showNotify({ type: 'success', message: '删除成功' })
      getContactInfo()
    }
    else {
      showNotify({ type: 'danger', message: result.message })
    }
  }).catch(() => {
    showNotify({ type: 'danger', message: '取消删除' })
  })
}
async function getContactInfo() {
  const filters = {
    pageIndex: 1,
    pageSize: 100,
    PatientId: { value: patient.id, type: '=' },
  }
  const { success, data } = await patientContactsServiceProxy.filterGET7(JSON.stringify(filters))
  if (success) {
    tableData.value = data
  }
}
</script>
