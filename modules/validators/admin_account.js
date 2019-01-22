const revalidator = require('revalidator')

module.exports = function(data) {
    return revalidator.validate(data, {
        properties: {
            login: {
                required: true,
                type: 'string',
                minLength: 2,
                maxLength: 64
            },
            name: {
                required: true,
                type: 'string',
                minLength: 2,
                maxLength: 64
            },
            password: {
                required: true,
                type: 'string',
                minLength: 8,
                maxLength: 64
            },
            password_repeat: {
                required: true,
                type: 'string',
                minLength: 8,
                maxLength: 64
            },
            email: {
                required: true,
                type: 'string',
                minLength: 5,
                maxLength: 255
            }
        }
    }, {
        additionalProperties: false
    })
}
