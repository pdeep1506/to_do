const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
require('dotenv').config();
const cookieparser = require('cookie-parser');

require('../db/conn')
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieparser())
const staticPath = path.join(__dirname,'../static');
const partialsPath = path.join(__dirname,'../template/partials');
const viewsPath = path.join(__dirname,'../template/views');
app.set('view engine', 'hbs')
hbs.registerPartials(partialsPath);
app.set(express.static(staticPath));
app.set('views', viewsPath);

const homePath = require('./home')
// console.log(homePath)
app.use('/', homePath)



app.get('*',(req,res)=>{
    res.send('Not Found')
})

app.listen(process.env.PORT, '127.0.0.1',()=>{
    console.log(`listening on the port no ${process.env.PORT}`);
})
