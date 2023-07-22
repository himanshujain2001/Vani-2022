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
let isAuthenticated = false;

function isAuthenticatedMiddleware(req, res, next) {
  if (isAuthenticated) {
    return next(); // User is authenticated, continue to the next middleware/route
  } else {
    res.redirect("/login"); // User is not authenticated, redirect to the login page
  }
}

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

app.get("/contact",(req,res) => {
  res.render("contact",{year:currentYear});
});

// Images Routes
app.get("/haldi", isAuthenticatedMiddleware, (req,res) => {
   var files=fs.readdirSync(__dirname+"/public/haldiimages");
   var elementIndex=0;
   res.render("haldi",{year:currentYear,uploadHaldi:files,index:elementIndex});
});

app.get("/mehndi", isAuthenticatedMiddleware, (req,res) => {
  var files=fs.readdirSync(__dirname+"/public/mehndiimages");
  var elementIndex=0;
   res.render("mehndi",{year:currentYear,uploadMehndi:files,index:elementIndex});
});

app.get("/reception", isAuthenticatedMiddleware, (req,res) => {
  var files=fs.readdirSync(__dirname+"/public/receptionimages");
  var elementIndex=0;
   res.render("reception",{year:currentYear,uploadReception:files,index:elementIndex});
});

app.get("/welcome", isAuthenticatedMiddleware, (req,res) => {
  var files=fs.readdirSync(__dirname+"/public/welcomeimages");
  var elementIndex=0;
   res.render("welcome",{year:currentYear,uploadWelcome:files,index:elementIndex});
});

app.get("/sangeet", isAuthenticatedMiddleware, (req,res) => {
  var files=fs.readdirSync(__dirname+"/public/sangeetimages");
  var elementIndex=0;
   res.render("sangeet",{year:currentYear,uploadSangeet:files,index:elementIndex});
});

app.get("/nikasi", isAuthenticatedMiddleware, (req,res) => {
  var files=fs.readdirSync(__dirname+"/public/nikasiimages");
  var elementIndex=0;
   res.render("nikasi",{year:currentYear,uploadNikasi:files,index:elementIndex});
});

app.post("/failure",function(req,res){
  res.redirect("login");
});

app.post("/login",function(req,res){
  const userId=req.body.username;
  const pass=req.body.pswd;

  if(userId===process.env.login_username && pass===process.env.login_password){
     isAuthenticated = true;
     res.render("gallery",{year:currentYear});
   }
  else{
    isAuthenticated = false;
    res.render("failure");
  }
});

let port = process.env.PORT || 3000;

app.listen(port,function(){
  console.log("Server is running on port "+port);
});
