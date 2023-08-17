const { Post, RecommendPost, Category, Tag } = require('../mongo/mongo')
const _ = require('lodash')

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
   * @returns 查询的结果
   */
  async select (where, desc, limit, offset, field) {
    let query = await Post.find(where)
    if (field) {
      let selectd = ''
      let lastel = await _.last(field)
      for (let i = 0; i < field.length; i++) {
        let element = field[i]
        if (element != lastel) {
          element = element + ' '
        }
        selectd = selectd + element
      }
      query = await query.select(selectd)
    }
    if (desc) {
      query = await query.sort(desc)
    }
    if (limit) {
      query = await query.limit(limit)
    }
    if (offset) {
      query = await query.skip(offset)
    }
    return await query
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
    let query = await Post.countDocuments(where).exec()
    if (field) {
      let selectd = ''
      let lastel = await _.last(field)
      for (let i = 0; i < field.length; i++) {
        let element = field[i]
        if (element != lastel) {
          element = element + ' '
        }
        selectd = selectd + element
      }
      query = await query.select(selectd)
    }
    if (desc) {
      query = await query.sort(desc)
    }
    if (limit) {
      query = await query.limit(limit)
    }
    if (offset) {
      query = await query.skip(offset)
    }
    return await query.countDocuments()
  }
  /**
   *
   * @param data 数据
   * @returns 保存的对象
   */
  async add (data) {
    let post = new Post(data)
    return await post.save()
  }
  /**
   *
   * @param PostObject 数据
   * @param where 条件查找，例如{pid:xxx}
   */
  async update (where, PostObject) {
    const post = await Post.findOne(where).exec()
    if (!post) {
      throw new Error('Post not found')
    }
    post.pid = PostObject.pid
    post.title = PostObject.title
    post.update_time = Date.now()
    post.desc = PostObject.desc
    post.content = PostObject.content
    post.tag = PostObject.tag
    post.category = PostObject.category
    post.image = PostObject.image
    post.is_recommend = PostObject.is_recommend

    return await post.save()
  }

  /**
   *
   * @param where 条件查找，例如{pid:xxx}
   */
  async delete (where) {
    return await Post.findOneAndDelete(where).exec()
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
    let query = await RecommendPost.find(where)

    if (field) {
      let selectd = ''
      let lastel = await _.last(field)
      for (let i = 0; i < field.length; i++) {
        let element = field[i]
        if (element != lastel) {
          element = element + ' '
        }
        selectd = selectd + element
      }
      query = await query.select(selectd)
    }
    if (desc) {
      query = await query.sort(desc)
    }
    if (limit) {
      query = await query.limit(limit)
    }
    if (offset) {
      query = await query.skip(offset)
    }
    return query.exec()
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
    let query = await RecommendPost.countDocuments(where)
    if (field) {
      let selectd = ''
      let lastel = await _.last(field)
      for (let i = 0; i < field.length; i++) {
        let element = field[i]
        if (element != lastel) {
          element = element + ' '
        }
        selectd = selectd + element
      }
      query = await query.select(selectd)
    }
    if (desc) {
      query = await query.sort(desc)
    }
    if (limit) {
      query = await query.limit(limit)
    }
    if (offset) {
      query = await query.skip(offset)
    }
    return await query.exec()
  }
  /**
   *
   * @param data 数据
   * @returns 保存的对象
   */
  async add (data) {
    let post = await new RecommendPost(data)
    return await post.save()
  }
  /**
   *
   * @param PostObject 数据
   * @param where 条件查找，例如{pid:xxx}
   */
  async update (PostObject, where) {
    await RecommendPost.findOne(where)
      .exec()
      .then(async post => {
        post.pid = await PostObject.pid
        post.title = await PostObject.title
        post.update_time = await Date.now()
        post.desc = await PostObject.desc
        post.content = await PostObject.content
        post.tag = await PostObject.tag
        post.category = await PostObject.category
        post.image = await PostObject.image
        post.is_recommend = await PostObject.is_recommend
        return await post.save()
      })
  }

  /**
   *
   * @param where 条件查找，例如{pid:xxx}
   */
  async delete (where) {
    return await RecommendPost.findOneAndDelete(where).exec()
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
   * @returns 查询的结果
   */
  async select (where, desc, limit, offset, field) {
    let query = await Category.find(where)

    if (field) {
      let selectd = ''
      let lastel = await _.last(field)
      for (let i = 0; i < field.length; i++) {
        let element = field[i]
        if (element != lastel) {
          element = element + ' '
        }
        selectd = selectd + element
      }
      query = await query.select(selectd)
    }
    if (desc) {
      query = await query.sort(desc)
    }
    if (limit) {
      query = await query.limit(limit)
    }
    if (offset) {
      query = await query.skip(offset)
    }
    return query.exec()
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
    let query = await Category.countDocuments(where).exec()
    if (field) {
      let selectd = ''
      let lastel = await _.last(field)
      for (let i = 0; i < field.length; i++) {
        let element = field[i]
        if (element != lastel) {
          element = element + ' '
        }
        selectd = selectd + element
      }
      query = await query.select(selectd)
    }
    if (desc) {
      query = await query.sort(desc)
    }
    if (limit) {
      query = await query.limit(limit)
    }
    if (offset) {
      query = await query.skip(offset)
    }
    return query.exec()
  }

  /**
   *
   * @param data 数据
   * @returns 保存的对象
   */
  async add (data) {
    let category = await new Category(data)
    return await category.save()
  }

  /**
   *
   * @param PostObject 数据
   * @param where 条件查找，例如{pid:xxx}
   */
  async update (CategoryObject, where) {
    await Category.findOne(where)
      .exec()
      .then(async category => {
        category.id = await CategoryObject.pid
        category.title = await CategoryObject.title
        return await category.save()
      })
  }

  /**
   *
   * @param where 条件查找，例如{pid:xxx}
   */
  async delete (where) {
    return await Category.findOneAndDelete(where).exec()
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
   * @returns 查询的结果
   */
  async select (where, desc, limit, offset, field) {
    let query = await Tag.find(where)

    if (field) {
      let selectd = ''
      let lastel = await _.last(field)
      for (let i = 0; i < field.length; i++) {
        let element = field[i]
        if (element != lastel) {
          element = element + ' '
        }
        selectd = selectd + element
      }
      query = await query.select(selectd)
    }
    if (desc) {
      query = await query.sort(desc)
    }
    if (limit) {
      query = await query.limit(limit)
    }
    if (offset) {
      query = await query.skip(offset)
    }
    return query.exec()
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
    let query = await Tag.countDocuments(where).exec()
    if (field) {
      let selectd = ''
      let lastel = await _.last(field)
      for (let i = 0; i < field.length; i++) {
        let element = field[i]
        if (element != lastel) {
          element = element + ' '
        }
        selectd = selectd + element
      }
      query = await query.select(selectd)
    }
    if (desc) {
      query = await query.sort(desc)
    }
    if (limit) {
      query = await query.limit(limit)
    }
    if (offset) {
      query = await query.skip(offset)
    }
    return query.exec()
  }

  /**
   *
   * @param data 数据
   * @returns 保存的对象
   */
  async add (data) {
    let tag = await new Tag(data)
    return await tag.save()
  }

  /**
   *
   * @param PostObject 数据
   * @param where 条件查找，例如{pid:xxx}
   */
  async update (TagObject, where) {
    await Tag.findOne(where)
      .exec()
      .then(async tag => {
        tag.id = await TagObject.pid
        tag.title = await TagObject.title
        return await tag.save()
      })
  }

  /**
   *
   * @param where 条件查找，例如{pid:xxx}
   */
  async delete (where) {
    return await Tag.findOneAndDelete(where).exec()
  }
}

exports.PostModel = PostModel
exports.RePostModel = RePostModel
exports.CategoryModel = CategoryModel
exports.TagModel = TagModel
