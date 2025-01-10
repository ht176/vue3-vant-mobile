/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  // eslint-disable-next-line ts/no-empty-object-type
  const component: DefineComponent<{}, {}, any>
  export default component
}

/** 今日就诊卡片状态颜色 */
interface ColorObject {
  fontColor?: string
  bgColor?: string
}
interface Token {
  id: string | undefined
  hid: string | undefined
  uid: string | undefined
  name: string | undefined
  sysUserAreas: SysHospitalAreaView[] | undefined
  insertTime: Date
  expireInterval: number
}
