//jshint esversion:6

require('dotenv').config();
const express=require("express");
const app=express();
const bodyParser=require("body-parser");
const ejs=require("ejs");
const fs=require("fs");
const axios = require("axios");

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
  var siteKey = process.env.siteKey;
  res.render("login",{year:currentYear, key: siteKey});
});

app.get("/failure",function(req,res){
  res.render("failure");
});

app.get("/contact",(req,res) => {
  var mail = process.env.mail;
  res.render("contact",{year:currentYear, mailId: mail});
});

// Images Routes
app.get("/haldi", isAuthenticatedMiddleware, (req,res) => {
   // var files=fs.readdirSync(__dirname+"/public/haldiimages");
   var elementStartFirst=process.env.imageStartFirst;
   var elementEndFirst=process.env.imageEndFirst;
   var imageLinkFirst=process.env.linkFirst;
   res.render("haldi",{year:currentYear,imgLink:imageLinkFirst,imageStartIndex:elementStartFirst,imageEndIndex:elementEndFirst});
});

app.get("/mehndi", isAuthenticatedMiddleware, (req,res) => {
  var elementStartSecond=process.env.imageStartSecond;
  var elementEndSecond=process.env.imageEndSecond;
  var imageLinkSecond=process.env.linkFirst;
   res.render("mehndi",{year:currentYear,imgLink:imageLinkSecond,imageStartIndex:elementStartSecond,imageEndIndex:elementEndSecond});
});

app.get("/sangeet", isAuthenticatedMiddleware, (req,res) => {
  var elementStartThird=process.env.imageStartThird;
  var elementEndThird=process.env.imageEndThird;
  var imageLinkThird=process.env.linkFifth;
   res.render("sangeet",{year:currentYear,imgLink:imageLinkThird,imageStartIndex:elementStartThird,imageEndIndex:elementEndThird});
});

app.get("/reception", isAuthenticatedMiddleware, (req,res) => {
  var elementStartFourth=process.env.imageStartFourth;
  var elementEndFourth=process.env.imageEndFourth;
  var imageLinkFourth=process.env.linkFourth;
   res.render("reception",{year:currentYear,imgLink:imageLinkFourth,imageStartIndex:elementStartFourth,imageEndIndex:elementEndFourth});
});

app.get("/welcome", isAuthenticatedMiddleware, (req,res) => {
  var elementStartFifth=process.env.imageStartFifth;
  var elementEndFifth=process.env.imageEndFifth;
  var imageLinkFifth=process.env.linkFifth;
   res.render("welcome",{year:currentYear,imgLink:imageLinkFifth,imageStartIndex:elementStartFifth,imageEndIndex:elementEndFifth});
});

app.get("/nikasi", isAuthenticatedMiddleware, (req,res) => {
  var elementStartSixth=process.env.imageStartSixth;
  var elementEndSixth=process.env.imageEndSixth;
  var imageLinkSixth = process.env.linkSixth;
    res.render("nikasi",{year:currentYear,imgLink:imageLinkSixth,imageStartIndex:elementStartSixth,imageEndIndex:elementEndSixth});
});

app.post("/failure",function(req,res){
  res.redirect("login");
});

app.post("/login", (req,res) => {
  // const userId=req.body.username;
  // const pass=req.body.pswd;
  //
  // if(userId===process.env.login_username && pass===process.env.login_password){
  //    isAuthenticated = true;
  //    res.render("gallery",{year:currentYear});
  //  }
  // else{
  //   isAuthenticated = false;
  //   res.render("failure");
  // }

   const userId = req.body.username;
   const pass = req.body.pswd;
   const recaptchaResponse = req.body['g-recaptcha-response']; // Get reCAPTCHA response

   const recaptchaSecretKey = process.env.secretKey;

   // Verify reCAPTCHA using axios
   axios.post(
       `https://www.google.com/recaptcha/api/siteverify`,
       `secret=${recaptchaSecretKey}&response=${recaptchaResponse}`,
       { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
   )
   .then(response => response.data)
   .then(recaptchaData => {
       if (recaptchaData.success) {
           if (userId === process.env.login_username && pass === process.env.login_password) {
               isAuthenticated = true;
               res.render("gallery", { year: currentYear });
           } else {
               isAuthenticated = false;
               res.render("failure");
           }
       } else {
           // CAPTCHA challenge not passed, handle accordingly
           res.render("failure");
       }
   })
   .catch(error => {
       console.error('Error verifying reCAPTCHA:', error);
       res.render("failure");
   });
});

let port = process.env.PORT;

app.listen(port,function(){
  console.log("Server is running on port "+port);
});
