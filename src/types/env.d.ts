/// <reference types="vite/client" />
import type { CureDaView, PatientDaLongtermView, PatientDaTemporaryView } from '@/services/CureServiceProxies'
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
    /** 主键id */
    id: string | undefined
    /** 院区id */
    hid: string | undefined
    /** 用户id */
    uid: string | undefined
    /** 用户名称 */
    name: string | undefined
    sysUserAreas: SysHospitalAreaView[] | undefined
    insertTime: Date
    expireInterval: number
  }
  /** 流程节点 */
  type DialysisStepType = 'Signin' | 'DialysisEvaluation' | 'MakePrescription' | 'ConfirmPrescription' | 'BeforeDialysisEvaluation' | 'OperateComputer' | 'CrossCheck' | 'Monitoring' | 'OffAfter' | 'Disinfect' | 'AfterDialysisEvaluation' | 'AfterSummary'
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
  // Inject the provided values
  interface SysFieldProperty {
    (field: string, typeCode: string): CustomSysFieldItemView | null
  }
  /** 长期医嘱 */
  interface CustomPatientDaLongtermView extends PatientDaLongtermView {
    edit?: boolean
    merge?: number
  }
  /** 临时医嘱 */
  interface CustomPatientDaTemporaryView extends PatientDaTemporaryView {
    edit?: boolean
    merge?: number
  }
  /** 透析医嘱 */
  interface CustomCureDaView extends CureDaView {
    edit?: boolean
    merge?: number
  }
}
