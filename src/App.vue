<script setup lang="ts">
import useAppStore from '@/stores/modules/app'
import useRouteCache from '@/stores/modules/routeCache'
import useAutoThemeSwitcher from '@/hooks/useAutoThemeSwitcher'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

const appStore = useAppStore()

const { initializeThemeSwitcher } = useAutoThemeSwitcher(appStore)
const themeVars = reactive({
  buttonPrimaryBackground: '#1989fa',
  buttonPrimaryBorderColor: '#1989fa',
  fieldLabelWidth: '2em',
  fieldIconSize: '16px',
  cellFontSize: '--van-font-size-md',
  cellVerticalPadding: '10px',
  cellHorizontalPadding: '15px',
  cellLineHeight: '24px',
})

const keepAliveRouteNames = computed(() => {
  return useRouteCache().routeCaches as string[]
})

onMounted(() => {
  initializeThemeSwitcher()
})
</script>

<template>
  <el-config-provider :locale="zhCn">
    <VanConfigProvider class="h-full" :theme-vars="themeVars">
      <section class="app-wrapper">
        <router-view v-slot="{ Component, route }">
          <keep-alive :include="keepAliveRouteNames">
            <component :is="Component" :key="route.name" />
          </keep-alive>
        </router-view>
      </section>
    </VanConfigProvider>
  </el-config-provider>
</template>

<style scoped>
.app-wrapper {
  width: 100%;
  position: relative;
  padding: 16px;
}
</style>
