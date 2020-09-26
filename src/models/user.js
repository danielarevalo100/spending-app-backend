
const mongoose = require('mongoose')
const { Schema } = mongoose;


const UserSchema = new Schema({
    userName:{type: String, required: true},
    password:{type: Number, required: true, unique: true},
    balance:{type: Number,default:0}
});

module.exports = mongoose.model('User', UserSchema)