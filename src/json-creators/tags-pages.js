const fs = require('fs')
const path = require('path')

const PAGE_SIZE = 5


function createPagesJSONForTag (posts, tagname, dir) {
  const totalPages = Math.ceil(posts.length / PAGE_SIZE)

  for (let page = 0; page < totalPages; page++) {
    const lowerBound = page * PAGE_SIZE
    const upperBound = (page + 1) * PAGE_SIZE
    const pageChunck = posts.slice(lowerBound, upperBound)

    const apiFileName = `${tagname}-${page+1}.json`
    const apiFilePath = path.resolve(dir, apiFileName)
    const fileContent = {
      id: tagname,
      page: page+1,
      totalPosts: posts.length,
      posts: pageChunck
    }
    const jsonContent = JSON.stringify(fileContent, null, 4)

    fs.writeFileSync(apiFilePath, jsonContent, 'utf-8')
    console.log(apiFileName)
  }
}


module.exports = function createTagsPagesJSON (tags, dir) {
  console.log('\n[GENERATING TAGS PAGES]')
  const pagesDir = path.resolve(dir, 'pages')

  if (!fs.existsSync(pagesDir))
    fs.mkdirSync(pagesDir)

  Object.keys(tags)
    .forEach(key => {
      const tag = tags[key]
      createPagesJSONForTag(tag.posts, tag.id, pagesDir)
    })
}
