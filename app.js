//jshint esversion:6

require('dotenv').config();
const express=require("express");
const app=express();
const bodyParser=require("body-parser");
const ejs=require("ejs");
const fs=require("fs");

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));
app.set('view engine', 'ejs');

const date=new Date();
var currentYear=date.getFullYear();

// NavBar Routes

app.get("/",function(req,res){
  res.render("home",{year:currentYear});
});

app.get("/login",function(req,res){
  res.render("login",{year:currentYear});
});

app.get("/failure",function(req,res){
  res.render("failure");
});

app.get("/contact",function(req,res){
  res.render("contact",{year:currentYear});
});

// Images Routes

app.get("/haldi",function(req,res){
  var files=fs.readdirSync(__dirname+"/public/haldiimages");
   res.render("haldi",{year:currentYear,uploadHaldi:files});
});

app.get("/mehndi",function(req,res){
  var files=fs.readdirSync(__dirname+"/public/mehndiimages");
   res.render("mehndi",{year:currentYear,uploadMehndi:files});
});

app.get("/reception",function(req,res){
  var files=fs.readdirSync(__dirname+"/public/receptionimages");
   res.render("reception",{year:currentYear,uploadReception:files});
});

app.get("/welcome",function(req,res){
  var files=fs.readdirSync(__dirname+"/public/welcomeimages");
   res.render("welcome",{year:currentYear,uploadWelcome:files});
});

app.get("/sangeet",function(req,res){
  var files=fs.readdirSync(__dirname+"/public/sangeetimages");
   res.render("sangeet",{year:currentYear,uploadSangeet:files});
});

app.get("/nikasi",function(req,res){
  var files=fs.readdirSync(__dirname+"/public/nikasiimages");
   res.render("nikasi",{year:currentYear,uploadNikasi:files});
});

app.post("/failure",function(req,res){
  res.redirect("login");
});

app.post("/login",function(req,res){
  const userId=req.body.username;
  const pass=req.body.pswd;

  if(userId===process.env.login_username && pass===process.env.login_password){
     res.render("gallery",{year:currentYear});
   }
  else{
    res.render("failure");
  }
});

let port = process.env.PORT;

app.listen(port,function(){
  console.log("Server is running on port "+port);
});
