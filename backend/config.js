module.exports = {
    database: 'mongodb://localhost:27017/fsdemo',

    secret: 'longmaythesunshine',

    passport: function (passport) {
        const JwtStrategy = require('passport-jwt').Strategy;
        const ExtractJwt = require('passport-jwt').ExtractJwt;
        const user = require('./user-model');

        let opts = {};
        opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
        opts.secretOrKey = this.secret;
        passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
            user.getUserById(jwt_payload.data._id, (err, user) => {
                if (err) {
                    return done(err, false);
                }
                if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
        }));
    }
}