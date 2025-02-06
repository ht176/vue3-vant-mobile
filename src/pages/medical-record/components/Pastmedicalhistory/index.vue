<template>
  <div class="p-4">
    <van-row>
      <van-col :span="24">
        <div class="flex justify-between pt-4">
          <span>既往病史</span>
          <el-button-group>
            <el-button type="primary" size="small" @click="saveForm(ruleFormRef)">
              保存
            </el-button>
          </el-button-group>
        </div>
      </van-col>
    </van-row>
    <van-row class="mt-4">
      <van-col :span="24">
        <el-form ref="ruleFormRef" :model="form" label-width="330px" class="demo-form" :rules="rules">
          <el-form-item label="有无既往疾病史：" required prop="isPmh" size="small">
            <el-radio-group v-model="form.isPmh" @change="form.dhaa = ''">
              <el-radio v-for="past in pastDisease" :key="past.id" :label="past.value">
                {{ past.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-show="form.isPmh === 1">
            <el-form-item label="系统疾病史或者异常：" required prop="isPmh" size="small">
              <Dictionary v-model="form.dhaa" :dic-code="DIC_PATIENT_DHAA" type="checkbox" />
            </el-form-item>
          </div>
          <el-form-item label="有无既往肾脏替代治疗史：">
            <el-radio-group v-model="form.isRrt" @change="form.rrtd = ''">
              <el-radio v-for="past in pastDisease" :key="past.id" :label="past.value">
                {{ past.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-show="form.isRrt === 1" class="form-checkbox">
            <el-form-item label="既往肾脏替代治疗史详情：" required prop="isPmh" size="small">
              <Dictionary v-model="form.rrtd" :dic-code="DIC_PATIENT_RRTD" type="checkbox" />
            </el-form-item>
          </div>
          <el-form-item />
        </el-form>
      </van-col>
    </van-row>
  </div>
</template>

<script setup lang="ts">
import { DIC_PATIENT_DHAA, DIC_PATIENT_RRTD } from '@/utils/constant'
import type { PatientPmhViewModel } from '@/services/PatientServiceProxies'
import { PatientPmhServiceProxy, PatientPmhView, PatientView } from '@/services/PatientServiceProxies'
import type { FormInstance, FormRules } from 'element-plus'
import { showNotify } from 'vant'

const { patient } = defineProps({
  patient: PatientView,
})
onMounted(() => {
  getPatientPmh()
})

const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules<PatientPmhViewModel>>({
  isPmh: [
    { required: true, message: '请选择有无既往病史', trigger: ['change', 'blur'] },
  ],
})
const pastDisease = [
  {
    id: '1',
    label: '有',
    value: 1,
  },
  {
    id: '2',
    label: '无',
    value: 0,
  },
]
const loading = ref(false)

const form = ref<PatientPmhView>(new PatientPmhView())
const patientPmhServiceProxy = new PatientPmhServiceProxy()

async function getPatientPmh() {
  loading.value = true
  const filter = {
    pageIndex: 1,
    pageSize: 1000,
    PatientId: {
      value: patient.id,
      type: '=',
    },
  }
  const { success, data, message } = await patientPmhServiceProxy.filterGET34(JSON.stringify(filter))
  if (success) {
    if (data.length) {
      form.value.id = data[0].id
      form.value.patientId = data[0].patientId
      form.value.isPmh = data[0].isPmh
      form.value.dhaa = data[0].dhaa
      form.value.isRrt = data[0].isRrt
      form.value.rrtd = data[0].rrtd
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
async function saveForm(formEl: FormInstance | undefined) {
  if (!formEl)
    return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      loading.value = true
      const data = Object.assign({}, form.value)
      const { success, message } = !data.id ? await patientPmhServiceProxy.patientPmhPOST2(data) : await patientPmhServiceProxy.patientPmhPOST(data.id, data)
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
