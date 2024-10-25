import dayjs from 'dayjs'
import { APP_ID } from './constant'
import { HashCodeBase64, HmacSHA256encrypt } from './crypto'
import { getToken } from './auth'

/**
 * 生成6位随机字符串
 * @returns {string} - 返回随机字符串
 */
function getNonce() {
  const seeds = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  const selected = []
  while (selected.length < 6) {
    selected.push(seeds[Math.floor(Math.random() * seeds.length)])
  }
  return selected.join('')
}

export default function httpSign() {
  const token = getToken()
  const header = btoa(JSON.stringify({
    typ: 'JWT',
    alg: 'HS256',
  }))

  const payload = btoa(JSON.stringify({
    iss: APP_ID,
    iat: dayjs().valueOf(),
    jti: getNonce(),
    token: (token && token.id) ? token.id : '',
  }))
  const sign = HashCodeBase64(HmacSHA256encrypt(`${header}.${payload}`))
  return `${header}.${payload}.${sign}`
}
