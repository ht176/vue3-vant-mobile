import { defineStore } from 'pinia'
import { clearToken, getToken, setToken } from '@/utils/auth'
import type { LoginViewModel } from '@/services/ServiceProxies'
import { TokenServiceProxy } from '@/services/ServiceProxies'

const tokenServiceProxy = new TokenServiceProxy()

export const useUserStore = defineStore('user', () => {
  let userInfo = getToken()
  function setUserInfo() {
    userInfo = getToken()
  }
  const login = async (loginForm: LoginViewModel) => {
    try {
      const res = await tokenServiceProxy.tokenPOST(loginForm)
      if (res.success) {
        const { sid: id, uid, uname: name, hid, sysUserAreas, expity } = res.data
        const token = { id, hid, uid, name, sysUserAreas, insertTime: new Date(), expireInterval: expity * 60 * 60 }
        setToken(token)
      }
      setUserInfo()
      return res
    }
    catch (error) {
      clearToken()
      throw error
    }
  }

  const logout = async () => {
    try {
      // await userLogout()
    }
    finally {
      clearToken()
    }
  }

  return {
    userInfo,
    setUserInfo,
    login,
    logout,
  }
}, {
  persist: true,
})

export default useUserStore
