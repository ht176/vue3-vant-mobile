<template>
  <div class="p-4">
    <div align="center">
      <van-tabs v-model:active="patienttransferActive" type="card" color="#1989fa" style="width:50%">
        <van-tab v-for="item in patienttransferList" :key="item.name" :title="item.name" />
      </van-tabs>
    </div>
    <div>
      <!-- 转归信息 -->
      <PatienttransferInfo v-if="Number(patienttransferActive) === 0" :patient="patient" />
      <Patienttransfertemplate v-if="patienttransferActive === 1" :patient="patient" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { PatientView } from '@/services/PatientServiceProxies'

const { patient } = defineProps({
  patient: PatientView,
})
const patienttransferActive = ref(0)
const patienttransferList = ref(
  [{ name: '转归信息', authCode: '' }, { name: '转归报告', authCode: 'pad.CureAfter.pad.medicalrecord.patienttransfertemplate.view' }],
)
</script>

<style lang="less">

</style>
