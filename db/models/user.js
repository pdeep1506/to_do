const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const async = require('hbs/lib/async');
const userSchema = new mongoose.Schema({
    name:{
        type:String, required: true
    },
    phone:{
        type:Number, required:true
    },
    email:{
        type: String, required:true, unique:true
    },
    password:{
        type: String, required: true
    }
})

userSchema.pre('save', async function(next){
    
    if(this.isModified('password')){
        this.password = await bcryptjs.hash(this.password, 10);
    }
    next();
})
const userModel = new mongoose.model('user', userSchema);


module.exports = userModel