const axios = require('axios')
const fs = require('fs')

function matchAll (regExp, str) {
  let matches = []
  while (true) {
    const match = regExp.exec(str)
    if (match === null) break
    matches.push(match[0])
  }
  return matches
}

async function downloadFile (url, target) {
  const writer = fs.createWriteStream(target)

  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  })

  response.data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}

function detectFileFormat (buf) {
  if (Buffer.compare(buf.slice(0, 2), Buffer.from([0xff, 0xd8])) === 0 && Buffer.compare(buf.slice(-2), Buffer.from([0xff, 0xd9])) === 0) return 'jpeg'
  else if (Buffer.compare(buf.slice(0, 8), Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) === 0) return 'png'
}

module.exports = {
  matchAll,
  downloadFile,
  detectFileFormat
}
