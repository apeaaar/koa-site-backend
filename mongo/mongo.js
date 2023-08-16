const mongoose = require('mongoose')
const config = require('../config.json')
const console = require('console')
const { dbCode } = require('../logtool')
mongoose.connect(config.mongoConnectString, {}).then(() => {
  console.log('成功连接mongodb')
  dbCode(1019)
})

const PostSchema = mongoose.Schema({
  title: String,
  pid: Number,
  create_time: Number,
  update_time: Number,
  desc: String,
  content: String,
  tag: [{ name: String, id: Number }],
  category: { name: String, id: Number },
  image: String,
  is_recommend: Boolean
})

const RecommendPostSchema = mongoose.Schema({
  title: String,
  pid: Number,
  create_time: Number,
  update_time: Number,
  desc: String,
  tag: [{ name: String, id: Number }],
  category: { name: String, id: Number },
  image: String
})

const TagSchema = mongoose.Schema({
  id: Number,
  name: String,
  create_time: Number
})

const CategorySchema = mongoose.Schema({
  id: Number,
  name: String,
  create_time: Number
})

const Post = mongoose.model('Post', PostSchema)

const RecommendPost = mongoose.model('RecommendPost', RecommendPostSchema)

const Tag = mongoose.model('Tag', TagSchema)

const Category = mongoose.model('Category', CategorySchema)

exports.Post = Post
exports.RecommendPost = RecommendPost
exports.Tag = Tag
exports.Category = Category
