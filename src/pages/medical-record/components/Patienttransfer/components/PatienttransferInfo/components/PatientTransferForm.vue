<template>
  <el-dialog title="转归信息" :model-value="dialogVisiable" position="bottom" style="width:70vw;" @close="close(ruleFormRef)">
    <el-form ref="ruleFormRef" :model="formData" :rules="rules" label-width="150px">
      <el-row :gutter="20">
        <el-col :span="20" :offset="2">
          <el-form-item label="转归日期：" prop="date">
            <el-date-picker v-model="formData.date as unknown as Date" :disabled="!!formData.id" type="date" placeholder="请选择开立日期" format="YYYY-MM-DD" />
          </el-form-item>
        </el-col>
        <el-col :span="20" :offset="2">
          <el-form-item label="转归类型：" prop="Type">
            <el-radio-group v-model="formData.type" :disabled="!!formData.id" @change="typeChange">
              <el-radio v-for="item in transTypelist" :key="item.value" :disabled="item.value === 'IN' ? disabled : disabled ? false : true" :label="item.value" :value="item.value" :style="{ display: 'inline-block' }">
                {{ item.customLabel ? item.customLabel : item.name }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-if="formData.type === 'OUT'" :span="20" :offset="2">
          <el-form-item label="机构所在地：" prop="outLocation">
            <el-cascader v-model="formData.outLocation" style="width:100%" :options="chinaregion" expand-trigger="hover" />
          </el-form-item>
        </el-col>
        <el-col v-if="formData.type === 'OUT'" :span="20" :offset="2">
          <el-form-item label="透析机构名称：" prop="outCause">
            <el-input v-model="formData.outCause" />
          </el-form-item>
        </el-col>
        <el-col v-if="formData.type === 'QUIT'" :span="20" :offset="2">
          <el-form-item label="退出原因：" prop="quitCause">
            <Dictionary v-model="formData.quitCause" :dic-code="DIC_PROGNOSIS_QUIT_CAUSE" type="radio" @change="quitCauseChange" />
          </el-form-item>
        </el-col>
        <el-col v-if="formData.quitCause && formData.quitCause.indexOf('OTHER') !== -1" :span="20" :offset="2">
          <!-- 其他退出原因 -->
          <el-form-item label="其他退出原因：" prop="quitCauseOther">
            <el-input v-model="formData.quitCauseOther" style="width:100%" />
          </el-form-item>
        </el-col>
        <el-col v-if="formData.quitCause === 'DIE'" :span="20" :offset="2">
          pp{{ formData.quitDieCause }}
          <el-form-item label="主要死亡原因：" prop="quitDieCause">
            <Dictionary v-model="formData.quitDieCause" :dic-code="DIC_PROGNOSIS_QUIT_DIE_CAUSE" type="select" :is-multiple="true" @change="quitCauseChange" />
          </el-form-item>
        </el-col>
        <el-col :span="20" :offset="2" style="color:red">
          <span style="display:inline-block;width:150px;text-align:right">注：</span>转出、退出时该患者不可存在未完成流程及医嘱
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" :disabled="loading" @click="saveForm(ruleFormRef)">
          确 定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessageBox } from 'element-plus'
import { showNotify } from 'vant'
import { DIC_PROGNOSIS_QUIT_CAUSE, DIC_PROGNOSIS_QUIT_DIE_CAUSE, DIC_PROGNOSIS_TYPE } from '@/utils/constant'
import chinaregion from '@/assets/json/Region.json'
import type { PatientPrognosisView, PatientPrognosisViewModel } from '@/services/PatientServiceProxies'
import { PatientPrognosisServiceProxy, PatientView } from '@/services/PatientServiceProxies'
import { useAppStore } from '@/stores'
import type { SysDicItemChildView } from '@/services/SysServiceProxies'

interface CustomSysDicItemChildView extends SysDicItemChildView {
  label?: string
}

const { modelValue, dialogVisiable } = defineProps({
  dialogVisiable: { type: Boolean, default: true },
  disabled: { type: Boolean, default: true },
  patient: PatientView,
  modelValue: {
    type: Object as PropType<PatientPrognosisView>,
    required: true,
  },
})
const emit = defineEmits(['closeDialog', 'updateTable', 'update:modelValue'])
const { getDicDataByCode } = useAppStore()
const formData = computed({
  get: () => {
    return modelValue
  },
  set: () => {
    // emit('update:modelValue', value)
  },
})
const transTypelist = computed<CustomSysDicItemChildView[]>(() => {
  return getDicDataByCode(DIC_PROGNOSIS_TYPE).map((x) => {
    return {
      ...x,
      label: x.name,
    }
  })
})
const ruleFormRef = ref<FormInstance>()
function validateQuitCause(_rule, _value, callback) {
  nextTick(() => {
    if (formData.value.quitCause) {
      callback()
    }
    else {
      callback(new Error('请选择退出原因'))
    }
  })
}
function validateQuitDieCause(_rule, _value, callback) {
  nextTick(() => {
    if (formData.value.quitDieCause.length) {
      callback()
    }
    else {
      callback(new Error('请选择死亡原因'))
    }
  })
}
const rules = reactive<FormRules<PatientPrognosisViewModel>>({
  date: [
    { required: true, message: '请选择转归日期', trigger: 'change' },
  ],
  type: [
    {
      required: true,
      message: '请选择转归状态',
      trigger: 'change',
    },
  ],
  outCause: [
    { required: true, message: '请输入透析机构名称', trigger: 'change' },
  ],
  outLocation: [
    { required: true, message: '请选择机构所在地', trigger: 'change' },
  ],
  quitCause: [{
    required: true,
    validator: validateQuitCause,
    trigger: ['change'],
  }],
  quitDieCause: [{
    required: true,
    validator: validateQuitDieCause,
    trigger: ['change'],
  }],
})
const loading = ref(false)
const patientPrognosisServiceProxy = new PatientPrognosisServiceProxy()
// 当前状态变更
function typeChange() {
  formData.value.outLocation = ''
  formData.value.outCause = ''
  formData.value.quitCause = ''
  formData.value.quitDieCause = [] as any
  formData.value.outCauseOther = ''
  formData.value.quitCauseOther = ''
  formData.value.quitDieCauseOther = ''
  formData.value.quitDieCauseCveOther = ''
  formData.value.quitDieCauseMacceOther = ''
  formData.value.quitDieCauseInfectionOther = ''
}
// 退出原因变更
function quitCauseChange() {
  formData.value.quitDieCause = [] as any
  formData.value.quitCauseOther = ''
  formData.value.quitDieCauseOther = ''
  formData.value.quitDieCauseCveOther = ''
  formData.value.quitDieCauseMacceOther = ''
  formData.value.quitDieCauseInfectionOther = ''
}
function close(formEl: FormInstance | undefined) {
  emit('closeDialog')
  formEl.resetFields()
}
async function saveForm(formEl: FormInstance | undefined) {
  if (!formEl)
    return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      loading.value = true
      const data = Object.assign({}, formData.value)
      if (data.quitCause && !data.quitCause.includes('OTHER')) {
        data.quitCauseOther = ''
      }
      data.outLocation = data.outLocation ? (data.outLocation as any).join(';') : ''
      data.quitDieCause = data.quitDieCause ? (data.quitDieCause as any).join(';') : ''
      if (data.type !== 'IN') {
        const typeName = transTypelist.value.filter(item => item.value === data.type)[0]
        ElMessageBox.confirm(`患者${typeName?.customLabel ? typeName?.customLabel : typeName?.name}后，` + '本系统对该患者数据归档,只保留查看权限，无编辑权限', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          submit(data)
        })
      }
      else {
        submit(data)
      }
      loading.value = false
    }
    else {
      console.log('error submit!', fields)
    }
  })
}
async function submit(data) {
  const { success, message } = !data.id ? await patientPrognosisServiceProxy.patientPrognosisPOST2(data) : await patientPrognosisServiceProxy.patientPrognosisPOST(data.id, data)
  if (success) {
    emit('updateTable')
    close(ruleFormRef.value)
    showNotify({ type: 'success', message: '保存成功' })
  }
  else {
    showNotify({ type: 'danger', message })
  }
}
onMounted(() => {
})
</script>
