const Router = require('koa-router')
const postrouter = require('./post')

const router = new Router()

// post router
router.get('/post/card/:pid', postrouter.basicInfo)
router.get('/post/content/:pid', postrouter.postContent)
router.get('/post/recommend', postrouter.recommendPost)
router.get('/post/:page', postrouter.listPostByPage)
router.get('/post/pages/', postrouter.getPagesCount)
router.get('/post/posts', postrouter.PostCount)
router.post('/post/create/', postrouter.createNewPost)
router.post('/post/edit/', postrouter.editAPost)
router.post('/post/delete/:pid', postrouter.deleteAPost)

module.exports = router
