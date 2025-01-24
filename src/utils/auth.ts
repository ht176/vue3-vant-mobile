import { TOKEN_STORAGE_NAME } from './constant'
import dayjs from 'dayjs'
import { useLocalStorage } from '@vueuse/core'

const token = useLocalStorage(TOKEN_STORAGE_NAME, '')
/**
 * 获取会话
 * @returns {Token} - 返回token
 */
function getToken(): Token {
  if (token.value) {
    const val: Token = JSON.parse(token.value)
    const { insertTime, expireInterval } = val
    if (dayjs(insertTime).valueOf() + expireInterval * 1000 >= dayjs().valueOf()) {
      return val
    }
    return null
  }
  return null
}

function setToken(newToken: Token) {
  token.value = JSON.stringify(newToken)
}
/** 删除Token */
function clearToken() {
  token.value = null
}

export { getToken, setToken, clearToken }
