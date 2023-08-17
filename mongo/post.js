const { Post, RecommendPost } = require('./mongo')
const { dbCode } = require('../logtool')
const config = require('../config.json')
const { PAGE_SIZE } = require('../common/tool')
const _ = require('lodash')

let PostModel
let RePostModel
if (config.DATA_SOURCE == 'leancloud') {
  PostModel = require('../db/leancloud').PostModel
  RePostModel = require('../db/leancloud').RePostModel
}
if (config.DATA_SOURCE == 'mongodb') {
  PostModel = require('../db/mongo').PostModel
  RePostModel = require('../db/mongo').RePostModel
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
    repost = await createRePost(PostObject)
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
  let newRePost = RePostModel()
  newRePost
    .add(PostObject)
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
  let lastPostObject = findPost(PostObject.pid)
  if (lastPostObject.is_recommend == false && PostObject.is_recommend == true) {
    await createRePost(PostObject)
  }
  if (lastPostObject.is_recommend == true && PostObject.is_recommend == false) {
    await deleteRePost(PostObject.pid)
  }
  await PostModel.update(PostObject, { pid: PostObject.pid })
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
    deleteRePost(pid)
  }
  await PostModel.delete({ pid: pid })
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
 * @param pid
 * @return 删除的推荐文章
 */
const deleteRePost = async pid => {
  await RePostModel.delete({ pid: pid })
    .then(data => {
      return data
    })
    .catch(err => {
      dbCode(1026, err)
      return { status: [{ code: 1026, error: err }] }
    })
}

/**
 *
 * @param pid
 * @returns 找到的文章
 */
const findPost = async pid => {
  await PostModel.select({ pid: pid })
    .then(post => {
      return { data: post, status: [{ code: 1021 }] }
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
  await PostModel.select({ pid: pid }, undefined, undefined, undefined, [
    'title',
    'pid',
    'create_time',
    'update_time',
    'tag',
    'category',
    'image',
    'desc',
    'is_recommend'
  ])
    .then(post => {
      return { data: post, status: [{ code: 1013 }] }
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
  await PostModel.select({ pid: pid }, undefined, undefined, undefined, [
    'content'
  ])
    .exec()
    .then(post => {
      return { data: post[0].content, status: [{ code: 1014 }] }
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
  await PostModel.select({})
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
  await PostModel.count({})
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
  await Post.select({}, { create_time: -1 }, PAGE_SIZE, skipCount)
    // .sort({ create_time: -1 }) // 按时间倒序排序
    // .skip(skipCount)
    // .limit(PAGE_SIZE)
    // .exec()
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
  if (
    (() => {
      Post.select({ pid }).then(data => {
        return isDataAru(data)
      })
    })()
  ) {
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

const isDataAru = data => {
  if (!data[0]) {
    return false
  }
  return true
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
