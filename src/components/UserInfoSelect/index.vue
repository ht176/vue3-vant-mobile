<template>
  <el-select v-model="value" v-bind="$attrs">
    <el-option v-for="item in userOptionList" :key="item.id" :label="item.sysUserName" :value="item.id">
      <div class="flex gap-2">
        <div>姓名：{{ item.sysUserName }}</div>
        <div>别名：{{ item.sysUserName2 }}</div>
        <div>工号：{{ item.sysUserJobNumber }}</div>
      </div>
    </el-option>
  </el-select>
</template>

<script setup lang="ts">
import { useAppStore, useUserStore } from '@/stores'

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  userType: {
    type: String as PropType<'nurse' | 'doctor' | 'user'>,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const { userInfo } = useUserStore()

const { nurseInfoList, doctorInfoList, userInfoList } = useAppStore()
const value = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})
const userOptionList = computed(() => {
  switch (props.userType) {
    case 'nurse':
      return nurseInfoList
    case 'doctor':
      return doctorInfoList
    case 'user':
      return userInfoList
    default:
      return userInfoList
  }
})
onMounted(() => {
  setDefaultUser(props.modelValue)
})
watch(() => props.modelValue, (newVal) => {
  setDefaultUser(newVal)
})
/** 空值默认赋值当前登录用户 */
function setDefaultUser(val) {
  if (!val) {
    emit('update:modelValue', userInfo.uid)
  }
}
</script>

<style scoped>

</style>
