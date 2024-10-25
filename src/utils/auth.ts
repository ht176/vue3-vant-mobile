import { TOKEN_STORAGE_NAME } from './constant'
import dayjs from 'dayjs'
import { clearLocalStorage, getLocalStorage, setLocalStorage } from './storage'

/**
 * 获取会话
 * @returns {null} - 返回token
 */
function getToken() {
  const temp = getLocalStorage(TOKEN_STORAGE_NAME)
  if (temp == null) {
    return null
  }
  try {
    const token = JSON.parse(temp)
    const { insertTime, expireInterval } = token
    if (dayjs(insertTime).valueOf() + expireInterval * 1000 >= dayjs().valueOf()) {
      return token
    }
    return null
  }
  // eslint-disable-next-line unused-imports/no-unused-vars
  catch (e) {
    return null
  }
}
/**
 * 保存会话
 * @param token
 */
function setToken(token) {
  // saveSessionStorage(TOKEN_STORAGE_NAME, JSON.stringify(token))
  setLocalStorage(TOKEN_STORAGE_NAME, JSON.stringify(token))
}
/**
 * 清除会话
 */
function clearToken() {
  // clearSessionStorage(TOKEN_STORAGE_NAME)
  clearLocalStorage(TOKEN_STORAGE_NAME)
}

export { getToken, setToken, clearToken }
