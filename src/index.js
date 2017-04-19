const fs = require('fs')
const path = require('path')
const mdToObject = require('./mdToObject')

/* PATHS */
const baseDir = path.resolve(__dirname, '..')
const apiDir = path.resolve(baseDir, 'api')
const apiPostsDir = path.resolve(apiDir, 'posts')
const apiTagsDir = path.resolve(apiDir, 'tags')
const markdownDir = path.resolve(baseDir, 'markdown')
const markdownPostsDir = path.resolve(markdownDir, 'posts')


// Create dirs.
if (!fs.existsSync(apiDir))
  fs.mkdirSync(apiDir)

if (!fs.existsSync(apiPostsDir))
  fs.mkdirSync(apiPostsDir)

if (!fs.existsSync(apiTagsDir))
  fs.mkdirSync(apiTagsDir)


/* Get filenames */
const postsMdFiles = fs.readdirSync(markdownPostsDir)

const postsData = postsMdFiles.map(filename => {
  const filePath = path.resolve(markdownPostsDir, filename)
  const fileDataObject = mdToObject(filePath)

  if (!fileDataObject.url || !fileDataObject.title) {
    throw new Error(`[MD-2-API] Error while parsing ${filename}: A 'title' or an 'url' property must be specified inside the markdown file.`)
  }

  if (!fileDataObject.url || !fileDataObject.title) {
    throw new Error(`[MD-2-API] Error while parsing ${filename}: An 'id' property must be specified inside the markdown file.`)
  }

  return fileDataObject
})

const tags = postsData.reduce((obj, postData) => {
  const postTags = postData.tags.split(',')

  postTags.forEach(tag => {
    if (!obj[tag])
      obj[tag] = { id: tag, posts: []}

    obj[tag].posts.push(postData)
  })

  return obj
}, {})

/* Write posts */
postsData.forEach(fileDataObject => {
  const apiFileName = fileDataObject.url || fileDataObject.title
  const apiFilePath = path.resolve(apiPostsDir, `${apiFileName}.json`)
  const jsonContent = JSON.stringify(fileDataObject, null, 4)

  fs.writeFileSync(apiFilePath, jsonContent, 'utf-8')
  console.log(`[GENERATED POST] ${apiFileName}`)
})

/* Write tags */
Object.keys(tags).forEach(tag => {
  const apiFilePath = path.resolve(apiTagsDir, `${tag}.json`)
  const jsonContent = JSON.stringify(tags[tag], null, 4)

  fs.writeFileSync(apiFilePath, jsonContent, 'utf-8')
  console.log(`[GENERATED TAG] ${tag}`)
})
