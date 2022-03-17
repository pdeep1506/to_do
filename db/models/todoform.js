const mongoose = require('mongoose');

const todoschema = new mongoose.Schema({
    name: {
        type: String, required: true
    },
    desc:{
        type: String, required:true
    },
    isactive:{
        type: Boolean, default:false
    },
    email:{
        type: String, required: true
    }
})

const todoModel = new mongoose.model('todolist', todoschema)

module.exports = todoModel