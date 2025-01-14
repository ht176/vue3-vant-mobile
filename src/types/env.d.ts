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
  /** 生命体征异常 */
  interface AbnormalInfo {
    type: 'sbp' | 'dbp' | 'ufg' | 'pulse' | 'temp'
    message: string
  }
  /** 预脱计算入参 */
  interface CalcUfgModel {
    /** 透前体重 */
    beforeWeight: number
    /** 干体重 */
    bestWeight: number
    /** 偏移调整 */
    deductionWeight: string | number
    /** 偏移调整单位 */
    deductionWeightUnit: string
    /** 预脱单位 */
    ufgUnit: string
    /** 上次透后 */
    lastAfterWeight: number
    /** 上次偏移调整 */
    lastDeductionWeight: string | number
  }
}
