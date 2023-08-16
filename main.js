const koa = require('koa')

const config = require('./config.json')
const logger = require('koa-logger')
const router = require('./router/router')
const bodyParser = require('koa-bodyparser')
const cors = require('koa-cors')

const app = new koa()

// register middleware
// log
app.use(
  logger((str, args) => {
    return `${args.status}: ${args.date}: ${args.userAgent}: ${args.url}`
  })
)
// router
app.use(router.routes())
app.use(router.allowedMethods())
// cors
app.use(
  cors({
    origin: function (ctx) {
      //设置允许来自指定域名请求
      const whiteList = require('./config.json').cors //可跨域白名单
      let url = ctx.header.referer.substr(0, ctx.header.referer.length - 1)
      if (whiteList.includes(url)) {
        return url //注意，这里域名末尾不能带/，否则不成功，所以在之前我把/通过substr干掉了
      }
      return 'http://localhost:3000' //默认允许本地请求3000端口可跨域
    },
    maxAge: 5, //指定本次预检请求的有效期，单位为秒。
    credentials: true, //是否允许发送Cookie
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], //设置所允许的HTTP请求方法
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'], //设置服务器支持的所有头信息字段
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'] //设置获取其他自定义字段
  })
)
// bodyparser
app.use(bodyParser())

app.listen(5001)

module.exports = app
