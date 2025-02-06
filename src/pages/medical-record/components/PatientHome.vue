<template>
  <div class="h-[100vh] flex text-align-left">
    <div class="w-[180px] overflow-hidden p-2">
      <el-row v-for="(item, i) in menuList" :key="item.name" class="menu-div" :class="selectMenuIndex === i ? 'menu-div-active' : ''" @click="handleSelectMenu(i)">
        <el-col :span="19">
          {{ item.name }}
        </el-col>
        <el-col :span="5" class="mark-div">
          <el-badge class="mark" type="primary" :value="item.count" />
        </el-col>
      </el-row>
    </div>
    <div class="patient-list-div">
      <el-form :inline="true" size="small" class="mt-4" @submit.prevent>
        <el-form-item label="病历查询：">
          <el-input v-model="patinetName" size="small" placeholder="姓名/住院号/门诊号/证件号" @input="filterChange" />
        </el-form-item>
        <el-form-item v-if="selectMenu.name === '全部患者'" label="透析状态：">
          <!-- <jl-select v-model="dialysisState" :options="dialysisStateOptions" style="width: 140px;" @change="filterChange" /> -->
        </el-form-item>
        <template v-if="selectMenu.name === '全部患者' || selectMenu.name === '临时透析' || selectMenu.name === '长期透析'">
          <!--  <Dictionary v-model="prognosisState" custom-label="转归状态：" :code="typeDic" prop="prognosisState" :all-choose-option="true" type="select" width="140px" @change="filterChange" /> -->
        </template>
        <!--  <template v-if="selectMenu.name === '全部患者'">
          <el-form-item label="主治医生：">
            <SearchTable v-model="doctorInfo" type-code="0" @change="filterChange" />
          </el-form-item>
          <el-form-item label="主管护士：">
            <SearchTable v-model="nurseInfo" type-code="1" @change="filterChange" />
          </el-form-item>
        </template> -->
      </el-form>
      <div class="patient-list-table">
        <el-table v-loading="tableLoading" class="patient-list-table" :data="tableData" border style="width: 100%" height="600px" @sort-change="sortChange">
          <el-table-column v-for="item in tableColumns" :key="item.prop" :prop="item.prop" />
          <el-table-column label="操作" width="80" fixed="right">
            <template #default="scope">
              <el-button type="primary" size="small" @click="handleEditClick(scope.row)">
                编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin-top: 4px;" align="right">
          <el-pagination v-model:current-page="filter.pageIndex" v-model:page-size="filter.pageSize" :page-sizes="[15, 20, 30, 40, 50, 100]" :total="tableTotalCount" layout="total, sizes, prev, pager, next, jumper" @size-change="handleCurrentChange" @current-change="handleCurrentChange" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PatientServiceProxy } from '@/services/PatientServiceProxies'

const loading = ref(false)
const tableLoading = ref(false)
const tableTotalCount = ref(0)
interface MenuFilter {
  PrognosisState?: { value: string, type: string }
  DialysisState?: { value: string, type: string }
  Doctor?: { value: string, type: string }
  Nurse?: { value: string, type: string }
}
const menuFilter = ref<MenuFilter>({ PrognosisState: { value: 'IN', type: '=' }, DialysisState: { value: '', type: '=' }, Doctor: { value: '', type: '=' }, Nurse: { value: '', type: '=' } })
const patinetName = ref('')

const selectMenuIndex = ref(0)
const filter = reactive({
  pageIndex: 1,
  pageSize: 15,
})

onMounted(() => {
  getPatientCount()
  getPatientList()
})

const patientServiceProxy = new PatientServiceProxy()
const tableData = ref([])
const menuList = reactive([
  { name: '今日就诊', today: true, count: 0 },
  { name: '我的患者', mine: true, count: 0 },
  {
    name: '临时透析',
    filter: {
      DialysisState: { value: 'TEMPORARY', type: '=' },
      PrognosisState: { value: 'IN', type: '=' },
    },
    count: 0,
  },
  {
    name: '长期透析',
    filter: {
      DialysisState: { value: 'LONGTERM', type: '=' },
      PrognosisState: { value: 'IN', type: '=' },
    },
    count: 0,
  },
  {
    name: '在透患者',
    filter: {
      PrognosisState: { value: 'IN', type: '=' },
    },
    count: 0,
  },
  {
    name: '转出患者',
    filter: {
      PrognosisState: { value: 'OUT', type: '=' },
    },
    count: 0,
  },
  {
    name: '退出患者',
    filter: {
      PrognosisState: { value: 'QUIT', type: '=' },
    },
    count: 0,
  },
  {
    name: '全部患者',
    filter: {
      PrognosisState: { value: 'IN', type: '=' },
      DialysisState: { value: '', type: '=' },
      Doctor: { value: '', type: '=' },
      Nurse: { value: '', type: '=' },
    },
    count: 0,
  },
]) // <TableColumnInstance[]>
const tableColumns = reactive([
  { prop: 'nameFull', label: '患者姓名', fixed: true, sortable: 'custom', width: '130' },
  { prop: 'genderName', label: '性别', fixed: true, minWidth: '80' },
  { prop: 'dialysisAge', label: '透析龄(月)', fixed: true, sortable: 'custom', minWidth: '130' },
  { prop: 'dialysisNumber', label: '透析号', sortable: 'custom', minWidth: '120' },
  { prop: 'age', label: '患者年龄', sortable: 'custom', minWidth: '120' },
  { prop: 'telephone', label: '电话', minWidth: '160' },
  { prop: 'infectiousLabel', label: '传染病情况', minWidth: '120' },
  { prop: 'address', label: '家庭住址', minWidth: '160' },
  { prop: 'hospitalNumberIn', label: '住院号', sortable: 'custom', minWidth: '120' },
  { prop: 'hospitalNumberOut', label: '门诊号', sortable: 'custom', minWidth: '120' },
  { prop: 'receiptDate', label: '接收日期', sortable: 'custom', time: true, minWidth: '120' },
  { prop: 'idTypeName', label: '证件类型', minWidth: '100' },
  { prop: 'idNumber', label: '证件号码', button: true, minWidth: '180' },
  { prop: 'cardNumber', label: '透析卡号', sortable: 'custom', minWidth: '140' },
  { prop: 'medicareNumber', label: '医保号', sortable: 'custom', minWidth: '140' },
  { prop: 'medicalNumber', label: '就诊卡号', sortable: 'custom', minWidth: '120' },
  { prop: 'dossierNumber', label: '病历夹号', sortable: 'custom', minWidth: '120' },
  { prop: 'prognosisStateName', label: '转归状态', minWidth: '100' },
  { prop: 'prognosisDate', label: '转归日期', sortable: 'custom', minWidth: '140' },
  { prop: 'prognosisCause', label: '转归原因', minWidth: '140' },
  { prop: 'dialysisStateName', label: '透析状态', minWidth: '110' },
  { prop: 'dialysisDateFirst', label: '首次透析日期', sortable: 'custom', minWidth: '130' },
  { prop: 'doctorName', label: '主治医生', minWidth: '80' },
  { prop: 'nurseName', label: '主管护士', minWidth: '80' },
])
const selectMenu = computed(() => {
  return menuList[Number(selectMenuIndex.value)]
})
function handleSelectMenu(i: number) {
  if (selectMenuIndex.value !== i) {
    // this.prognosisState = 'IN'
    selectMenuIndex.value = i
    filter.pageIndex = 1
    menuFilter.value = menuList[Number(i)].filter || {}
    this.getPatientList()
  }
}
function handleEditClick(i: number) {
  console.log(i)
}
function sortChange(i: number) {
  console.log(i)
}

/**
 * 获取透析首页患者数据
 */
async function getPatientCount() {
  loading.value = true
  const { success, data } = await patientServiceProxy.getPatientCount()
  if (success) {
    menuList.forEach((x) => {
      switch (x.name) {
        case '今日就诊':
          x.count = data.today
          break
        case '我的患者':
          x.count = data.mine
          break
        case '临时透析':
          x.count = data.temporary
          break
        case '长期透析':
          x.count = data.longTerm
          break
        case '在透患者':
          x.count = data.inTreatment
          break
        case '转出患者':
          x.count = data.transferOut
          break
        case '退出患者':
          x.count = data.signOut
          break
        case '全部患者':
          x.count = data.all
          break
      }
    })
  }
  loading.value = false
}
function handleCurrentChange() {
  getPatientList()
}
function filterChange() {
  filter.pageIndex = 1
  getPatientList()
}
async function getPatientList() {
/*   if (selectMenu.value.name === '临时透析' || selectMenu.value.name === '长期透析' || selectMenu.value.name === '全部患者') {
    menuFilter.value.PrognosisState.value = prognosisState
  }
  if (selectMenu.value.name === '全部患者') {
    menuFilter.value.DialysisState.value = dialysisState
    menuFilter.value.Doctor.value = doctorInfo.Id
    menuFilter.value.Nurse.value = nurseInfo.Id
  } */
  const filters = Object.assign({}, filter, menuFilter.value)
  const { success, data, count } = await patientServiceProxy.filterGET(JSON.stringify(filters), patinetName.value, String(Number(Number(selectMenuIndex.value) === 0)), String(Number(Number(selectMenuIndex.value) === 1)), undefined)
  if (success) {
    tableData.value = data
    tableTotalCount.value = count
  }
}
</script>

<style lang="less">
.van-popup--center {
  max-width: 100%;
}
.menu-div {
  display: flex;
  align-items: baseline;
  padding: 12px 10px;
  font-size: 16px;
  height: 56px;
}
.menu-div-active {
  color: #5977f8;
  background: #ecf5ff;
}
.patient-list-div {
  padding-left: 10px;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>
