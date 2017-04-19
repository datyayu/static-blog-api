const fs = require('fs')
const showdown = require('showdown')

const converter = new showdown.Converter()


/**
 * Reads a given filepath and returns an object with the meta-data from
 * that file, ready to be converted to JSON.
 */
module.exports = function mdToObject(filepath) {
  const fileContent = fs.readFileSync(filepath, 'utf-8')
  const objectData = fileContent.match(/\[\/\/\]\: \# \(.*\)/g)
    .reduce((object, tag) => {
      const key = tag.match(/\(.* - /g)[0]
        .replace('(', '')
        .replace('-', '')
        .trim()
      const value = tag.match(/ - .*\)/g)[0]
        .replace('-', '')
        .replace(')', '')
        .trim()

      object[key] = value

      return object
    }, {})

  const postMDContent = fileContent.replace(/\[\/\/\]\: \# \(.*\)/g, '').trim()
  const htmlContent = converter.makeHtml(postMDContent)

  objectData.html = htmlContent

  return objectData
}
