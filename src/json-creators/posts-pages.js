const fs = require('fs')
const path = require('path')

const PAGE_SIZE = 10


module.exports = function createPostsPagesJSON (posts, dir) {
  console.log('\n[GENERATING POSTS PAGES]')

  const pagesDir = path.resolve(dir, 'pages')
  const totalPages = Math.ceil(posts.length / PAGE_SIZE)

  if (!fs.existsSync(pagesDir))
    fs.mkdirSync(pagesDir)

  for (let page = 0; page < totalPages; page++) {
    const lowerBound = page * PAGE_SIZE
    const upperBound = (page + 1) * PAGE_SIZE
    const pageChunck = posts.slice(lowerBound, upperBound)

    const apiFileName = `${page+1}.json`
    const apiFilePath = path.resolve(pagesDir, apiFileName)
    const fileContent = { page: page+1, totalPosts: posts.length, posts: pageChunck }
    const jsonContent = JSON.stringify(fileContent, null, 4)

    fs.writeFileSync(apiFilePath, jsonContent, 'utf-8')
    console.log(apiFileName)
  }
}
