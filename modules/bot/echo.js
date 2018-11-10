module.exports = async function (message, user) {
  if (!message.text) return

  switch (message.text.toLowerCase()) {
    case 'witamy!':
      await user.enableModeratorChat()
      break

    case 'pozdrawiamy!':
      await user.disableModeratorChat()
      break
    default:
      break
  }
}
