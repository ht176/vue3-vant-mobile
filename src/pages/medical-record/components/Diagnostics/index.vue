<template>
  <div class="p-4">
    <div align="center">
      <van-tabs v-model:active="activeName" type="card" color="#1989fa">
        <van-tab v-for="item in diagnosisList" :key="item.name" :title="item.name" :name="item.code" />
      </van-tabs>
    </div>
    <div>
      <Primarydisease v-if="activeName === 'primarydisease'" :patient="patient" />
      <Pathology v-if="activeName === 'pathology'" :patient="patient" />
      <Complication v-if="activeName === 'complication'" :patient="patient" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { PatientView } from '@/services/PatientServiceProxies'

const { patient } = defineProps({
  patient: PatientView,
})

const activeName = ref('complication')
const diagnosisList = ref(
  [{ name: '原发病诊断', code: 'primarydisease', authCode: '' }, { name: '病理诊断', code: 'pathology', authCode: '' }, { name: '并发症诊断', code: 'complication', authCode: '' }, { name: '传染病诊断', code: 'infectiousDiag', authCode: '' }, { name: '肿瘤诊断', code: 'tumorDiag', authCode: '' }, { name: '过敏诊断', code: 'allergiesDiag', authCode: '' }],
)
</script>
