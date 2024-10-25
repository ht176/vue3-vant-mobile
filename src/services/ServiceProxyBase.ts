import httpSign from '@/utils/http.sign'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'
// import { checkUserLoginExpire } from '../utils/user'
// import { WeChatAuthServiceProxy } from './ServiceProxies'
interface AnyObject { [key: string]: any }

// 接口白名单
const urlGuardList = [
  '/api/Global/GetAllDataDictionary',
  '/api/Hospital/ReportHypertensionDrugInfo',
  '/api/WeChatAuth/FindMedicalUserByCode',
  '/api/Hospital/FindHospitalBasicList',
  '/api/WeChatAuth/BindMedicalStaffIdentity',
  '/api/WeChatAuth/RefreshToken',
]

export class ServiceProxyBase {
  protected async transformOptions(options: AxiosRequestConfig) {
    options.baseURL = import.meta.env.VITE_APP_API_BASE_URL as string
    // const guard: boolean = this.urlGuard(options.url as string)
    // const authInfo = { accessToken: '' }
    // const token = authInfo?.accessToken
    // if (checkUserLoginExpire(token)) {
    //   // 过期接口刷新token
    //   token = await this.refreshTokenWx()
    // }
    // 添加header
    options.headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${httpSign()}`,
    }
    return Promise.resolve(options)
  }

  protected transformResult(_url: string, response: AxiosResponse, processor: (response: AxiosResponse) => Promise<any>): Promise<any> {
    if (response.status === 401 || response.status === 403 || response.status === 302) {
      // this.refreshTokenWx();
      // Taro.showToast({
      //   title: '登录过期',
      //   icon: 'none',
      //   duration: 2000,
      // })
    }
    else if (response.status === 400) {
      const error = response.data?.error?.details
        ? response.data.error.details.replace('验证时发现以下错误.\n - 字段', '')
        : response.data.title
      console.error(error)

      // const msg = `请求异常${error ?? ''}`
      // Taro.showToast({
      //   title: msg,
      //   icon: 'none',
      //   duration: 2000,
      // })
    }
    else if (response.status >= 500) {
      const msg = `请求异常`
      console.log(msg)
      // Taro.showToast({
      //   title: msg,
      //   icon: 'none',
      //   duration: 2000,
      // })
    }

    const { code, message, data } = response.data
    if (code) {
      console.log(message)
      // Taro.showToast({
      //   title: message,
      //   icon: 'none',
      //   duration: 2000,
      // })
    }
    if (data) {
      this.transformKeys(data)
      // const lowerCasedData = this.transformKeys(data)
      // data = lowerCasedData
    }
    // setTimeout(() => {
    //   Taro.hideLoading()
    // }, 200)
    return processor(response)
  }

  // 判决接口是否需要拦截
  private urlGuard(url: string): boolean {
    if (urlGuardList.includes(url.replace(/\?.*/, ''))) {
      return true
    }
    return false
  }

  // private async refreshTokenWx() {
  //   const weChatAuthService = new WeChatAuthServiceProxy()
  //   const authInfo = Taro.getStorageSync('authInfo')
  //   const { data } = await weChatAuthService.refreshToken(authInfo.patientId, undefined)
  //   authInfo.accessToken = data
  //   Taro.setStorageSync('autnInfo', authInfo)
  //   return data
  // }
  /**
   * 接口返回的数据属性名改为小写
   * @param obj
   */
  private transformKeys(obj: AnyObject): void {
    if (Array.isArray(obj)) {
      obj.forEach(item => this.transformKeys(item)) // 递归处理数组中的每个元素
    }
    else if (obj !== null && typeof obj === 'object') {
      Object.keys(obj).forEach((key) => {
        const newKey = key.charAt(0).toLowerCase() + key.slice(1)
        if (newKey !== key) {
          obj[newKey] = obj[key] // 将值赋给新的键
          delete obj[key] // 删除旧的键
        }
        this.transformKeys(obj[newKey]) // 递归处理嵌套对象
      })
    }
  }
}
