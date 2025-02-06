<template>
  <el-dialog :model-value="showAddinfections" title="新增" width="70%" append-to-body :close-on-click-modal="false" @close="closed">
    <el-form ref="ruleForm" :model="formInfectious" :rules="rules" label-width="150px">
      <el-row :gutter="20">
        <el-col :span="22">
          <el-form-item label="检查日期：" prop="Date">
            <el-date-picker v-model="formInfectious.date as unknown as Date" class="!w-full" type="date" :disabled="!!formInfectious.id" />
          </el-form-item>
        </el-col>
        <el-col :span="22">
          <!--  <el-form-item label="疾病种类：" prop="Type">
            <Dictionary v-model="typeDiagnosis" dic-code="DIC.DIAGNOSIS.ID.TYPE" type="checkbox" @change="changeInfectiousDiag" />
          </el-form-item> -->
        </el-col>
        <el-col v-if="typeDiagnosis?.indexOf('HCV') !== -1" :span="22">
          <el-form-item label="丙肝：">
            <el-radio-group v-model="formInfectious.hcv">
              <el-radio v-for="item in hcvs" :key="item" :label="item">
                {{ item }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-if="typeDiagnosis?.indexOf('HBV') !== -1" :span="22">
          <el-form-item label="乙肝：">
            <el-radio-group v-model="formInfectious.hepatitisb">
              <el-radio v-for="item in hepatitisbs" :key="item" :label="item">
                {{ item }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-if="typeDiagnosis?.indexOf('HIV') !== -1" :span="22">
          <el-form-item label="艾滋病：">
            <el-radio-group v-model="formInfectious.hiv">
              <el-radio v-for="item in hivs" :key="item" :label="item">
                {{ item }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-if="typeDiagnosis?.indexOf('SYPHILIS') !== -1" :span="22">
          <el-form-item label="梅毒：">
            <el-radio-group v-model="formInfectious.syphilis">
              <el-radio v-for="item in syphilises" :key="item" :label="item">
                {{ item }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-if="typeDiagnosis?.indexOf('TUBERCULOSIS') !== -1" :span="22">
          <el-form-item label="结核：">
            <el-radio-group v-model="formInfectious.tuberculosis">
              <el-radio v-for="item in tuberculosises" :key="item" :label="item">
                {{ item }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-if="typeDiagnosis?.indexOf('OTHER') !== -1" :span="22">
          <el-form-item label="其它：" prop="otherInstructions">
            <el-input v-model="formInfectious.otherInstructions" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="saveInfectiousDiag">
          确 定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
</script>

<script setup lang="ts">
import { PatientDiagnosisInfectiousDiseasesItemEditByInModel } from '@/services/PatientServiceProxies'
import { useAppStore } from '@/stores'

const { showAddinfections, formInfectiou } = defineProps({
  showAddinfections: {
    type: Boolean,
    default: false,
  },
  formInfectiou: PatientDiagnosisInfectiousDiseasesItemEditByInModel,
})
const emit = defineEmits(['closeAddInfections', 'saveInfectious'])
const formInfectious = ref<PatientDiagnosisInfectiousDiseasesItemEditByInModel>(new PatientDiagnosisInfectiousDiseasesItemEditByInModel())
const typeDiagnosis = ref([])
const diseaseNames = ref()
const { getDicDataByCode } = useAppStore()
watch(
  () => formInfectiou,
  (newVal) => {
    formInfectious.value = newVal
    typeDiagnosis.value = newVal?.type ? newVal?.type?.split(';') : [] // 传染病种类
    console.log('心智11111111', typeDiagnosis)
    changeInfectiousDiag(typeDiagnosis.value)
  },
  { immediate: true, deep: true },
)
const ruleForm = ref()
const hcvs = [
  '活动期',
  '恢复期',
  '携带者',
]
const hepatitisbs = [
  '活动期',
  '恢复期',
  '携带者',
]
const hivs = [
  '活动期',
  '既往感染',
]
const syphilises = [
  '活动期',
  '既往感染',
]
const tuberculosises = [
  '活动期',
  '恢复期',
  '携带者',
]

const rules = ref({})
function closed() {
  emit('closeAddInfections')
}
function saveInfectiousDiag() {
  ruleForm.value.validate((valid) => {
    if (valid) {
      emit('saveInfectious', formInfectious.value, diseaseNames.value)
    }
  })
}
/* 改变疾病种类 */
function changeInfectiousDiag(val) {
  if (!val?.includes('HCV')) {
    formInfectious.value.hcv = ''
  }
  if (!val?.includes('HBV')) {
    formInfectious.value.hepatitisb = ''
  }
  if (!val?.includes('HIV')) {
    formInfectious.value.hiv = ''
  }
  if (!val?.includes('SYPHILIS')) {
    formInfectious.value.syphilis = ''
  }
  if (!val?.includes('TUBERCULOSIS')) {
    formInfectious.value.tuberculosis = ''
  }
  if (!val?.includes('OTHER')) {
    formInfectious.value.otherInstructions = ''
  }
  formInfectious.value.type = val?.join(';')
  const diseaseTypes = []
  const diseaseName = []
  const optionsInfectiousDiag = getDicDataByCode('DIC.DIAGNOSIS.ID.TYPE')

  val?.forEach((selectItem) => {
    const data = optionsInfectiousDiag.find(item => item.value === selectItem)
    diseaseTypes.push(data)
  })
  diseaseTypes.forEach((i) => {
    const typeName = i.name
    diseaseName.push(typeName)
  })
  diseaseNames.value = diseaseName.join(';')
  // formInfectious.value.typeLabel = diseaseNames.value
}

onMounted(() => {

})
</script>

<style lang="less">

</style>
