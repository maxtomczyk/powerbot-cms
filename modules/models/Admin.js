const argon2 = require('argon2');
const knex = require('../knex.js')

class Admin {
    constructor(login) {
        this.id = null
        this.name = null
        this.login = login
        this.owner = null
    }

    async authenticate(password) {
        try {
            let user = await knex('admins').where('login', this.login).first()
            if (user) {
                let passwordCorrect = await argon2.verify(user.password, password);
                this.name = user.name
                this.id = user.id
                this.owner = user.owner
                if (passwordCorrect) return true
                else return false
            } else return false
        } catch (e) {
            throw e;
        }
    }
}

module.exports = Admin;
