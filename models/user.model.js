const mongoose = require('mongoose');



const author = mongoose.Schema({
    number:{
        type:String,
        required: true
    },
    password:{
        type:String,
        required: true,
        minlength: 5,
        // maxlength: 20
    },
    time:{
        type: Date,
        default: Date.now
    }
})




const user = new mongoose.model('user', author);
module.exports = user;