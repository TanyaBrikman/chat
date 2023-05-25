const User = require("../models/user")
const LocalStrategy = require('passport-local').Strategy

const bcrypt = require("bcrypt-nodejs")

module.exports = function (passport) {

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id)
            .then((user) => {
                if (user) {
                    done(null, user);
                } else {
                    done(null, false);
                }
            })
            .catch((err) => {
                done(err)
            })
    })

    passport.use('login', new LocalStrategy({
        passReqToCallback: true
    }, function (req, username, password, done) {

        console.log(`>> LOGGING IN: username='${username}', password='${password}'`)

        User.findOne({'username': username})
            .then((user) => {
                if (user) {
                    console.log(`Found user: ${user}`);

                    if (isValidPassword(user, password)) {
                        console.log("Password is valid, logged in")
                        return done(null, user);
                    } else {
                        console.log("Invalid password");
                        return done(null, false)
                    }
                }

                console.log(`User not found with name '${username}'`)
                return done(null, false)
            })
            .catch((err) => {
                console.log(`Error: ${err}`)
                return done(err)
            })
    }))

    passport.use('signup', new LocalStrategy({
        passReqToCallback: true
    }, function (req, username, password, done) {

        console.log(`>> SIGNING UP: username='${username}', password='${password}'`)

        User.findOne({'username': username})
            .then((user) => {
                if (user) {
                    console.log('User already exists')
                    return done(null, false, req.flash('signupMessage', 'The username already exists'))
                }

                console.log(`Registering new user '${username}'`)

                let newUser = new User()
                newUser.username = username
                newUser.password = generateHash(password)

                newUser.save()
                    .then(() => {
                        console.log('User registration successful')
                        return done(null, newUser)
                    })
                    .catch((err) => {
                        console.log(`Failed to register user: ${err}`)
                        throw done(err)
                    })
            })
            .catch((err) => {
                console.log(`Error: ${err}`)
                return done(err)
            })
    }))
}

function generateHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

function isValidPassword(user, password) {
    return bcrypt.compareSync(password, user.password);
}
