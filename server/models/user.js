const mongoose = require('mongoose');
const bcrypt   = require('bcrypt-nodejs');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name : {
        type: String
    },
    email: {
        type: String,
        lowercase: true,
        index: {
            unique: true
        },
        required: true
    },
    password: {
        type: String,
        required: true
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },
    is_admin: {
        type: Boolean,
        required: true,
        default : 0
    },
    deleted: {
        type: Boolean,
        required: true,
        default : 0
    },
    created_at: Date,
    updated_at: Date
});

userSchema.methods.generateHash = (password) =>
{
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = (password, user) =>
{
    return bcrypt.compareSync(password, user.password);
};

const User = mongoose.model(global.AppLbl.dBTable.User, userSchema);
module.exports = User;
