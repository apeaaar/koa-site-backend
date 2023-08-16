const crypto = require('crypto')

const { isPidDuplicate } = require('../mongo/post')

// pid位数
const PID_DIGITS = 6
// 文章列表页面每一页的文章数
const { PAGE_SIZE } = require('../config.json')

const getStrHeadNum = (str, num) => {
  let pattern = RegExp(`/d{${num}}/`)
  const match = str.match(pattern)
  if (match) {
    let firstSixDigits = match[0]
    return firstSixDigits
  } else {
    throw new Error('没有前6位数字')
  }
}

const genPid = async PostObject => {
  let pid = genRandomPid(PostObject)
  while (isPidDuplicate(pid)) {
    pid = await genRandomPid(PostObject)
    let existingPost = await isPidDuplicate(pid)
    if (!existingPost) {
      return pid // 如果不存在重复的 pid，返回生成的 pid
    }
  }
  return pid
}

const genRandomPid = async PostObject => {
  let title = PostObject.title
  let create_time = PostObject.create_time
  let randompart = Math.floor(Math.random() * 1000000)

  const hash = crypto.createHash('sha512')
  hash.update(title + String(create_time) + String(randompart))
  let hashedValue = hash.digest('hex')

  return getStrHeadNum(hashedValue, PID_DIGITS)
}

exports.getStrHeadNum = getStrHeadNum
exports.genPid = genPid
exports.PID_DIGITS = PID_DIGITS
exports.PAGE_SIZE = PAGE_SIZE
