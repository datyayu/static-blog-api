const fs = require('fs')
const path = require('path')
const mdToObject = require('./mdToObject')

/* PATHS */
const baseDir = path.resolve(__dirname, '..')
const apiDir = path.resolve(baseDir, 'api')
const apiPostsDir = path.resolve(apiDir, 'posts')
const markdownDir = path.resolve(baseDir, 'markdown')
const markdownPostsDir = path.resolve(markdownDir, 'posts')


// Create dirs.
if (!fs.existsSync(apiDir))
  fs.mkdirSync(apiDir)

if (!fs.existsSync(apiPostsDir))
  fs.mkdirSync(apiPostsDir)


/* Get filenames */
const postsMdFiles = fs.readdirSync(markdownPostsDir)

postsMdFiles.forEach(filename => {
  const filePath = path.resolve(markdownPostsDir, filename)
  const fileDataObject = mdToObject(filePath)

  if (!fileDataObject.url || !fileDataObject.title) {
    throw new Error(`[MD-2-API] Error while parsing ${filename}: A 'title' or an 'url' tag must be specified inside the markdown file.`)
  }

  const apiFileName = fileDataObject.url || fileDataObject.title
  const apiFilePath = path.resolve(apiDir, 'posts', `${apiFileName}.json`)
  const jsonContent = JSON.stringify(fileDataObject)

  fs.writeFileSync(apiFilePath, jsonContent, 'utf-8')
  console.log(`[GENERATED] ${apiFileName}`)
})

