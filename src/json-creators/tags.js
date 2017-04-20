const fs = require('fs')
const path = require('path')

module.exports = function createTagsJSON (tags, dir) {
  console.log('\n[GENERATING TAGS]')

  if (!fs.existsSync(dir))
    fs.mkdirSync(dir)

  Object.keys(tags)
    .forEach(tag => {
      const apiFilePath = path.resolve(dir, `${tag}.json`)
      const jsonContent = JSON.stringify(tags[tag], null, 4)

      fs.writeFileSync(apiFilePath, jsonContent, 'utf-8')
      console.log(`tags/${tag}.json`)
    })
}
