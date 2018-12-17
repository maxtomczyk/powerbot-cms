function matchAll (regExp, str) {
  let matches = []
  while (true) {
    const match = regExp.exec(str)
    if (match === null) break
    matches.push(match[0])
  }
  return matches
}

module.exports = {
  matchAll
}
