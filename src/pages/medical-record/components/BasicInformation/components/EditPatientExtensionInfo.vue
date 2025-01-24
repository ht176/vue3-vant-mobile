<template>
  <el-dialog :model-value="extInfoVisiable" position="bottom" style="width:70vw;height:70vh" @close="close">
    <div class="text-align-left">
      <div class="mb-4">
        <van-row>
          <van-col :span="20">
            <span>扩展信息管理</span>
          </van-col>
        </van-row>
      </div>
      <div style="border-top:1px solid #dcdfe6">
        <el-row :gutter="30" style="margin:1vw;font-size:14px">
          <el-col :span="9">
            名称
          </el-col>
          <el-col :span="9">
            值
          </el-col>
          <el-col :span="6">
            操作
          </el-col>
        </el-row>
        <el-row v-for="(item, index) in editData" :key="index" :gutter="20" style="margin:1vw">
          <el-col :span="9">
            <el-input v-model="item.name" :maxlength="32" :show-word-limit="true" />
          </el-col>
          <el-col :span="9">
            <el-input v-model="item.value" :maxlength="64" :show-word-limit="true" />
          </el-col>
          <el-col :span="6">
            <el-button type="primary" :disabled="loading" size="small" @click="saveItem(item)">
              保存
            </el-button>
            <el-button :disabled="loading" size="small" @click="deleteItem(item, index)">
              删除
            </el-button>
          </el-col>
        </el-row>
        <el-row style="margin-top:10px;text-align:center">
          <el-col :span="24">
            <el-button
              type="" :icon="Plus" style="width:30%;border:1px dashed" :disabled="loading" @click="addNewItem"
            />
          </el-col>
        </el-row>
      </div>
    </div>
  </el-dialog>
</template>

<script>
</script>

<script setup lang="ts">
import { showNotify } from 'vant'
import { Plus } from '@element-plus/icons-vue'
import { PatientExtraServiceProxy, type PatientExtraView, PatientView } from '@/services/PatientServiceProxies'

const { modelValue, patient, extInfoVisiable } = defineProps({
  extInfoVisiable: { type: Boolean, default: false },
  patient: PatientView,
  modelValue: {
    type: Object as PropType<PatientExtraView[]>,
    required: true,
  },
})
const emit = defineEmits(['update:modelValue', 'closeDialog'])
const loading = ref(false)
const patientExtraServiceProxy = new PatientExtraServiceProxy()
const editData = computed({
  get: () => {
    return modelValue
  },
  set: (value) => {
    emit('update:modelValue', value)
  },
})
function close() {
  emit('closeDialog')
}
async function saveItem(item: PatientExtraView) {
  if (item.name && item.value) {
    if (item.id) { // Id存在更新数据
      loading.value = true
      const itemObj = {
        name: item.name,
        value: item.value,
      } as unknown as PatientExtraView
      const result = await patientExtraServiceProxy.patientExtraPOST(item.id, itemObj)
      loading.value = false
      if (result.success) {
        showNotify({ type: 'success', message: '保存成功' })
        emit('update:modelValue', editData)
      }
      else {
        showNotify({ type: 'danger', message: '保存失败' })
      }
    }
    else { // Id不存在则新增数据
      loading.value = true
      const itemObj = {
        name: item.name,
        value: item.value,
      } as unknown as PatientExtraView
      const result = await patientExtraServiceProxy.patientPOST4(patient.id, itemObj)
      loading.value = false
      if (result.success) {
        showNotify({ type: 'success', message: '保存成功' })
        emit('update:modelValue', editData)
      }
      else {
        showNotify({ type: 'danger', message: '保存失败' })
      }
    }
  }
  else {
    showNotify({ type: 'danger', message: '名称和值为必填项！' })
  }
}
function addNewItem() {
  const empty = editData.value.filter(i => i.id === '')
  if (empty.length > 0) {
    showNotify({ type: 'danger', message: '请先保存所有扩展信息' })
    return
  }
  const itemObj = {
    name: '',
    value: '',
  } as unknown as PatientExtraView
  editData.value.push(itemObj)
}

async function deleteItem(item: PatientExtraView, index) {
  if (item.id) {
    loading.value = true
    const result = await patientExtraServiceProxy.delete18(item.id)
    loading.value = false
    if (result.success) {
      editData.value.splice(index, 1)
      showNotify({ type: 'success', message: '删除成功' })
    }
    else {
      showNotify({ type: 'danger', message: '删除失败' })
    }
  }
  else {
    editData.value.splice(index, 1)
  }
}
</script>
