<template>
  <div>
    <el-row>
      <el-col :span="24">
        <div class="font-size-6" align="center">
          {{ hospitalName }}
        </div>
        <div class="font-size-6" align="center">
          血液净化治疗病历首页
        </div>
      </el-col>
    </el-row>
    <el-row class="mb-2 mt-4">
      <el-col :span="8">
        <span class="span">
          首次治疗日期：{{ formatToDate(patientInfo.dialysisDateFirst) }}
        </span>
      </el-col>
      <el-col :span="5">
        <span class="span">
          医保卡号：{{ patientInfo.MedicareNumber }}
        </span>
      </el-col>
      <el-col :span="5">
        <span class="span">
          住院号：{{ patientInfo.HospitalNumberIn }}
        </span>
      </el-col>
      <el-col :span="6">
        <span class="span">
          透析号：{{ patientInfo.DialysisNumber }}
        </span>
      </el-col>
    </el-row>
    <el-row class="mb-2">
      <el-col :span="24" class="mb-2">
        <span class="span">
          姓名：{{ patientInfo.name }}
        </span>
      </el-col>
      <el-col :span="24" class="mb-2">
        <span class="span">诊断：{{ patientInfo.diagnosisLabel }}</span>
      </el-col>
      <el-col :span="24" class="mb-2">
        <span class="span">合并症/并发症：{{ patientInfo.diagnosisComplication }}</span>
      </el-col>
      <el-col :span="24" class="mb-2">
        <span class="span">
          现住地址：{{ patientInfo.province }}{{ patientInfo.city }}{{ patientInfo.area }}{{ patientInfo.address }}
        </span>
      </el-col>
      <el-col :span="24">
        <span class="span">
          户口地址：{{ getExtra('户口地址') }}
        </span>
      </el-col>
    </el-row>
    <el-row class="mb-2">
      <el-col :span="8">
        <span class="span">
          电话：{{ patientInfo.telephone }}
        </span>
      </el-col>
      <el-col :span="8">
        <span class="span">
          手机：{{ getExtra('手机') }}
        </span>
      </el-col>
      <el-col :span="8">
        <span class="span">
          Email：{{ getExtra('Email') }}
        </span>
      </el-col>
    </el-row>
    <el-row class="mb-2">
      <el-col :span="8">
        <span class="span">
          工作单位：{{ patientInfo.workUnit }}
        </span>
      </el-col>
      <el-col :span="8">
        <span class="span">
          地址：{{ getExtra('地址') }}
        </span>
      </el-col>
    </el-row>
    <el-table
      :data="summarys"
      style="width: 100%"
    >
      <el-table-column label="干体重">
        <el-table-column prop="WeightBestDate" label="日期" />
        <el-table-column prop="VascularAccessDate" label="血管通路" />
        <el-table-column prop="VascularAccessName" label="名称" />
      </el-table-column>
      <el-table-column label="抗凝剂">
        <el-table-column prop="AnticoagulantDate" label="日期" />
        <el-table-column prop="AnticoagulantType" label="种类" />
      </el-table-column>
    </el-table>
    <el-table
      class="mt-4"
      :data="historys"
      style="width: 100%"
    >
      <el-table-column label="传染病登记">
        <el-table-column prop="InfectiousDiseasesDate" label="日期" />
        <el-table-column prop="InfectiousDiseasesName" label="名称" />
      </el-table-column>
      <el-table-column label="肿瘤登记">
        <el-table-column prop="TumorDate" label="日期" />
        <el-table-column prop="TumorName" label="种类" />
      </el-table-column>
      <el-table-column label="过敏反应">
        <el-table-column prop="AllergyDate" label="日期" />
        <el-table-column prop="AllergyName" label="药物名称" />
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import type { IPrescriptionPlan } from '@/services/PatientServiceProxies'
import { formatToDate } from '@/utils/date'

interface summary {
  WeightBestDate: string
  WeightBest: string
  VascularAccessDate: string
  VascularAccessName: string
  AnticoagulantDate: string
  AnticoagulantType: string
}
interface history {
  InfectiousDiseasesDate: string
  InfectiousDiseasesName: string
  TumorDate: string
  TumorName: string
  AllergyDate: string
  AllergyName: string
}
const { patientInfo, summarys, historys, hospitalName } = defineProps({
  patientInfo: { type: Object, default: () => {} },
  hospitalName: { type: String, default: '' },
  summarys: { type: Array<summary> },
  historys: { type: Array<history> },
  prescriptionPlans: { type: Array<IPrescriptionPlan> },
})
function getExtra(val) {
  const data = patientInfo.PatientExtra ? patientInfo.PatientExtra.filter(item => item.Name === val) : ''
  return data.length ? data[0].Value : ''
}
</script>
