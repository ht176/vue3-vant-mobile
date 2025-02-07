interface Option {
  group: number | string
  value: string
  fraction?: number
}

interface Props {
  label: string
  value: string
}

interface Options {
  props: Props
  inline: boolean
  remote: boolean
  options: Option[]
  fontSize: string
  required: boolean
  className: string[]
  fontColor: string
  showLabel: boolean
  remoteFunc: string
  defaultValue: any[]
  remoteOptions: any[]
  sysFormMapKeyId: string
  sysFormMapCommonId: string
  [key: string]: any
}

interface Show {
  depend: string
  expression: string
  dependValue: string
}

interface Rule {
  // 根据规则定义扩展此类型
  [key: string]: any
}

interface ListItem {
  key: string
  icon: string
  name: string
  show: Show
  type: string
  model: string
  rules: Rule[]
  options: Options
  [key: string]: any
}

interface Config {
  size: '' | 'small' | 'default' | 'large'
  labelWidth: number
  labelPosition: 'top' | 'left' | 'right'
}

interface DataStructure {
  list?: ListItem[]
  config?: Config
}
