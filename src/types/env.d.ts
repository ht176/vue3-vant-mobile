/// <reference types="vite/client" />
import type { SysFieldItemView } from '@/services/SysServiceProxies'

declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<Record<string, never>, Record<string, never>, any>
  export default component
}

declare global {
  /** 今日就诊卡片状态颜色 */
  interface ColorObject {
    fontColor?: string
    bgColor?: string
  }
  /** Token */
  interface Token {
    id: string | undefined
    hid: string | undefined
    uid: string | undefined
    name: string | undefined
    sysUserAreas: SysHospitalAreaView[] | undefined
    insertTime: Date
    expireInterval: number
  }
  /** 流程自定义字段 */
  interface CustomSysFieldItemView extends SysFieldItemView {
    label?: string
    placeholder?: string
  }
}
