<template>
  <div align="left">
    <div class="index-title mb-2 text-center">
      门诊血液透析治疗病历首页
    </div>
    <div class="index-content">
      <div class="flex">
        <div class="mr-4 flex items-center">
          <span class="flex-shrink-0">首次治疗日期</span>
          <div class="underline-div">
            {{ formatToDate(patientInfo.dialysisDateFirst) }}
          </div>
        </div>
        <div class="mr-4 flex items-center">
          <span class="flex-shrink-0">住院号</span>
          <div class="underline-div">
            {{ patientInfo.hospitalNumberIn }}
          </div>
        </div>
        <div class="flex items-center">
          <span class="flex-shrink-0">门诊号</span>
          <div class="underline-div">
            {{ patientInfo.hospitalNumberOut }}
          </div>
        </div>
      </div>
      <div class="flex">
        <div class="mr-4 flex items-center">
          <span class="flex-shrink-0">姓名</span>
          <div class="underline-div">
            {{ patientInfo.name }}
          </div>
        </div>
        <div class="mr-4 flex items-center">
          <span class="flex-shrink-0">性别</span>
          <div class="flex items-center">
            <div class="checkbox-div ml-4">
              <span v-if="patientInfo.Genderlabel === '男'">√</span>
            </div>
            <label for="scales">男</label>
            <div class="checkbox-div ml-4">
              <span v-if="patientInfo.Genderlabel === '女'">√</span>
            </div>
            <label for="horns">女</label>
          </div>
        </div>
      </div>
      <div class="flex items-center">
        <span class="flex-shrink-0">身份证号</span>
        <div class="ml-4 flex items-center">
          <div v-for="(item, index) in patientInfo.idNumber" :key="index" class="checkbox-div">
            {{ item }}
          </div>
        </div>
      </div>
      <div>
        <div class="mr-4 flex flex-wrap items-center">
          <span class="flex-shrink-0">现住址（详填）</span>
          <div class="underline-div medium-width">
            {{ patientInfo.province }}
          </div><span class="flex-shrink-0">省</span>
          <div class="underline-div medium-width">
            {{ patientInfo.city }}
          </div><span class="flex-shrink-0">市</span>
          <div class="underline-div max-width">
            {{ patientInfo.area }}
          </div><span class="flex-shrink-0">县（区）</span>
          <div class="underline-div flex-grow">
            {{ patientInfo.address }}
          </div>
        </div>
      </div>
      <div class="flex">
        <div class="mr-4 flex items-center">
          <span class="flex-shrink-0">电话</span>
          <div class="underline-div">
            {{ patientInfo.telephone }}
          </div>
        </div>
        <div class="mr-4 flex items-center">
          <span class="flex-shrink-0">亲属联系方式</span>
          <div class="underline-div">
            {{ patientInfo.relationPhone }}
          </div>
        </div>
        <div class="mr-4 flex items-center">
          <span class="flex-shrink-0">工作单位</span>
          <div class="underline-div">
            {{ patientInfo.workUnit }}
          </div>
        </div>
      </div>
      <div class="flex items-center">
        <span class="flex-shrink-0">诊断</span>
        <div class="underline-div flex-grow">
          {{ patientInfo.diagnosisLabel }}
        </div>
      </div>
      <div class="flex items-center">
        <span class="flex-shrink-0">合并症或并发症</span>
        <div class="underline-div flex-grow">
          {{ patientInfo.diagnosisComplication }}
        </div>
      </div>
    </div>
    <!-- 干体重、血管通路、抗凝剂 -->
    <el-row id="dryWeight" class="mt-4">
      <table class="printTable">
        <tbody>
          <tr>
            <td :colspan="2">
              干体重
            </td>
            <td :colspan="2">
              血管通路
            </td>
            <td :colspan="2">
              抗凝剂
            </td>
          </tr>
          <tr>
            <td>日期</td>
            <td>体重（kg）</td>
            <td>日期</td>
            <td>名称</td>
            <td>日期</td>
            <td>种类</td>
          </tr>
          <tr v-for="(item, index) of summarys" :key="index">
            <td>{{ item.WeightBestDate }}&nbsp;</td>
            <td>{{ item.WeightBest }}</td>
            <td>{{ item.VascularAccessDate }}</td>
            <td>{{ item.VascularAccessName }}</td>
            <td>{{ item.AnticoagulantDate }}</td>
            <td>{{ item.AnticoagulantType }}</td>
          </tr>
        </tbody>
      </table>
    </el-row>
    <el-row id="medicahist">
      <table class="printTable">
        <tr>
          <td :rowspan="historys.length + 1" class="td-title">
            传染病统计
          </td>
          <td style="width: 13.7%;">
            日期
          </td>
          <td style="width: 16.7%;">
            名称
          </td>
          <td :rowspan="historys.length + 1" class="td-title">
            肿瘤登记
          </td>
          <td style="width: 13.6%;">
            日期
          </td>
          <td style="width: 16.65%;">
            名称
          </td>
          <td :rowspan="historys.length + 1" class="td-title">
            过敏反应
          </td>
          <td style="width: 13.7%;">
            日期
          </td>
          <td style="width: 17%;">
            名称
          </td>
        </tr>
        <tr v-for="(item, index) of historys" :key="index">
          <td>{{ item.InfectiousDiseasesDate }}&nbsp;</td>
          <td>{{ item.InfectiousDiseasesName }}</td>
          <td>{{ item.TumorDate }}</td>
          <td>{{ item.TumorName }}</td>
          <td>{{ item.AllergyDate }}</td>
          <td>{{ item.AllergyName }}</td>
        </tr>
      </table>
    </el-row>
    <el-row id="treatmentScheme">
      <table class="printTable">
        <tr>
          <td :colspan="6">
            血液透析治疗方案调整
          </td>
        </tr>
        <tr>
          <td>治疗频率</td>
          <td>调整日期</td>
          <td>治疗方式</td>
          <td>调整日期</td>
          <td>透析液钙浓度</td>
          <td>调整日期</td>
        </tr>
        <tr v-for="item of prescriptionPlans" :key="item.frequency">
          <td>{{ item.frequency }}&nbsp;</td>
          <td>{{ item.frequencyAdjustDate }}</td>
          <td>{{ item.dialysisMode }}</td>
          <td>{{ item.modeAdjustDate }}</td>
          <td>{{ item.ca }}</td>
          <td>{{ item.caAdjustDate }}</td>
        </tr>
      </table>
    </el-row>
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
const { patientInfo, summarys, historys, prescriptionPlans } = defineProps({
  patientInfo: { type: Object, default: () => {} },
  summarys: { type: Array<summary> },
  historys: { type: Array<history> },
  prescriptionPlans: { type: Array<IPrescriptionPlan> },
})
</script>

<style lang="less">
.index-title {
  font-size: 24px;
  padding-bottom: 12px;
  border-bottom: 3px solid;
}
.index-content {
  line-height: 2;
}
.underline-div {
  min-width: 170px;
  line-height: 1;
  padding-left: 8px;
  border-bottom: 1px solid;
}
.underline-div:empty::after {
  content: '-';
}
.checkbox-div {
  width: 20px;
  height: 20px;
  line-height: 22px;
  font-size: 16px;
  text-align: center;
  margin-right: 8px;
  border: 1px solid;
  display: inline-block;
}
.medium-width {
  min-width: 140px;
  width: 140px;
}
.max-width {
  min-width: 200px;
  width: 200px;
}
.printTable {
  border: 1px solid #333;
  border-collapse: collapse;
  text-align: center;
  width: 100%;
  td {
    width: 13%;
    min-height: 28px;
    border: 1px solid #333;
    vertical-align: middle;
  }
  .td-title {
    width: 3%;
    min-width: 24px;
    min-height: 100px;
    writing-mode: vertical-rl;
  }
}
</style>
