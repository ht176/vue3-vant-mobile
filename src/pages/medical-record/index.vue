<template>
  <div class="medRecord overflow-auto">
    <div>
      <van-popup v-model:show="patientHomeShow" :overlay="true" style="width: 100%;height: 100%;">
        <PatientHome />
      </van-popup>
      <div class="head">
        <el-row class="bg-white">
          <el-col :span="3">
            <el-col :span="24">
              <el-col :span="24" @click="getPatientList">
                <div class="left-title">
                  <el-icon class="ml-2">
                    <Menu />
                  </el-icon>
                  患者列表
                </div>
              </el-col>
            </el-col>
          </el-col>
          <el-col :span="21">
            <el-row :span="24" class="patient-content">
              <el-col :span="4" class="pt-4">
                {{ patient.nameFull }}
                <div v-if="patient.prognosisState !== 'IN'" class="transf-tag">
                  归
                </div>
              </el-col>
              <el-col :span="20" class="color-coolgray">
                <div class="flex flex-wrap">
                  <el-col :span="5">
                    性别：{{ patient.genderName }}
                  </el-col>
                  <el-col :span="5">
                    年龄：{{ getAgeByBirthdate }}
                  </el-col>
                  <el-col :span="4">
                    民族：{{ patient.nationality }}--
                  </el-col>
                  <el-col :span="5">
                    门诊号：{{ patient.hospitalNumberOut }}
                  </el-col>
                  <el-col :span="5">
                    住院号：{{ patient.hospitalNumberIn }}
                  </el-col>
                  <el-col :span="5">
                    医保卡号：{{ patient.medicareNumber }}
                  </el-col>
                  <el-col :span="5">
                    透析号：{{ patient.dialysisNumber }}
                  </el-col>
                </div>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
      <div>
        <div class="page-component__scroll">
          <div class="el-scrollbar__wrap">
            <div style="position: relative;">
              <div class="page-component">
                <div class="page-component__nav" style="width:12.5vw;">
                  <div class="el-scrollbar__wrap">
                    <div style="position: relative;">
                      <van-col span="24">
                        <el-menu :default-active="activeKey" @select="handleSelect">
                          <div v-for="(item, index) in list" :key="item.name">
                            <el-menu-item :index="String(index)">
                              <span>{{ item.name }}<!-- {{ String(index) }}{{ activeKey }} --></span>
                            </el-menu-item>
                          </div>
                        </el-menu>
                      </van-col>
                    </div>
                  </div>
                </div>
                <div class="page-component__nav el-scrollbar" style="width:87.5vw;left:12.5vw">
                  <div class="el-scrollbar__wrap bg-white">
                    <div>
                      <component :is="selectComp" v-if="patient.id" :patient="patient" @refresh-data="refreshData" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PatientServiceProxy, PatientView } from '@/services/PatientServiceProxies'
import { Menu } from '@element-plus/icons-vue'

const patientHomeShow = ref(false)
onMounted(() => {
  const route = useRoute()
  getPatientList(route.query.id, route.query.myTab)
})

const patientServiceProxy = new PatientServiceProxy ()
const patient = ref(new PatientView())
const activeKey = ref('0')
const selectMenu = ref('0')
const list = ref([
  { name: '病历首页', authCode: '', comp: markRaw(defineAsyncComponent(() => import('./components/Medical-home/index.vue'))) },
  { name: '基本信息', authCode: '', comp: markRaw(defineAsyncComponent(() => import('./components/BasicInformation/index.vue'))) },
  { name: '住院信息', authCode: 'pad.CureAfter.pad.medicalrecord.dischargerecords.see' },
  { name: '转归管理', authCode: '', comp: markRaw(defineAsyncComponent(() => import('./components/Patienttransfer/index.vue'))) },
  { name: '既往病史', authCode: '', comp: markRaw(defineAsyncComponent(() => import('./components/Pastmedicalhistory/index.vue'))) },
  { name: '诊断信息', authCode: '', comp: markRaw(defineAsyncComponent(() => import('./components/Diagnostics/index.vue'))) },
  { name: '血管通路', authCode: '' },
  { name: '透析处方', authCode: '' },
  { name: '体格检查', authCode: '' },
  { name: '病程记录', authCode: 'pad.CureAfter.pad.medicalrecord.courserecord.see' },
  { name: '医嘱信息', authCode: '' },
  { name: '透析信息', authCode: '' },
  { name: '宣教记录', authCode: 'pad.CureAfter.pad.medicalrecord.educationrecord.see' },
  { name: '评估信息' },
  { name: '实验室检查', authCode: '' },
  { name: '辅助检查', authCode: '' },
  { name: '档案管理', authCode: 'pad.CureAfter.pad.medicalrecord.filemanagement.see' },
  { name: '统计信息', authCode: '' },
])
function handleSelect(key: string, keyPath: string[]) {
  console.log(key, keyPath)
  selectMenu.value = key
}
function refreshData(val) {
  getPatientList(val.id, '')
}

const selectComp = computed(() => {
  return list.value[selectMenu.value]?.comp
  // return list.value.find(x => x.name === selectMenu.value)?.comp
})
/* 查找患者信息 */
async function getPatientList(id, tab) {
  const filters = {
    pageIndex: 1,
    pageSize: 1,
    id: { value: id, type: '=' },
  }
  const { success, data } = await patientServiceProxy.filterGET(JSON.stringify(filters), '', '', '', '', undefined)
  if (success) {
    patient.value = data[0]
    if (tab) {
      activeKey.value = String(tab)
      selectMenu.value = String(tab)
    }
  }
}
const getAgeByBirthdate = computed(() => {
  const birthdate = patient.value.birthdate
  if (birthdate) {
    const today = new Date()
    let age = today.getFullYear() - birthdate.year()
    const month = today.getMonth() - birthdate.month()
    return (month < 0 || (month === 0 && today.getDate() < birthdate.date())) ? --age : age
  }
  else {
    return null
  }
})
</script>

<style lang="less">
.left-title {
  height: 80px;
  line-height: 80px;
  font-size: 1.2vw;
  border-right: solid 0.1vw rgb(241, 239, 239);
}
.transf-tag {
  display: inline-block;
  margin-left: -1px;
  transform: translateY(-3px);
  padding: 6px;
  border: 2px solid red;
  color: red;
  border-radius: 50%;
  text-align: center;
  line-height: 1;
  font-size: 16px;
}
.patient-content {
  background-color: white;
  text-align: left;
  font-size: 1.5vw;
  padding: 0.9vw 1.3vw;
  height: 80px;
  line-height: 40px;
}
.medRecord .head {
  position: fixed;
  width: 100%;
  left: 0;
  top: 0;
}
.page-component .page-component__nav {
  position: fixed;
  top: 0;
  bottom: 0;
  padding-top: 80px;
  transition: padding-top 0.3s;
}
.page-component__scroll {
  height: calc(100% - 80px);
  margin-top: 80px;
}
.page-component__scroll .el-scrollbar__wrap {
  overflow-x: auto;
}
</style>

<route lang="json">
  {
    "name": "medical-record"
  }
</route>
