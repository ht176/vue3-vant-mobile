<template>
  <div class="p-4">
    <el-row>
      <el-col :span="24" align="right">
        <el-button type="primary" size="small" @click="savePatient">
          保存
        </el-button>
      </el-col>
    </el-row>
    <el-form label-width="11vw">
      <el-row>
        <div class="item-title title-background mt-1">
          基本信息
        </div>
        <el-col :span="24">
          <AllInformation
            ref="allinformation" v-loading="formLoading" :hospital-areas="hospitalList"
            :patient="patient" :dynamic-tags="dynamicTags" :tmpl-tags="tmplTags" @update-patient="updatePatient" @update-dynamic-tags="updateDynamicTags"
          />
        </el-col>
      </el-row>
    </el-form>
    <el-col :span="24">
      <div class="item-title title-background">
        扩展信息
      </div>
      <PatientExtensionInfo :patient="patient" />
    </el-col>
    <el-col :span="24">
      <div class="item-title title-background">
        联系人信息
      </div>
      <ContactsInfo :patient="patient" />
    </el-col>
    <el-col :span="24">
      <div class="item-title title-background">
        患者透析卡号管理
      </div>
      <Dialysiscard :patient="patient" />
    </el-col>
    <el-col :span="24">
      <div class="item-title title-background">
        患者门诊卡号管理
      </div>
      <HospitalNumberOut :patient="patient" />
    </el-col>
    <el-col :span="24">
      <div class="item-title title-background">
        患者住院卡号管理
      </div>
      <HospitalNumberIn :patient="patient" />
    </el-col>
  </div>
</template>

<script setup lang="ts">
import type { PatientTagsView } from '@/services/PatientServiceProxies'
import { PatientTagsServiceProxy, PatientView } from '@/services/PatientServiceProxies'
import { SysHospitalAreaServiceProxy } from '@/services/SysServiceProxies'
import type { TmplPatientTags } from '@/services/TmplServiceProxies'
import { TmplPatientTagsServiceProxy } from '@/services/TmplServiceProxies'

const { patient } = defineProps({
  patient: PatientView,
})
const emit = defineEmits(['refreshData'])
const allinformation = ref()
const hospitalList = ref([])
const formLoading = ref(false)
const dynamicTags = ref<PatientTagsView[]>()
const tmplTags = ref<TmplPatientTags[]>()
function updatePatient(val) {
  emit('refreshData', val)
}
onMounted(() => {
  doQueryHospitalAreaData()
  searchPatientTags()
})
const sysHospitalAreaServiceProxy = new SysHospitalAreaServiceProxy()
const patientTagsServiceProxy = new PatientTagsServiceProxy()
const tmplPatientTagsServiceProxy = new TmplPatientTagsServiceProxy()
/* 患者标签 */
async function searchPatientTags() {
  const resultTags = await patientTagsServiceProxy.byPatientId10(patient.id)
  if (resultTags.success) {
    dynamicTags.value = resultTags.data
  }
  const filters = {
    pageIndex: 1,
    pageSize: 1000,
  }
  const result = await tmplPatientTagsServiceProxy.filter18(JSON.stringify(filters))
  if (result.success) {
    tmplTags.value = result.data
  }
}
function updateDynamicTags(val) {
  dynamicTags.value = val
}
/* 多院区 */
async function doQueryHospitalAreaData() {
  const filters = {
    pageIndex: 1,
    pageSize: 1000,
    ParentId: {
      value: '0',
      type: '!=',
      dbName: 'ParentId',
    },
    Enabled: {
      value: '1',
      type: '=',
      dbName: 'Enabled',
    },
  }
  const result = await sysHospitalAreaServiceProxy.filter14(JSON.stringify(filters))// 调用接口
  if (result.success) {
    hospitalList.value = result.data.map((item) => {
      return {
        label: item.name,
        value: item.id,
      }
    })
  }
}
function savePatient() {
  allinformation.value.saveForm()
}
</script>

<style lang="less">
.item-title {
  font-size: 1.3vw;
  color: #333;
}
.title-background {
  background: rgba(128, 133, 144, 0.04);
  line-height: 4vw;
  width: 100%;
  text-align: center;
}
</style>
