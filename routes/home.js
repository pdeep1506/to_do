const express = require('express');
const async = require('hbs/lib/async');
const userModel = require('../db/models/user');
const routers = express.Router();
const  todoModel = require('../db/models/todoform')
const cookieparser = require('cookie-parser')
const bcryptjs = require('bcryptjs');
routers.use(cookieparser());
routers.get('/',(req,res)=>{
    res.render('home')
})

routers.get('/registration',(req,res)=>{
    res.render('registration')
})

routers.get('/login',(req,res)=>{
    res.render('login')
})


routers.post('/registration',async(req,res)=>{
    const name = req.body.name
    const phone = req.body.number
    const email = req.body.email
    const password1 = req.body.password1
    const password2 = req.body.password2

    try{
        if(password1 === password2){
            const data = {
                name: name, phone: phone, email: email, password: password2
            }
            const userData = await userModel.create(data);
            res.redirect('/login');
        }
        else{
            res.render('registration',{
                msg:'Password did not match'
            })
        }
    }
    catch(e){
        res.send(e);
    }
})


routers.post('/login',async(req,res)=>{
    
    try{
        const email = req.body.email;
        const password = req.body.password;
        const userData = await userModel.findOne({email:email})
        const userPassword = userData.password
        const isMatch = await bcryptjs.compare(password, userPassword);

        res.cookie('email', email,{
            httpOnly:true,expires: new Date(Date.now() + 12345678)
        });
        if(isMatch){
                
                res.render('home',{
                    data: userData,
                    userisLogin:true
                })
        }
        else{
            res.render('login',{
                msg:'Password did not match'
            })
        }
    }
    catch(e){
        res.send(e);
    }
})

routers.get('/logout',(req,res)=>{
    try{
        res.clearCookie('email');
        res.redirect('/login');
    }
    catch(e){
        res.status(500).send(e);
    }
})



routers.get('/todolist',async(req,res)=>{
    const email = req.cookies.email
    const data = await todoModel.find({email: email})
    
    try{

        res.render('todolist',{
            userisLogin: true, 
            data :data
        })
    }
    catch(e){
        res.send(e)
    }
})

routers.get('/tododelete/:id',async(req,res)=>{
    const id = req.params.id
    const remove = await todoModel.remove({_id:id});
    res.redirect('/todolist')
})


routers.get('/todoedit/:id',async(req,res)=>{
    const id = req.params.id;
    const data  = await todoModel.findOne({_id: id});
    // console.log(data);
    res.render('edit',{
        userisLogin: true,
        data: data
    })
})

routers.post('/todoedit/:id',async(req,res)=>{
    const id = req.params.id;
    const name = req.body.name;
    const desc = req.body.desc;
    const isactive = req.body.pending;
    const data = { name: name, desc: desc, isactive: isactive};
    try{
        const find = await todoModel.update({_id: id},data)
        res.redirect('/todolist')
    }
    catch(e){
        res.send(e);
    }
})



routers.get('/todoform',(req,res)=>{
    res.render('todoform',{
        userisLogin: true
    })
})

routers.post('/todoform',async(req,res)=>{
    const name = req.body.name
    const desc = req.body.desc
    const isactive = req.body.isactive
    const email = req.cookies.email
    const data = { name: name, desc: desc, isactive: isactive, email: email}

    try{
        const savedata = await todoModel.create(data);
        res.redirect('/todolist')
    }
    catch(e){
        res.send(e)
    }
})


// Search module

routers.post('/search', async(req,res)=>{
    const name = req.body.search;
    const email = req.cookies.email
    const data = await todoModel.find({name: name, email: email})
    
    try{

        res.render('todolist',{
            userisLogin: true, 
            data :data
        })
    }
    catch(e){
        res.send(e)
    }
})



module.exports = routers;