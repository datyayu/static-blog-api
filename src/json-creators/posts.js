const fs = require('fs')
const path = require('path')


module.exports = function createPostsJSON (posts, dir) {
  console.log('\n[GENERATING POSTS]')

  if (!fs.existsSync(dir))
    fs.mkdirSync(dir)

  posts.forEach(post => {
    const apiFileName = post.url
    const apiFilePath = path.resolve(dir, `${apiFileName}.json`)
    const jsonContent = JSON.stringify(post, null, 4)

    fs.writeFileSync(apiFilePath, jsonContent, 'utf-8')
    console.log(`posts/${apiFileName}.json`)
  })
}
