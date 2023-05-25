const mongoose = require('mongoose');
const Schema = mongoose.Schema
const bcrypt = require("bcrypt-nodejs")

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
})

const User = mongoose.model('User', userSchema)
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
}

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}
module.exports = User
