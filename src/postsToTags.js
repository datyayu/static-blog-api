  // Map posts data to tags
module.exports = function postTags (posts) {
  return posts.reduce((obj, post) => {
    const postTags = post.tags
      .split(',')
      .map(tag => tag.trim())

    postTags.forEach(tag => {
      if (!obj[tag])
        obj[tag] = { id: tag, posts: []}

      obj[tag].posts.push(post)
    })

    return obj
  }, {})
}
