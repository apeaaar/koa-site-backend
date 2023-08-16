const logger = require('./logger')

const errorCode = [
  1000, 1001, 1003, 1003, 1004, 1005, 1006, 1007, 1016, 1017, 1018, 1020
]
const infoCode = [1008, 1009, 1010, 1011, 1012, 1013, 1014, 1015]

const dbCode = async (code, message) => {
  if (message) {
    message = await toString(message)
    message = `Message:${message}`
  } else {
    message = ''
  }
  if (errorCode.includes(code)) {
    logger.error(`Database:Error:${code}${message}`)
  }
  if (infoCode.includes(code)) {
    logger.info(`Database:Info:${code}${message}`)
  }
  return { code: code, message: message }
}

exports.dbCode = dbCode
