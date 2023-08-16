const post = require('../mongo/post')
const {
  createPost,
  createRePost,
  editPost,
  deletePost,
  findPost,
  findPostCard,
  findPostContent,
  findRePostList,
  getPostCount,
  getPages,
  findPostList
} = require('../mongo/post')

const basicInfo = async ctx => {
  ctx.body = findPostCard(ctx.params.pid)
}

const postContent = async ctx => {
  ctx.body = findPostContent(ctx.params.pid)
}

const recommendPost = async ctx => {
  ctx.body = findRePostList()
}

const listPostByPage = async ctx => {
  ctx.body = findPostList(ctx.params.page)
}

const getPagesCount = async ctx => {
  ctx.body = getPages()
}

const PostCount = async ctx => {
  ctx.body = getPostCount()
}

const createNewPost = async ctx => {
  let PostObject = ctx.request.body
  ctx.body = createPost(PostObject)
}

const editAPost = async ctx => {
  let PostObject = ctx.request.body
  ctx.body = editPost(PostObject)
}

const deleteAPost = async ctx => {
  let pid = ctx.params.pid
  ctx.body = deletePost(pid)
}

exports.basicInfo = basicInfo
exports.postContent = postContent
exports.recommendPost = recommendPost
exports.listPostByPage = listPostByPage
exports.getPagesCount = getPagesCount
exports.PostCount = PostCount
exports.createNewPost = createNewPost
exports.editAPost = editAPost
exports.deleteAPost = deleteAPost
