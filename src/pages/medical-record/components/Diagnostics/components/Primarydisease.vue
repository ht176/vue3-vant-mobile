<template>
  <div class="p-4">
    <el-row :gutter="20">
      <el-col :span="12">
        <span>{{ '原发病诊断' }}</span>
      </el-col>
      <el-col :span="12" align="right">
        <el-button type="primary" size="small" :loading="loading" @click="saveForm(ruleFormRef)">
          {{ '保存' }}
        </el-button>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="mt-2">
      <el-col :span="24">
        <el-form ref="ruleFormRef" :model="formModel" :rules="rules" label-width="auto">
          <!-- 诊断日期 -->
          <el-form-item label="诊断日期：" prop="date">
            <el-date-picker
              v-model="formModel.date as unknown as Date"
              type="year"
              class="!w-full"
              :disabled-date="disabledDate"
              placeholder="请选择日期"
            />
          </el-form-item>
          <!-- 原发病诊断分类 -->
          <el-form-item label="原发病诊断分类：" prop="type">
            <el-radio-group v-model="formModel.type" @change="handleTypeChange">
              <el-radio v-for="item in primarydiseasess" :key="item" :value="item">
                {{ item }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- 原发性肾小球疾病 -->
          <el-form-item v-if="formModel.type && formModel.type.indexOf('原发性肾小球疾病') !== -1" label="原发性肾小球疾病：">
            <el-checkbox-group v-model="formModel.primaryGlomerularDisease as unknown as Array<string>">
              <el-checkbox v-for="item in primaryglomerulardiseases" :key="item" :value="item">
                {{ item }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <!-- 其它继发性肾小球疾病 -->
          <el-form-item v-if="formModel.type && formModel.type.indexOf('其它继发性肾小球疾病') !== -1" label="其它继发性肾小球疾病：">
            <el-checkbox-group v-model="formModel.secondaryGlomerularDisease as unknown as Array<string>">
              <el-checkbox v-for="item in secondaryglomerulardisease" :key="item" :value="item">
                {{ item }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <!-- 遗传性及先天性疾病 -->
          <el-form-item v-if="formModel.type && formModel.type.indexOf('遗传性及先天性疾病') !== -1" label="遗传性及先天性疾病：">
            <el-checkbox-group v-model="formModel.hereditaryCongenitalDisease as unknown as Array<string>">
              <el-checkbox v-for="item in hereditarycongenitaldiseases" :key="item" :value="item">
                {{ item }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <!-- 肾小管间质疾病 -->
          <el-form-item v-if="formModel.type && formModel.type.indexOf('肾小管间质疾病') !== -1" label="肾小管间质疾病：">
            <el-checkbox-group v-model="formModel.tubulointerstitialDisease as unknown as Array<string>">
              <el-checkbox v-for="item in tubulointerstitialdisease" :key="item" :value="item">
                {{ item }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <!-- 药物性肾损害 -->
          <el-form-item v-if="formModel.type && formModel.type.indexOf('药物性肾损害') !== -1" label="药物性肾损害：">
            <el-checkbox-group v-model="formModel.drugInducedRenalDamage as unknown as Array<string>">
              <el-checkbox v-for="item in druginducedrenaldamage" :key="item" :value="item">
                {{ item }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <!-- 泌尿系感染和结石 -->
          <el-form-item v-if="formModel.type && formModel.type.indexOf('泌尿系感染和结石') !== -1" label="泌尿系感染和结石：">
            <el-checkbox-group v-model="formModel.urinaryInfectionStones as unknown as Array<string>">
              <el-checkbox v-for="item in urinarytractinfectionsstones" :key="item" :value="item">
                {{ item }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { PatientDiagnosisPrimaryDiseaseServiceProxy, PatientDiagnosisPrimaryDiseaseView, PatientView } from '@/services/PatientServiceProxies'
import type { FormInstance, FormRules } from 'element-plus'
import { formatToDate } from '@/utils/date'
import { showNotify } from 'vant'
import type { Dayjs } from 'dayjs'

const { patient } = defineProps({
  patient: PatientView,
})

const ruleFormRef = ref<FormInstance>()
const formModel = ref<PatientDiagnosisPrimaryDiseaseView>(new PatientDiagnosisPrimaryDiseaseView())
const rules = reactive<FormRules<PatientDiagnosisPrimaryDiseaseView>>({
  date: [{ required: true, message: '请选择诊断日期', trigger: 'change' }],
  type: [{ required: true, message: '请选择原发病诊断分类', trigger: 'change' }],
})
const loading = ref(false)
// 原发病诊断分类
const primarydiseasess = [
  '原发性肾小球疾病',
  '糖尿病肾病',
  '高血压肾损害',
  '其它继发性肾小球疾病',
  '遗传性及先天性疾病',
  '肾小管间质疾病',
  '药物性肾损害',
  '泌尿系肿瘤',
  '泌尿系感染和结石',
  '肾脏切除术后',
  '原发病不明确',
]
// 原发性肾小球疾病
const primaryglomerulardiseases = [
  '急性肾炎综合征',
  '急进性肾炎综合征',
  '慢性肾炎综合征',
  '肾病综合征',
  '血尿',
  '孤立性蛋白尿',
  '其它',
]
// 继发性肾小球疾病
const secondaryglomerulardisease = [
  '肥胖相关性肾病',
  '淀粉样变肾损害',
  '多发骨髓瘤肾病',
  '狼疮性肾炎',
  '系统性血管炎肾损害',
  '过敏紫癜性肾炎',
  '血栓性微血管病肾损害',
  '干燥综合征肾损害',
  '硬皮病肾损害',
  '类风湿性关节炎和强制性脊柱炎肾损害',
  '银屑病肾损害',
  '乙型肝炎病毒相关性肾炎',
  '丙型肝炎病毒相关性肾炎',
  'HIV相关性肾损害',
  '流行性出血热肾损害',
  '其它',
]
// 遗传性及先天性疾病
const hereditarycongenitaldiseases = [
  '多囊肾病',
  'Alport综合征',
  '薄基底膜肾病',
  '近端肾小管损伤及Fanconi综合征',
  'Bartter综合征',
  'Fabry病',
  '脂蛋白肾病',
  '肾发育不良',
  '其它',
]
// 肾小管间质疾病
const tubulointerstitialdisease = [
  '急性肾小管间质性肾炎',
  '慢性肾小管间质性肾炎',
  '急性肾小管坏死',
  '肾小管性酸中毒',
  '慢性肾孟肾炎',
  '反流性肾病',
  '梗阻性肾病',
  '其它',
]
// 药物性肾损害
const druginducedrenaldamage = [
  '马兜铃酸肾病',
  '造影剂肾病',
  '重金属中毒性肾脏损害',
  '放射性肾病及抗肿瘤药物所致的肾损害',
  '氨基苷类抗生素肾损害',
  '其它',
]
// 泌尿系感染和结石
const urinarytractinfectionsstones = [
  '泌尿系结核',
  '肾结石',
  '其它',
]

function disabledDate(time: Date) {
  return time.getTime() > Date.now()
}

const patientDiagnosisPrimaryDiseaseServiceProxy = new PatientDiagnosisPrimaryDiseaseServiceProxy()
onMounted(() => {
  getpatientDiagnosisPrimaryDisease()
})
async function getpatientDiagnosisPrimaryDisease() {
  loading.value = true
  const { success, data, message } = await patientDiagnosisPrimaryDiseaseServiceProxy.patientDiagnosisPrimaryDiseaseGET(patient.id)
  if (success) {
    if (data) {
      formModel.value.id = data.id
      formModel.value.patientId = data.patientId
      formModel.value.date = formatToDate(data.date) as unknown as Dayjs
      formModel.value.type = data.type
      formModel.value.primaryGlomerularDisease = data.primaryGlomerularDisease?.split(',') as unknown as string
      formModel.value.secondaryGlomerularDisease = data.secondaryGlomerularDisease?.split(',') as unknown as string
      formModel.value.hereditaryCongenitalDisease = data.hereditaryCongenitalDisease?.split(',') as unknown as string
      formModel.value.tubulointerstitialDisease = data.tubulointerstitialDisease?.split(',') as unknown as string
      formModel.value.drugInducedRenalDamage = data.drugInducedRenalDamage?.split(',') as unknown as string
      formModel.value.urinaryInfectionStones = data.urinaryInfectionStones?.split(',') as unknown as string
    }
    else {
      ruleFormRef.value.resetFields()
    }
  }
  else {
    showNotify({ type: 'danger', message })
  }
  loading.value = false
}
function handleTypeChange() {
  formModel.value.primaryGlomerularDisease = [] as unknown as string
  formModel.value.secondaryGlomerularDisease = [] as unknown as string
  formModel.value.hereditaryCongenitalDisease = [] as unknown as string
  formModel.value.tubulointerstitialDisease = [] as unknown as string
  formModel.value.drugInducedRenalDamage = [] as unknown as string
  formModel.value.urinaryInfectionStones = [] as unknown as string
}
async function saveForm(formEl: FormInstance | undefined) {
  if (!formEl)
    return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      loading.value = true
      const data = Object.assign({}, formModel.value)
      data.primaryGlomerularDisease = (data.primaryGlomerularDisease as any)?.join(',') as any
      data.secondaryGlomerularDisease = (data.secondaryGlomerularDisease as any)?.join(',') as any
      data.hereditaryCongenitalDisease = (data.hereditaryCongenitalDisease as any)?.join(',') as any
      data.tubulointerstitialDisease = (data.tubulointerstitialDisease as any)?.join(',') as any
      data.drugInducedRenalDamage = (data.drugInducedRenalDamage as any)?.join(',') as any
      data.urinaryInfectionStones = (data.urinaryInfectionStones as any)?.join(',') as any
      const { success, message } = await patientDiagnosisPrimaryDiseaseServiceProxy.patientDiagnosisPrimaryDiseasePOST(patient.id, data)
      if (success) {
        showNotify({ type: 'success', message: '保存成功' })
      }
      else {
        showNotify({ type: 'danger', message })
      }
      loading.value = false
    }
    else {
      console.log('error submit!', fields)
    }
  })
}
</script>
