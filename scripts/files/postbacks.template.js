const cms = require('incredbot-cms');

module.exports = async function(message, user) {
    switch (message.payload) {
        case 'YOUR_PAYLOAD':
            {

            }
            break;
        default:
            await cms.utils.handlePostback(message, message.payload)
            break
    }
}
