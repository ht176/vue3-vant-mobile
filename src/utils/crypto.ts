import { APP_KEY } from '@/utils/constant'
import * as CryptoJS from 'crypto-js'

/**
 * MD5 加密方法
 * @param input
 * @returns {string} | lowercase
 */
export function md5(input) {
  return CryptoJS.MD5(input).toString().toLowerCase()
}

/**
 * 3DES 加密方法
 * @param input
 * @returns {string} | lowercase
 */
export function encrypt(input) {
  const encrypted = CryptoJS.TripleDES.encrypt(
    input,
    CryptoJS.enc.Base64.parse(APP_KEY),
    {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    },
  )
  return CryptoJS.enc.Base64.parse(encrypted.toString()).toString().toLowerCase()
}

/**
 * 3DES 解密方法
 * @param input
 * @returns {string} - 解密后的字符串
 */
export function decrypt(input) {
  const decrypted = CryptoJS.TripleDES.decrypt(
    {
      ciphertext: CryptoJS.enc.Hex.parse(input.toString()),
    },
    CryptoJS.enc.Base64.parse(APP_KEY),
    {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    },
  )
  return decrypted.toString(CryptoJS.enc.Utf8)
}

/**
 * HmacSHA256 加密方法
 * @param input
 * @returns {string} | lowercase
 */
export function HmacSHA256encrypt(input) {
  const encrypted = CryptoJS.HmacSHA256(
    input,
    APP_KEY,
  )
  return encrypted
}

/**
 * HashCode进行Basc64编码
 * @param hashcode
 * @returns {string} | lowercase
 */
export function HashCodeBase64(hashcode) {
  const encrypted = CryptoJS.enc.Base64.stringify(hashcode)
  return encrypted
}
