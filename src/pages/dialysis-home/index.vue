<template>
  <div class="h-full flex flex-col">
    <div class="flex items-center justify-between bg-blue-900 px-4 py-1 text-xs text-white font-bold">
      <div>
        用户名：
      </div>
      <div class="flex items-center gap-3">
        <div>区域选择</div>
        <div>班次选择</div>
        <div>患者姓名</div>
        <div>更多筛选<van-icon name="filter-o" /></div>
        <div class="h-5 w-5 flex items-center justify-center rounded-6 bg-gray-200">
          <el-icon class="!text-xs" color="#909399">
            <CreditCard />
          </el-icon>
          <!-- <el-button class="h-4 w-4" size="small" type="info" :icon="CreditCard" circle plain @click="handlecard" /> -->
        </div>
      </div>
    </div>
    <div class="flex-1 overflow-auto p-2.5">
      <el-row :gutter="10">
        <el-col v-for="item in 100" :key="item" class="pb-2" :span="12">
          <div class="h-32 border border-solid bg-white">
            {{ item }}
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CreditCard } from '@element-plus/icons-vue'

// function handlecard() {

// }
</script>

<style scoped lang="less">
</style>

<route lang="json">
  {
    "name": "dialysis-home"
  }
</route>
