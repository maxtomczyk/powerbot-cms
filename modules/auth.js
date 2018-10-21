const passport = require("passport");
const passportJWT = require("passport-jwt");
const config = require("../config/config.js");
const knex = require('./knex.js');
const logger = require('./logger.js')
const ExtractJwt = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;
const params = {
    secretOrKey: config.jwt.secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

module.exports = function() {
    let strategy = new Strategy(params, async function(payload, done) {
        try {
            let user = await knex('admins').where('id', payload.id).first()
            if (user) {
                return done(null, {
                    id: user.id
                });
            } else {
                return done(new Error("User not found"), null);
            }
        } catch (e) {
            logger.error(e);
        }
    });

    passport.use(strategy);

    return {
        initialize: function() {
            return passport.initialize();
        },
        authenticate: function() {
            return passport.authenticate("jwt", {
                session: false
            });
        }
    };
};
