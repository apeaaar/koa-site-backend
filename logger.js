const { createLogger, format, transports } = require('winston')

module.exports = createLogger({
  format: format.combine(
    format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
    format.align(),
    format.printf(i => `${i.level}: ${[i.timestamp]}: ${i.message}`),
    format.colorize({
      colors: {
        info: 'blue',
        warn: 'yellow',
        error: 'red'
      }
    })
  ),
  transports: [
    new transports.Console(
      format.combine(
        format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
        format.align(),
        format.printf(i => `${i.level}: ${[i.timestamp]}: ${i.message}`),
        format.colorize({
          colors: {
            info: 'blue',
            warn: 'yellow',
            error: 'red'
          }
        })
      )
    ),
    new transports.File({
      filename: 'logs/server.log',
      level: 'info',
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.align(),
        format.printf(
          info => `${info.level}: ${[info.timestamp]}: ${info.message}`
        )
      )
    })
  ]
})
