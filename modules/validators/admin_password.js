const revalidator = require('revalidator')

module.exports = function(data) {
    return revalidator.validate(data, {
        properties: {
            password: {
                required: true,
                type: 'string'
            },
            new_password: {
                required: true,
                type: 'string',
                minLength: 8,
                maxLength: 64
            },
            new_password_repeat: {
                required: true,
                type: 'string',
                minLength: 8,
                maxLength: 64
            }
        }
    }, {
        additionalProperties: false
    })
}
