const mongoose = require('mongoose')
const URI = "mongodb+srv://danielarevalo100:madacli3@cluster0.yr3w6.mongodb.net/spending?retryWrites=true&w=majority"
 mongoose.connect(URI)
    .then(db => console.log('DB connected'))
    .catch(err => console.log(err))

module.exports = mongoose