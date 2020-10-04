
const mongoose = require('mongoose')
const { Schema } = mongoose;


const TransactionSchema = new Schema({
    userId:{type: String, required: true},
    amount:{type: Number, required: true},
    date:{type: Date, default: Date.now},
    status:{type: String, default:'PENDING'},
    email:{type: String,required: true},
    type:{type: String,required: true},
    image:{type: String}, 
    name:{type: String}
});

module.exports = mongoose.model('Transaction', TransactionSchema)