const { Post, RecommendPost } = require('./mongo')
const { dbCode } = require('../logtool')
const config = require('../config.json')
const { PAGE_SIZE } = require('../common/tool')
const _ = require('lodash')

let PostModel
if (config.DATA_SOURCE == 'leancloud') {
  PostModel = require('../db/leancloud').PostModel
}
if (config.DATA_SOURCE == 'mongodb') {
  PostModel = require('../db/mongo').PostModel
}

/**
 * @param 一个要创建的文档的对象，包括标题，图像.....没有创建时间、修改时间与ID,那是这个方法要生成的
 * @returns 创建的文档的对象
 **/
const createPost = async NewPost => {
  let PostObject = NewPost
  let datenow = await Date.now()

  if (!PostObject.create_time) {
    PostObject.create_time = datenow
  }
  if (!PostObject.update_time) {
    PostObject.update_time = datenow
  }
  if (!PostObject.pid) {
    PostObject.pid = await require('../common/tool').genPid(PostObject)
  }
  let repost
  if (PostObject.is_recommend) {
    repost = await new PostModel.add(PostObject)
  }
  let newPost = await new PostModel()
  newPost
    .add(PostObject)
    .then(result => {
      dbCode(1008, result)
      return { status: [{ code: 1008, message: result }, repost] }
    })
    .catch(err => {
      dbCode(1000, err)
      return { status: [{ code: 1000, error: toString(err) }, repost] }
    })
}

/**
 * @param 一个要创建的文档的对象，包括标题，图像.....没有创建时间、修改时间与ID,那是这个方法要生成的
 * @returns 创建的文档的对象
 **/
const createRePost = async NewPost => {
  let PostObject = await _.omit(NewPost, ['content', 'is_recommend'])
  let newRePost = new RecommendPost(PostObject)
  newRePost
    .save()
    .then(result => {
      dbCode(1011, result)
      return { code: 1011, meaasge: result }
    })
    .catch(err => {
      dbCode(1004, err)
      return { code: 1004, error: err }
    })
}

/**
 * @param 与createPost一样
 * @returns 修改后的文档
 * **/
const editPost = async PostObject => {
  if (PostObject.is_recommend) {
    createRePost(PostObject)
  }
  if (!PostObject.is_recommend) {
    await RecommendPost.findOneAndDelete({ pid: PostObject.pid })
      .exec()
      .then(deleteRePost => {
        return { status: [{ code: 1012, message: deleteRePost }] }
      })
      .catch(err => {
        return { status: [{ code: 1005, error: err }] }
      })
  }
  await Post.findOne({ pid: PostObject.pid })
    .exec()
    .then(post => {
      post.title = PostObject.title
      post.update_time = Date.now()
      post.desc = PostObject.desc
      post.content = PostObject.content
      post.tag = PostObject.tag
      post.category = PostObject.category
      post.image = PostObject.image
      post.is_recommend = PostObject.is_recommend
      return post.save()
    })
    .then(updatedPost => {
      if (!updatedPost) {
        dbCode(1015, 'updatepost')
        return { status: [{ code: 1015 }] }
      } else {
        dbCode(1009)
        return { status: [{ code: 1009, message: updatedPost }] }
      }
    })
    .catch(err => {
      dbCode(1001, err)
      return { status: [{ code: 1001, error: err }] }
    })
}

/**
 * @param pid
 * @returns 删除的文章
 * **/
const deletePost = async pid => {
  if (isPostRecommend(pid)) {
    RecommendPost.findOneAndDelete({ pid: pid })
  }
  await Post.findOneAndDelete({ pid: pid })
    .exec()
    .then(deletedUser => {
      if (deletedUser) {
        dbCode(1010)
        return { status: [{ code: 1010, message: deletedUser }] }
      } else {
        dbCode(1015, 'deletepost')
        return { status: [{ code: 1015 }] }
      }
    })
    .catch(err => {
      dbCode(1002, err)
      return { status: [{ code: 1002, error: err }] }
    })
}

/**
 *
 * @param pid
 * @returns 找到的文章
 */
const findPost = async pid => {
  await Post.findOne({ pid: pid })
    .exec()
    .then(post => {
      post.status = [{ code: 1021 }]
      return post
    })
    .catch(err => {
      dbCode(1016, err)
      return { status: [{ code: 1016, error: err }] }
    })
}

/**
 *
 * @param pid
 * @returns 找到的文章基本信息
 */
const findPostCard = async pid => {
  await Post.findOne({ pid: pid })
    .exec()
    .then(post => {
      post = _.omit(post, ['content'])
      post.status = [{ code: 1013 }]
      return post
    })
    .catch(err => {
      dbCode(1006, err)
      return { status: [{ code: 1006, error: err }] }
    })
}

/**
 *
 * @param pid
 * @returns 找到的文章内容
 */
const findPostContent = async pid => {
  await Post.findOne({ pid: pid })
    .exec()
    .then(post => {
      let content = { content: post.content, status: [{ code: 1014 }] }
      return content
    })
    .catch(err => {
      dbCode(1007, err)
      return { status: [{ code: 1007, error: err }] }
    })
}

/**
 * @returns 推荐文章的列表
 */
const findRePostList = async () => {
  await Post.find({})
    .exec()
    .then(rePostList => {
      rePostList.status = [{ code: 1022 }]
      return rePostList
    })
    .error(err => {
      dbCode(1003, err)
      return { status: [{ code: 1003, error: err }] }
    })
}

/**
 * @returns 文章总数
 */
const getPostCount = async () => {
  await Post.countDocuments({})
    .then(postCount => {
      return { data: postCount, status: [{ code: 1024 }] }
    })
    .catch(err => {
      dbCode(1017, err)
      return { status: [{ code: 1017, error: err }] }
    })
}

/**
 *
 * @returns 总页数
 */
const getPages = async () => {
  return {
    data: Math.ceil(getPostCount() / PAGE_SIZE),
    status: [{ code: 1025 }]
  }
}

/**
 * @param 目标页数
 * @returns 去除了content的文章信息
 */
const findPostList = async targetPage => {
  let skipCount = (targetPage - 1) * PAGE_SIZE
  await Post.find({})
    .sort({ create_time: -1 }) // 按时间倒序排序
    .skip(skipCount)
    .limit(PAGE_SIZE)
    .exec()
    .then(articles => {
      return {
        data: {
          data: _.map(articles, obj => _.omit(obj, 'content')),
          status: [{ code: 1023 }]
        }
      }
    })
    .catch(err => {
      dbCode(1018, err)
      return { status: [{ code: 1018, error: err }] }
    })
}

/**
 * @param pid
 * @returns true重复，false不重复
 */
const isPidDuplicate = async pid => {
  if (Post.findOne({ pid })) {
    return true
  } else {
    return false
  }
}

const isPostRecommend = pid => {
  let repostlist = findRePostList()
  let isre
  repostlist.forEach(element => {
    if (pid == element.pid) {
      isre = true
    }
  })
  if (isre) {
    return true
  } else {
    return false
  }
}

exports.createPost = createPost
exports.createRePost = createRePost
exports.editPost = editPost
exports.deletePost = deletePost
exports.findPost = findPost
exports.findPostCard = findPostCard
exports.findPostContent = findPostContent
exports.findRePostList = findRePostList
exports.getPostCount = getPostCount
exports.getPages = getPages
exports.findPostList = findPostList
exports.isPidDuplicate = isPidDuplicate
