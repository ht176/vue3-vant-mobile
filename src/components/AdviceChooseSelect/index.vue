<template>
  <div @click.stop="handleClick">
    <el-select :model-value="roomItemListId" placeholder="请选择医嘱" :readonly="true" class="pointer-events-none">
      <template #label="{ label }">
        <template v-if="selecRoomItem">
          <span>{{ label }}</span>
          <span>&nbsp;{{ selecRoomItem.specLabel }}</span>
        </template>
        <template v-else>
          <span class="text-red">药品已停用，请重新选择</span>
        </template>
      </template>
      <el-option v-for="item in tableData" :key="item.id" :label="item.name" :value="item.id" />
    </el-select>
    <el-dialog v-model="dialogVisible" title="选择医嘱" width="80%" append-to-body top="7vh">
      <div class="custom-advice-dialog-content-div">
        <el-tabs v-model="activeName">
          <el-tab-pane label="内瘘针" name="fistulaNeedle" />
          <el-tab-pane label="药品" name="drug" />
          <el-tab-pane label="血路管" name="bloodConduit" />
          <el-tab-pane label="项目" name="project" />
          <el-tab-pane label="耗材" name="consumable" />
        </el-tabs>
        <div class="flex-1 overflow-auto">
          <el-collapse v-if="activeName === 'drug'" v-model="activeDrugName">
            <el-collapse-item v-for="item in drugTableDataList" :key="item.typeCode" :title="item.typeName" :name="item.typeCode">
              <el-table :data="item.children" border @row-click="handleRowClick">
                <el-table-column prop="name" label="名称" min-width="240" />
                <el-table-column prop="unitLabel" label="单位" width="120" />
                <el-table-column prop="sellingPrice" label="单价" width="120" />
              </el-table>
            </el-collapse-item>
          </el-collapse>
          <el-table v-else :data="tableData" border @row-click="handleRowClick">
            <el-table-column prop="name" label="名称" min-width="240" />
            <el-table-column prop="unitLabel" label="单位" width="120" />
            <el-table-column prop="sellingPrice" label="单价" width="120" />
          </el-table>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import type { RoomItemFullView } from '@/services/RoomItemListServiceProxies'
import { useAppStore } from '@/stores'

const props = defineProps({
  modelValue: { type: String, required: true },
  /** 项目类型（药品、耗材、项目、组合） */
  adviceType: { type: String as PropType<'DRUG' | 'CONSUMABLE' | 'NURSING' | 'GROUP'>, default: 'DRUG' },
})

const emit = defineEmits(['update:modelValue', 'change'])

const roomItemListId = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
  },
})

const { drugList, consumableList, projectList } = useAppStore()

const dialogVisible = ref(false)
/** tabs选中值 */
const activeName = ref()
/** 点击打开选择弹窗 */
function handleClick() {
  if (!activeName.value) {
    activeName.value = 'fistulaNeedle'
  }
  dialogVisible.value = true
}
const tabList = [
  { label: '内瘘针', name: 'fistulaNeedle', code: 'ROOM.ITEM.CONSUMABLE.NLZ' },
  { label: '药品', name: 'drug', code: '' },
  { label: '血路管', name: 'bloodConduit', code: 'ROOM.ITEM.CONSUMABLE.XLG' },
  { label: '项目', name: 'project', code: '' },
  { label: '耗材', name: 'consumable', code: '' },
]
/** 医嘱表格数据 */
const tableData = computed<RoomItemFullView[]>(() => {
  let array = []
  /** 弹窗未开启 */
  const type = dialogVisible.value ? activeName.value : props.adviceType
  switch (type) {
    case 'drug':
    case 'DRUG':
      array = drugList
      break
    case 'project':
    case 'NURSING':
      array = projectList
      break
    case 'consumable':
    case 'CONSUMABLE':
      array = consumableList
      break
    case 'GROUP':
      array = [...drugList, ...projectList, ...consumableList]
      break
    default:
      array = consumableList.filter(x => x.typeCode === tabList.find(x => x.name === activeName.value)?.code)
      break
  }
  return array
})
/** 药品分组数据 */
const drugTableDataList = computed(() => {
  const array = drugList.reduce((acc, item) => {
    const existingGroup = acc.find(group => group.typeCode === item.typeCode)
    if (existingGroup) {
    // 如果已存在该类别，直接推入 children 数组
      existingGroup.children.push(item)
    }
    else {
    // 否则创建新组并初始化 children
      acc.push({
        typeName: item.typeName,
        typeCode: item.typeCode,
        children: [item],
      })
    }
    return acc
  }, [])
  return array
})
const activeDrugName = ref()
function handleRowClick(row: RoomItemFullView) {
  dialogVisible.value = false
  emit('change', row)
}

const selecRoomItem = computed(() => {
  return tableData.value.find(x => x.id === roomItemListId.value)
})
watch(selecRoomItem, (newValue) => {
  if (!newValue && roomItemListId.value) {
    roomItemListId.value = '0'
  }
}, { immediate: true })
</script>

<style lang="less" scoped>
.custom-advice-dialog-content-div {
  height: 75vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>
