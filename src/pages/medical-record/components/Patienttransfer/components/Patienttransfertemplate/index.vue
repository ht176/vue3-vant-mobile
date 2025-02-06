<template>
  <div class="p-4">
    <el-row :gutter="20">
      <el-col :span="18">
        <span class="font-bold">转归报告</span>
      </el-col>
      <el-col :span="6" align="right">
        <el-button v-if="!showEditor" type="primary" style="margin-right: 10px" @click="add">
          新 增
        </el-button>
        <el-dropdown v-if="tmplList.length > 0" trigger="click" @command="handleTmplClick">
          <el-button type="primary">
            模 板
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="item of tmplList" :key="item.tmplFormId" :command="item.tmplFormId">
                {{ item.tmplFormName }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { DIC_PROGNOSIS_OUT_CAUSE, DIC_PROGNOSIS_QUIT_CAUSE } from '@/utils/constant'
import { PatientPrognosisReportView, PatientView } from '@/services/PatientServiceProxies'
import { PrognosisTmplFormServiceProxy } from '@/services/WebApiServiceProxies'
import { useAppStore } from '@/stores'

const { patient } = defineProps({
  patient: PatientView,
})
const { getDicDataByCode } = useAppStore()
const showEditor = ref(false)
const tmplList = ref([])
const ruleForm = ref<PatientPrognosisReportView>(new PatientPrognosisReportView())
const dicTmplCustomCode = computed(() => {
  let result = DIC_PROGNOSIS_OUT_CAUSE
  switch (ruleForm.value.dicType) {
    case '转出':
      result = DIC_PROGNOSIS_OUT_CAUSE
      break
    case '退出':
      result = DIC_PROGNOSIS_QUIT_CAUSE
      break
    default:
      break
  }
  return result
})
const dicTmplCustomList = computed(() => {
  return getDicDataByCode(dicTmplCustomCode.value)[0]?.name
})

const prognosisTmplFormServiceProxy = new PrognosisTmplFormServiceProxy()
onMounted(() => {
  getTmplList()
})
async function getTmplList() {
  const { success, data } = await prognosisTmplFormServiceProxy.patientTmplForm(dicTmplCustomList.value, patient.id)
  if (success) {
    tmplList.value = data
  }
}
</script>
