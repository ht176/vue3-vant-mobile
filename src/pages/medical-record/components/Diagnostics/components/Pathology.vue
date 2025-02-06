<template>
  <div class="p-4">
    <el-row :gutter="20">
      <el-col :span="12">
        <span>{{ '病理诊断' }}</span>
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
          <!-- 病理 -->
          <el-form-item label="病理(是否做过肾活检)：" prop="diagnosis">
            <el-radio-group v-model="formModel.diagnosis" @change="pathologicalChange">
              <el-radio :value="1">
                有
              </el-radio>
              <el-radio :value="0">
                无
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-if="Number(formModel.diagnosis) === 1">
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
            <!-- 病理诊断分类 -->
            <el-form-item label="病理诊断分类：" prop="type">
              <el-checkbox-group v-model="formModel.type as unknown as Array<string>" @change="handleTypeChange">
                <el-checkbox v-for="item in pathology" :key="item" :value="item">
                  {{ item }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <!-- 原发性肾小球疾病 -->
            <el-form-item v-if="formModel.type && formModel.type.indexOf('原发性肾小球疾病') !== -1" label="原发性肾小球疾病：">
              <el-checkbox-group v-model="formModel.primaryGlomerularDisease as unknown as Array<string>">
                <el-checkbox v-for="item in primaryglomerulardiseases" :key="item" :value="item">
                  {{ item }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <!-- 继发性肾小球疾病 -->
            <el-form-item v-if="formModel.type && formModel.type.indexOf('继发性肾小球疾病') !== -1" label="继发性肾小球疾病">
              <el-checkbox-group v-model="formModel.secondaryGlomerularDisease as unknown as Array<string>">
                <el-checkbox v-for="item in secondaryglomerulardisease" :key="item" :value="item">
                  {{ item }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <!-- 遗传性及先天性疾病 -->
            <el-form-item v-if="formModel.type && formModel.type.indexOf('遗传性及先天性疾病') !== -1" label="遗传性及先天性疾病">
              <el-checkbox-group v-model="formModel.hereditaryCongenitalDisease as unknown as Array<string>">
                <el-checkbox v-for="item in hereditarycongenitaldiseases" :key="item" :value="item">
                  {{ item }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <!-- 肾小管间质疾病 -->
            <el-form-item v-if="formModel.type && formModel.type.indexOf('肾小管间质疾病') !== -1" label="肾小管间质疾病">
              <el-checkbox-group v-model="formModel.tubulointerstitialDisease as unknown as Array<string>">
                <el-checkbox v-for="item in tubulointerstitialdisease" :key="item" :value="item">
                  {{ item }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { PatientDiagnosisPathologicalServiceProxy, PatientDiagnosisPathologicalView, PatientView } from '@/services/PatientServiceProxies'
import type { FormInstance, FormRules } from 'element-plus'
import { formatToDate } from '@/utils/date'
import { showNotify } from 'vant'
import type { Dayjs } from 'dayjs'

const { patient } = defineProps({
  patient: PatientView,
})

const ruleFormRef = ref<FormInstance>()
const formModel = ref<PatientDiagnosisPathologicalView>(new PatientDiagnosisPathologicalView())
const rules = reactive<FormRules<PatientDiagnosisPathologicalView>>({
  diagnosis: [{ required: true, message: '请选择有无病理', trigger: 'change' }],
  date: [{ required: true, message: '请选择诊断日期', trigger: 'change' }],
  type: [{ required: true, message: '请选择病理诊断分类', trigger: 'change' }],
})
const loading = ref(false)
// 病理诊断分类
const pathology = [
  '原发性肾小球疾病',
  '继发性肾小球疾病',
  '遗传性及先天性疾病',
  '肾小管间质疾病',
]
// 原发性肾小球疾病
const primaryglomerulardiseases = [
  '微小病变性肾病',
  '局灶节段性肾小球损害',
  '膜性肾病',
  '系膜增殖性肾炎',
  'IgA肾病',
  '毛细血管内增值性肾炎',
  '膜增值性肾炎',
  '新月体肾炎',
  '硬化性肾炎',
  '其它',
]
// 继发性肾小球疾病
const secondaryglomerulardisease = [
  '高血压肾硬化',
  '糖尿病肾病',
  '肥胖相关性肾病',
  '淀粉样变性',
  '多发骨髓瘤肾病',
  '冷球蛋白血症性肾炎',
  '轻链型肾病',
  '狼疮性肾炎',
  '过敏紫癜性肾炎',
  '抗基底膜肾炎(Goodpasture综合征)',
  '系统性血管炎',
  '血栓性微血管病',
  '干燥综合征肾损害',
  '硬皮病肾损害',
  '乙型肝炎病毒相关性肾炎',
  '丙型肝炎病毒相关性肾炎',
  'HIV相关性肾损害',
  '流行性出血热肾损害',
  '其它',
]
// 遗传性及先天性疾病
const hereditarycongenitaldiseases = [
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
  '马兜铃酸肾病',
  '其它',
]

function disabledDate(time: Date) {
  return time.getTime() > Date.now()
}

const patientDiagnosisPathologicalServiceProxy = new PatientDiagnosisPathologicalServiceProxy()
onMounted(() => {
  getpatientDiagnosisPrimaryDisease()
})
function pathologicalChange(val) {
  if (Number(val) !== 1) {
    formModel.value.date = undefined
    formModel.value.type = [] as unknown as string
  }
  handleTypeChange([])
}
async function getpatientDiagnosisPrimaryDisease() {
  loading.value = true
  const { success, data, message } = await patientDiagnosisPathologicalServiceProxy.patientDiagnosisPathologicalGET(patient.id)
  if (success) {
    if (data) {
      formModel.value.diagnosis = data.diagnosis
      formModel.value.id = data.id
      formModel.value.patientId = data.patientId
      formModel.value.date = formatToDate(data.date) as unknown as Dayjs
      formModel.value.type = data.type?.split(',') as unknown as string
      formModel.value.primaryGlomerularDisease = data.primaryGlomerularDisease?.split(',') as unknown as string
      formModel.value.secondaryGlomerularDisease = data.secondaryGlomerularDisease?.split(',') as unknown as string
      formModel.value.hereditaryCongenitalDisease = data.hereditaryCongenitalDisease?.split(',') as unknown as string
      formModel.value.tubulointerstitialDisease = data.tubulointerstitialDisease?.split(',') as unknown as string
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
function handleTypeChange(val) {
  if (!val.includes('原发性肾小球疾病')) {
    formModel.value.primaryGlomerularDisease = [] as unknown as string
  }
  if (!val.includes('继发性肾小球疾病')) {
    formModel.value.secondaryGlomerularDisease = [] as unknown as string
  }
  if (!val.includes('遗传性及先天性疾病')) {
    formModel.value.hereditaryCongenitalDisease = [] as unknown as string
  }
  if (!val.includes('肾小管间质疾病')) {
    formModel.value.tubulointerstitialDisease = [] as unknown as string
  }
}
async function saveForm(formEl: FormInstance | undefined) {
  if (!formEl)
    return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      loading.value = true
      const data = Object.assign({}, formModel.value)
      data.type = (data.type as any)?.join(',') as unknown as string
      data.primaryGlomerularDisease = (data.primaryGlomerularDisease as any)?.join(',') as unknown as string
      data.secondaryGlomerularDisease = (data.secondaryGlomerularDisease as any)?.join(',') as unknown as string
      data.hereditaryCongenitalDisease = (data.hereditaryCongenitalDisease as any)?.join(',') as unknown as string
      data.tubulointerstitialDisease = (data.tubulointerstitialDisease as any)?.join(',') as unknown as string
      const { success, message } = await patientDiagnosisPathologicalServiceProxy.patientDiagnosisPathologicalPOST(patient.id, data)
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
