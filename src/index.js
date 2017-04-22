#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const mdToObject = require('./mdToObject')
const postToTags = require('./postsToTags')
const creators = require('./json-creators')


/* PATHS */
const inputDir = process.argv[2]
if (!inputDir) throw new Error('A base directory must be specified.')

const outputDir = process.argv[3]
if (!outputDir) throw new Error('An output directory must be specified.')

const apiDir = path.resolve(outputDir, 'api')
const apiPostsDir = path.resolve(apiDir, 'posts')
const apiTagsDir = path.resolve(apiDir, 'tags'))


// Create dirs.
if (!fs.existsSync(apiDir))
  fs.mkdirSync(apiDir)


/* Get filenames */
const postsMdFiles = fs.readdirSync(inputDir)

const postsData = postsMdFiles.map(filename => {
  const filePath = path.resolve(inputDir, filename)
  const fileDataObject = mdToObject(filePath)

  if (!fileDataObject.url && !fileDataObject.title) {
    throw new Error(`[MD-2-API] Error while parsing ${filename}: A 'title' or an 'url' property must be specified inside the markdown file.`)
  }

  if (!fileDataObject.id) {
    throw new Error(`[MD-2-API] Error while parsing ${filename}: An 'id' property must be specified inside the markdown file.`)
  }

  if (!fileDataObject.date) {
    throw new Error(`[MD-2-API] Error while parsing "${filename}": A 'date' property must be specified inside the markdown file.`)
  }

  return fileDataObject
})

const tagsData = postToTags(postsData)

/* Write posts */
creators.createPostsJSON(postsData, apiPostsDir)
creators.createPostsPagesJSON(postsData, apiPostsDir)

creators.createTagsJSON(tagsData, apiTagsDir)
creators.createTagsPagesJSON(tagsData, apiTagsDir)

