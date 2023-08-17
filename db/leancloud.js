const AV = require('leancloud-storage')
const config = require('../config.json')
const _ = require('lodash')

if (config.leancloud.masterKey && _.isNumber(config.leancloud.masterKey)) {
  AV.init({
    appId: config.leancloud.appId,
    appKey: config.leancloud.appKey,
    masterKey: config.leancloud.masterKey,
    serverURL: config.leancloud.serverURL
  })
}
AV.init({
  appId: config.leancloud.appId,
  appKey: config.leancloud.appKey,
  serverURL: config.leancloud.serverURL
})

const Post = AV.Object('Post')
const RePost = AV.Object('RePost')
const Tag = AV.Object('Tag')
const Category = AV.Object('Category')

class PostModel {
  constructor (tableName) {
    this.tableName = tableName
  }

  /**
   *
   * @param where 条件查找，例如{pid:xxx}
   * @param desc 排序的，例如{ create_time: -1 }就是按创建时间倒序排列，新的在前，旧的在后
   * @param limit 返回结果数量限制。如果为12就会返回12个结果
   * @param offset 跳过数据，如果为12就会跳过12个结果
   * @param field 返回结果的类型。[s,ss]会返回s和ss字段的数据。mongodb要求"s ss"这样的。这里会自动处理
   * @returns 查询的结果的数量
   */
  async select (where, desc, limit, offset, field) {
    let post = await new Post()
    if (where && typeof where === 'object') {
      for (const key in where) {
        if (Object.hasOwnProperty.call(where, key)) {
          await post.equalTo(key, where[key])
        }
      }
    }
    if (desc) {
      let andesc = await _.invert(desc)
      if (_.has(andesc, 1)) {
        await post.addDescending(andesc[1])
      } else {
        await post.addAscending(andesc[-1])
      }
    }
    if (limit) {
      await post.limit(limit)
    }
    if (offset) {
      await post.skip(offset)
    }
    if (field) {
      await post.select(field)
    }
    return post.find()
  }

  /**
   *
   * @param where 条件查找，例如{pid:xxx}
   * @param desc 排序的，例如{ create_time: -1 }就是按创建时间倒序排列，新的在前，旧的在后
   * @param limit 返回结果数量限制。如果为12就会返回12个结果
   * @param offset 跳过数据，如果为12就会跳过12个结果
   * @param field 返回结果的类型。[s,ss]会返回s和ss字段的数据。mongodb要求"s ss"这样的。这里会自动处理
   * @returns 查询的结果的数量
   */
  async count (where, desc, limit, offset, field) {
    let post = await new Post()
    if (where && typeof where === 'object') {
      for (const key in where) {
        if (Object.hasOwnProperty.call(where, key)) {
          await post.equalTo(key, where[key])
        }
      }
    }
    if (desc) {
      let andesc = await _.invert(desc)
      if (_.has(andesc, 1)) {
        await post.addDescending(andesc[1])
      } else {
        await post.addAscending(andesc[-1])
      }
    }
    if (limit) {
      await post.limit(limit)
    }
    if (offset) {
      await post.skip(offset)
    }
    if (field) {
      await post.select(field)
    }
    return post.count()
  }
  /**
   *
   * @param data 数据
   * @returns 保存的对象
   */
  async add (data) {
    let post = await new Post()
    await post.set('pid', data.pid)
    await post.set('title', data.title)
    await post.set('create_time', data.create_time)
    await post.set('update_time', data.update_time)
    await post.set('desc', data.desc)
    await post.set('content', data.content)
    await post.set('tag', data.tag)
    await post.set('category', data.category)
    await post.set('image', data.image)
    await post.set('is_recommend', data.is_recommend)
    return post.save()
  }
  /**
   *
   * @param where 条件查找，例如{pid:xxx}
   * @param data 数据
   * @returns 查询的结果的数量
   */
  async update (data, where) {
    let post = await new Post()
    let postoid
    await post.equalTo(where.keys[0], where.values[0])
    await post.select('objectId')
    await post.find().then(
      async posts => {
        postoid = await posts[0]['objectId']
      },
      err => {
        throw err
      }
    )
    post = await AV.Object.createWithoutData('Post', postoid)
    await post.set('pid', data.pid)
    await post.set('title', data.title)
    await post.set('create_time', data.create_time)
    await post.set('update_time', data.update_time)
    await post.set('desc', data.desc)
    await post.set('content', data.content)
    await post.set('tag', data.tag)
    await post.set('category', data.category)
    await post.set('image', data.image)
    await post.set('is_recommend', data.is_recommend)
    return post.save()
  }
  /**
   *
   * @param where 条件查找，例如{pid:xxx}
   */
  async delete (where) {
    let post = await new Post()
    let postoid
    await post.equalTo(where.keys[0], where.values[0])
    await post.select('objectId')
    await post.find().then(
      async posts => {
        postoid = await posts[0]['objectId']
      },
      err => {
        throw err
      }
    )
    post = await AV.Object.createWithoutData('Post', postoid)
    return post.destroy()
  }
}

class RePostModel {
  constructor (tableName) {
    this.tableName = tableName
  }
  /**
   *
   * @param where 条件查找，例如{pid:xxx}
   * @param desc 排序的，例如{ create_time: -1 }就是按创建时间倒序排列，新的在前，旧的在后
   * @param limit 返回结果数量限制。如果为12就会返回12个结果
   * @param offset 跳过数据，如果为12就会跳过12个结果
   * @param field 返回结果的类型。[s,ss]会返回s和ss字段的数据。mongodb要求"s ss"这样的。这里会自动处理
   * @returns 查询的结果
   */
  async select (where, desc, limit, offset, field) {
    let repost = await new RePost()
    if (where && typeof where === 'object') {
      for (const key in where) {
        if (Object.hasOwnProperty.call(where, key)) {
          await repost.equalTo(key, where[key])
        }
      }
    }
    if (desc) {
      let andesc = await _.invert(desc)
      if (_.has(andesc, 1)) {
        await repost.addDescending(andesc[1])
      } else {
        await repost.addAscending(andesc[-1])
      }
    }
    if (limit) {
      await repost.limit(limit)
    }
    if (offset) {
      await repost.skip(offset)
    }
    if (field) {
      await repost.select(field)
    }
    return repost.find()
  }
  /**
   *
   * @param where 条件查找，例如{pid:xxx}
   * @param desc 排序的，例如{ create_time: -1 }就是按创建时间倒序排列，新的在前，旧的在后
   * @param limit 返回结果数量限制。如果为12就会返回12个结果
   * @param offset 跳过数据，如果为12就会跳过12个结果
   * @param field 返回结果的类型。[s,ss]会返回s和ss字段的数据。mongodb要求"s ss"这样的。这里会自动处理
   * @returns 查询的结果的数量
   */
  async count (where, desc, limit, offset, field) {
    let repost = await new RePost()
    if (where && typeof where === 'object') {
      for (const key in where) {
        if (Object.hasOwnProperty.call(where, key)) {
          await repost.equalTo(key, where[key])
        }
      }
    }
    if (desc) {
      let andesc = await _.invert(desc)
      if (_.has(andesc, 1)) {
        await repost.addDescending(andesc[1])
      } else {
        await repost.addAscending(andesc[-1])
      }
    }
    if (limit) {
      await repost.limit(limit)
    }
    if (offset) {
      await repost.skip(offset)
    }
    if (field) {
      await repost.select(field)
    }
    return repost.count()
  }
  /**
   *
   * @param data 数据
   * @returns 保存的对象
   */
  async add (data) {
    let repost = await new RePost()
    await repost.set('pid', data.pid)
    await repost.set('title', data.title)
    await repost.set('create_time', data.create_time)
    await repost.set('update_time', data.update_time)
    await repost.set('desc', data.desc)
    await repost.set('tag', data.tag)
    await repost.set('category', data.category)
    await repost.set('image', data.image)
    return repost.save()
  }
  /**
   *
   * @param PostObject 数据
   * @param where 条件查找，例如{pid:xxx}
   */
  async update (data, where) {
    let post = await new RePost()
    let postoid
    await post.equalTo(where.keys[0], where.values[0])
    await post.select('objectId')
    await post.find().then(
      async posts => {
        postoid = await posts[0]['objectId']
      },
      err => {
        throw err
      }
    )
    post = await AV.Object.createWithoutData('RePost', postoid)
    await post.set('pid', data.pid)
    await post.set('title', data.title)
    await post.set('create_time', data.create_time)
    await post.set('update_time', data.update_time)
    await post.set('desc', data.desc)
    await post.set('tag', data.tag)
    await post.set('category', data.category)
    await post.set('image', data.image)
    return post.save()
  }
  /**
   *
   * @param where 条件查找，例如{pid:xxx}
   */
  async delete (where) {
    let post = await new RePost()
    let postoid
    await post.equalTo(where.keys[0], where.values[0])
    await post.select('objectId')
    await post.find().then(
      async posts => {
        postoid = await posts[0]['objectId']
      },
      err => {
        throw err
      }
    )
    post = await AV.Object.createWithoutData('RePost', postoid)
    return post.destroy()
  }
}

class TagModel {
  constructor (tableName) {
    this.tableName = tableName
  }

  /**
   *
   * @param where 条件查找，例如{pid:xxx}
   * @param desc 排序的，例如{ create_time: -1 }就是按创建时间倒序排列，新的在前，旧的在后
   * @param limit 返回结果数量限制。如果为12就会返回12个结果
   * @param offset 跳过数据，如果为12就会跳过12个结果
   * @param field 返回结果的类型。[s,ss]会返回s和ss字段的数据。mongodb要求"s ss"这样的。这里会自动处理
   * @returns 查询的结果的数量
   */
  async select (where, desc, limit, offset, field) {
    let tag = await new Tag()
    if (where && typeof where === 'object') {
      for (const key in where) {
        if (Object.hasOwnProperty.call(where, key)) {
          await tag.equalTo(key, where[key])
        }
      }
    }
    if (desc) {
      let andesc = await _.invert(desc)
      if (_.has(andesc, 1)) {
        await tag.addDescending(andesc[1])
      } else {
        await tag.addAscending(andesc[-1])
      }
    }
    if (limit) {
      await tag.limit(limit)
    }
    if (offset) {
      await tag.skip(offset)
    }
    if (field) {
      await tag.select(field)
    }
    return tag.find()
  }

  /**
   *
   * @param where 条件查找，例如{pid:xxx}
   * @param desc 排序的，例如{ create_time: -1 }就是按创建时间倒序排列，新的在前，旧的在后
   * @param limit 返回结果数量限制。如果为12就会返回12个结果
   * @param offset 跳过数据，如果为12就会跳过12个结果
   * @param field 返回结果的类型。[s,ss]会返回s和ss字段的数据。mongodb要求"s ss"这样的。这里会自动处理
   * @returns 查询的结果的数量
   */
  async count (where, desc, limit, offset, field) {
    let tag = await new Tag()
    if (where && typeof where === 'object') {
      for (const key in where) {
        if (Object.hasOwnProperty.call(where, key)) {
          await tag.equalTo(key, where[key])
        }
      }
    }
    if (desc) {
      let andesc = await _.invert(desc)
      if (_.has(andesc, 1)) {
        await tag.addDescending(andesc[1])
      } else {
        await tag.addAscending(andesc[-1])
      }
    }
    if (limit) {
      await tag.limit(limit)
    }
    if (offset) {
      await tag.skip(offset)
    }
    if (field) {
      await tag.select(field)
    }
    return tag.count()
  }
  /**
   *
   * @param data 数据
   * @returns 保存的对象
   */
  async add (data) {
    let tag = await new Tag()
    await tag.set('pid', data.id)
    await tag.set('name', data.name)
    await tag.set('create_time', data.create_time)
    return tag.save()
  }
  /**
   *
   * @param where 条件查找，例如{pid:xxx}
   * @param data 数据
   * @returns 查询的结果的数量
   */
  async update (data, where) {
    let tag = await new Tag()
    let tagoid
    await tag.equalTo(where.keys[0], where.values[0])
    await tag.select('objectId')
    await tag.find().then(
      async tags => {
        tagoid = await tags[0]['objectId']
      },
      err => {
        throw err
      }
    )
    tag = await AV.Object.createWithoutData('Tag', tagoid)
    await tag.set('id', data.id)
    await tag.set('name', data.name)
    await tag.set('create_time', data.create_time)
    return tag.save()
  }
  /**
   *
   * @param where 条件查找，例如{pid:xxx}
   */
  async delete (where) {
    let tag = await new Tag()
    let tagoid
    await tag.equalTo(where.keys[0], where.values[0])
    await tag.select('objectId')
    await tag.find().then(
      async tags => {
        tagoid = await tags[0]['objectId']
      },
      err => {
        throw err
      }
    )
    tag = await AV.Object.createWithoutData('Tag', tagoid)
    return tag.destroy()
  }
}

class CategoryModel {
  constructor (tableName) {
    this.tableName = tableName
  }

  /**
   *
   * @param where 条件查找，例如{pid:xxx}
   * @param desc 排序的，例如{ create_time: -1 }就是按创建时间倒序排列，新的在前，旧的在后
   * @param limit 返回结果数量限制。如果为12就会返回12个结果
   * @param offset 跳过数据，如果为12就会跳过12个结果
   * @param field 返回结果的类型。[s,ss]会返回s和ss字段的数据。mongodb要求"s ss"这样的。这里会自动处理
   * @returns 查询的结果的数量
   */
  async select (where, desc, limit, offset, field) {
    let category = await new Category()
    if (where && typeof where === 'object') {
      for (const key in where) {
        if (Object.hasOwnProperty.call(where, key)) {
          await category.equalTo(key, where[key])
        }
      }
    }
    if (desc) {
      let andesc = await _.invert(desc)
      if (_.has(andesc, 1)) {
        await category.addDescending(andesc[1])
      } else {
        await category.addAscending(andesc[-1])
      }
    }
    if (limit) {
      await category.limit(limit)
    }
    if (offset) {
      await category.skip(offset)
    }
    if (field) {
      await category.select(field)
    }
    return category.find()
  }

  /**
   *
   * @param where 条件查找，例如{pid:xxx}
   * @param desc 排序的，例如{ create_time: -1 }就是按创建时间倒序排列，新的在前，旧的在后
   * @param limit 返回结果数量限制。如果为12就会返回12个结果
   * @param offset 跳过数据，如果为12就会跳过12个结果
   * @param field 返回结果的类型。[s,ss]会返回s和ss字段的数据。mongodb要求"s ss"这样的。这里会自动处理
   * @returns 查询的结果的数量
   */
  async count (where, desc, limit, offset, field) {
    let category = await new Category()
    if (where && typeof where === 'object') {
      for (const key in where) {
        if (Object.hasOwnProperty.call(where, key)) {
          await category.equalTo(key, where[key])
        }
      }
    }
    if (desc) {
      let andesc = await _.invert(desc)
      if (_.has(andesc, 1)) {
        await category.addDescending(andesc[1])
      } else {
        await category.addAscending(andesc[-1])
      }
    }
    if (limit) {
      await category.limit(limit)
    }
    if (offset) {
      await category.skip(offset)
    }
    if (field) {
      await category.select(field)
    }
    return category.count()
  }
  /**
   *
   * @param data 数据
   * @returns 保存的对象
   */
  async add (data) {
    let category = await new Category()
    await category.set('id', data.id)
    await category.set('name', data.name)
    await category.set('create_time', data.create_time)
    return category.save()
  }
  /**
   *
   * @param where 条件查找，例如{pid:xxx}
   * @param data 数据
   * @returns 查询的结果的数量
   */
  async update (data, where) {
    let category = await new Category()
    let categoryoid
    await category.equalTo(where.keys[0], where.values[0])
    await category.select('objectId')
    await category.find().then(
      async categorys => {
        categoryoid = await categorys[0]['objectId']
      },
      err => {
        throw err
      }
    )
    category = await AV.Object.createWithoutData('Category', categoryoid)
    await category.set('id', data.id)
    await category.set('name', data.name)
    await category.set('create_time', data.create_time)
    return category.save()
  }
  /**
   *
   * @param where 条件查找，例如{pid:xxx}
   */
  async delete (where) {
    let category = await new Category()
    let categoryoid
    await category.equalTo(where.keys[0], where.values[0])
    await category.select('objectId')
    await category.find().then(
      async categorys => {
        categoryoid = await categorys[0]['objectId']
      },
      err => {
        throw err
      }
    )
    category = await AV.Object.createWithoutData('Category', categoryoid)
    return category.destroy()
  }
}

exports.PostModel = PostModel
exports.RePostModel = RePostModel
exports.TagModel = TagModel
exports.CategoryModel = CategoryModel
