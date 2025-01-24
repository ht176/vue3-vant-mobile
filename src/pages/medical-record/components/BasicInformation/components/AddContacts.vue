<template>
  <el-dialog :model-value="dialogVisiable" position="bottom" style="width:70vw;" @close="close(ruleFormRef)">
    <el-form ref="ruleFormRef" :model="formData" :rules="rules" label-width="150px">
      <el-row :gutter="20">
        <el-col :span="11" :offset="1">
          <el-form-item label="与患者关系：" prop="relation">
            <el-select v-model="formData.relation" placeholder="请选择与患者关系">
              <el-option label="家属" value="家属" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="联系人姓名：" prop="name">
            <el-input v-model="formData.name" placeholder="请输入联系人姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="1">
          <el-form-item label="移动电话：" prop="phone">
            <el-input v-model="formData.phone" placeholder="请输入移动电话" />
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="座机：" prop="tel">
            <el-input v-model="formData.tel" placeholder="请输入座机" />
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="1">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="formData.email" placeholder="请输入邮箱" />
          </el-form-item>
        </el-col>
        <el-col :span="22" :offset="1">
          <el-form-item label="地址：" prop="address">
            <el-col :span="8" style="padding-left:0px">
              <el-cascader v-model="mailingAddress" style="width:100%" :options="chinaregion" expand-trigger="hover" />
            </el-col>
            <el-col :span="16" style="padding-left:0px;padding-right:0px">
              <el-input v-model="formData.address" placeholder="请输入地址" />
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="22" :offset="1">
          <el-form-item label="备注：" prop="remark">
            <el-input v-model="formData.remark" placeholder="请输入备注" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" :disabled="loading" @click="saveContacts(ruleFormRef)">
          确 定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import chinaregion from '@/assets/json/Region.json'
import type { FormInstance, FormRules } from 'element-plus'
import { showNotify } from 'vant'
import type { PatientContactsViewModel } from '@/services/PatientServiceProxies'
import { PatientContactsServiceProxy, PatientView } from '@/services/PatientServiceProxies'

const { modelValue, patient, dialogVisiable, editId } = defineProps({
  dialogVisiable: { type: Boolean, default: true },
  patient: PatientView,
  editId: { type: String, default: '' },
  modelValue: {
    type: Object as PropType<PatientContactsViewModel>,
    required: true,
  },
})
const emit = defineEmits(['closeDialog', 'updateTable', 'update:modelValue'])
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules<PatientContactsViewModel>>({
  relation: [
    {
      required: true,
      message: '请选择与患者关系',
      trigger: 'change',
    },
  ],
  name: [
    {
      required: true,
      message: '请输入联系人姓名',
      trigger: 'change',
    },
    { max: 16, message: '不能超过16个字符', trigger: 'change' },
  ],
  phone: [{ max: 16, message: '不能超过16个字符', trigger: 'change' }],
  tel: [{ max: 16, message: '不能超过16个字符', trigger: 'change' }],
  email: [{ max: 32, message: '不能超过32个字符', trigger: 'change' }],
  address: [{ max: 128, message: '不能超过128个字符', trigger: 'change' }],
  remark: [{ max: 512, message: '不能超过512个字符', trigger: 'change' }],
})
const mailingAddress = ref([])
const loading = ref(false)
const patientContactsServiceProxy = new PatientContactsServiceProxy()
const formData = computed({
  get: () => {
    return modelValue
  },
  set: () => {
    // emit('update:modelValue', value)
  },
})
function close(formEl: FormInstance | undefined) {
  emit('closeDialog')
  formEl.resetFields()
}
async function saveContacts(formEl: FormInstance | undefined) {
  if (!formEl)
    return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      loading.value = true
      formData.value.patientId = patient.id
      if (mailingAddress.value.length > 0) {
        formData.value.province = this.mailingAddress[0]
        formData.value.city = this.mailingAddress[1]
        formData.value.area = this.mailingAddress[2]
      }
      const { success } = !editId ? await patientContactsServiceProxy.patientContactsPOST2(formData.value, undefined) : await patientContactsServiceProxy.patientContactsPOST(editId, formData.value)
      if (success) {
        emit('updateTable')
        close(ruleFormRef.value)
        showNotify({ type: 'success', message: '保存成功' })
        loading.value = false
      }
    }
    else {
      console.log('error submit!', fields)
    }
  })
}
onMounted(() => {
  formData.value.relation = '家属'
})
</script>
