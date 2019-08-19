// 加密解密函数
const CryptoJS = require('crypto-js') // 引用AES源码js

const key = CryptoJS.enc.Utf8.parse('xzkingdee@123-=.')
const iv = CryptoJS.enc.Utf8.parse('1mEri31N-=,.!iog')

/**
 * 解密方法
 * @return {string}
 */
export function Decrypt (word) {
  let encryptedHexStr = CryptoJS.enc.Hex.parse(word)
  let src = CryptoJS.enc.Base64.stringify(encryptedHexStr)
  let decrypt = CryptoJS.AES.decrypt(src, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 })
  let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
  return decryptedStr.toString()
}

/**
 * 加密方法
 * @return {string}
 */
export function Encrypt (word) {
  let src = CryptoJS.enc.Utf8.parse(word)
  let encrypted = CryptoJS.AES.encrypt(src, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 })
  return encrypted.ciphertext.toString().toUpperCase()
}
