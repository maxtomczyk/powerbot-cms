class PostbackSimulator {
  constructor (handler) {
    this.handler = handler
  }

  async simulate (payload, message, user) {
    message.simulated = true
    message.payload = payload
    return this.handler(message, user)
  }
}

module.exports = PostbackSimulator
