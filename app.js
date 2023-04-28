const express = require('express');
const path = require('path');
const app = express();
const crypto = require("crypto");
const bodyParser=require('body-parser');
const sqlite3 = require('sqlite3');
const ejs = require('ejs');
const nodemailer = require('nodemailer');
const port = 8000;
const mongoose = require('mongoose')
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({ extended: false }));
const { get } = require("http");

// Nodemailer
let transporter = nodemailer.createTransport({
    service:'gmail',
     auth: {
         user: 'rebirthlifeafterdeath@gmail.com',
         pass: 'imltmjomnqmzyscg'
     }
 });

// const { Collection } = require('mongoose');
 app.use(bodyParser.urlencoded({ extended: true }));
 const dbna=path.join(__dirname,"data","data.db");
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs')
app.get('/',(req,res)=>{
    res.render('index')
});
app.get('/Aboutus',(req,res)=>{
    res.render('AboutUs')
});
app.get('/package',(req,res)=>{
    res.render('packages');
})
app.get('/payment',(req,res)=>{
    res.render('payment');
})
app.listen(8000, function () {
    console.log("server is runnig on the port 8000");
});

app.post("/details",(req,res)=>{
    res.render('login')
})
const db=new sqlite3.Database(dbna,err=>{
    if(err){
        return console.log(err.message);
    }
    console.log("Database connected");
});

const Usertable="CREATE TABLE IF NOT EXISTS Customer(uid,Name varchar(50),Guardian varchar(50),Email varchar(50),Address varchar(200),Mobile varchar(50),package varchar(20));";
db.run(Usertable,(err)=>{ 
    if(err){
        console.log(err);
    }
    else{
        console.log("Table created");
    }
})
const insert ="insert into Customer values(?,?,?,?,?,?,?)"
var data=[],email,n;
app.post('/package',(req,res)=>{
 n = crypto.randomInt(1000000000, 9999999999);  
   data=[
    n,
    req.body.Name,
    req.body.Guardian,
    req.body.Email,
    req.body.Address,
    req.body.Mobile
   ]
   email=req.body.Email;
    res.render('packages');
})
app.post('/Basic',(req,res)=>{
   data.push('Basic');
   console.log(data);
  db.run(insert,data,(err)=>{
    if(err){
    console.log(err)    
    }
    else {
      mail(n,email,'Basic')
      res.redirect("/payment")   
    }
  })     
})
app.post('/Premium',(req,res)=>{
    data.push('Premium');
    console.log(data);
   db.run(insert,data,(err)=>{
     if(err){
     console.log(err)    
     }
     else {
       mail(n,email,'Premium') 
       res.redirect("/payment") 
     }
   })     
 })
  
 app.post('/Ultimate',(req,res)=>{
    data.push('Ultimate');
    console.log(data);
   db.run(insert,data,(err)=>{
     if(err){
     console.log(err)    
     }
     else {
       mail(n,email,'Ultimate') 
       res.redirect("/payment") 
     }
   })     
 })

function mail(n,email,type){
    let mailOptions = {
        from: 'rebirthlifeafterdeath@gmail.com',
        to: email,
        subject: 'Order successfull',
        text: "Thank you for purchasing "+type+" Package. Your order of invoice("+n+") have been placed ! Our team will contact you in less than 2 days\n Team details:\n phone number:9123456788\n email: rebirth@gmail.com\n"
    };
       transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent to ' +email); 
        }
    });
}




