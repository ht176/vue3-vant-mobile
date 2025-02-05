<template>
  <div class="p-2">
    <div>
      <div class="text-right">
        <!-- 编辑 -->
        <el-button type="primary" size="small" @click="extInfoVisiable = true">
          编辑
        </el-button>
      </div>
      <el-form label-width="200px" label-position="right">
        <el-row>
          <el-col v-for="(item, index) in datasInfo" :key="index" :span="10" style="word-break:break-all">
            <el-form-item :label="`${item.name}：`" style="text-align:left">
              {{ item.value }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <EditPatientExtensionInfo v-model="datasInfo" :patient="patient" :ext-info-visiable="extInfoVisiable" @close-dialog="extInfoVisiable = false" />
    </div>
  </div>
</template>

<script>
</script>

<script setup lang="ts">
import type { PatientExtraView } from '@/services/PatientServiceProxies'
import { PatientExtraServiceProxy, PatientView } from '@/services/PatientServiceProxies'

const { patient } = defineProps({
  patient: PatientView,
})
const datasInfo = ref<PatientExtraView[]>()
const extInfoVisiable = ref(false)

onMounted(() => {
  getExtenseInfo()
})

const patientExtraServiceProxy = new PatientExtraServiceProxy()

async function getExtenseInfo() {
  const { success, data } = await patientExtraServiceProxy.patientGET3(patient.id, JSON.stringify({}), undefined)
  if (success) {
    datasInfo.value = data
  }
}
</script>
