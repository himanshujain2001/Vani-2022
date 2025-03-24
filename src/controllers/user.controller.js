import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import axios from "axios";
import jwt from "jsonwebtoken"

var currentYear=new Date().getFullYear();

// GET request controllers
const homePage = asyncHandler (async (req, res) => {
    res.render("home",{year:currentYear});
})

const loginPage = asyncHandler (async (req, res) => {
    var siteKey = process.env.siteKey;
    console.log("Login page triggered");
    
    res.render("login",{year:currentYear, key: siteKey});
})

const contactPage = asyncHandler (async (req, res) => {
    var mail = process.env.mail;
    res.render("contact", {year:currentYear, mailId: mail});
})

const galleryPage = asyncHandler (async (req, res) => {
    res.render("gallery", {year:currentYear})
})

const failurePage = asyncHandler (async (req, res) => {
    res.render("failure");
})

// Generate access and refresh token
const generateAccessAndRefreshToken = async (userID) => {
    try {
        // vaapas se user find krne pdega because jo phle find kiya hua h vo const h usme changes krenge to vo reflect nhi honge
        const user = await User.findById(userID)
        
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        // add and save refresh token in DB
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(400, "There is an error in generating Access and Refresh token")
    }
}

// Login Functionality Controller
const loginUser = asyncHandler( async (req, res, next) => {

     const {username: userId, password, phonenumber } = req.body;

     const recaptchaResponse = req.body['g-recaptcha-response']; // Get reCAPTCHA response
  
     const recaptchaSecretKey = process.env.secretKey;
  
     // Verify reCAPTCHA using axios
     axios.post(
         `https://www.google.com/recaptcha/api/siteverify`,
         `secret=${recaptchaSecretKey}&response=${recaptchaResponse}`,
         { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
     )
     .then(response => response.data)
     .then(async recaptchaData => {
         if (recaptchaData.success) {
             if (userId === process.env.login_username && password === process.env.login_password) {
                //  isAuthenticated = true;
                // const hashedPhonenumber = await bcrypt.hash(this.phonenumber, 10)
                // console.log("Phone number hashed successfully");
                
                // const existingUser = await User.findOne({
                //     phonenumber: { $eq: hashedPhonenumber }
                // })
            
                // if(existingUser)
                //     next()

                // console.log("No existing user found");

                const userSavedToDB = await User.create({
                    phonenumber
                })

                const createdUser = await User.findById(userSavedToDB._id)
            
                if(!createdUser)
                    throw new ApiError(500, "User not created successfully")

                const {accessToken, refreshToken} = await generateAccessAndRefreshToken(createdUser._id)

                const foundUser = await User.findById(createdUser._id)

                const options = {
                    httpOnly: true,
                    secure: true,
                    sameSite: "Strict" // cookies will be sent on the request which r originating from same domain means it'll block from cross domains
                }
            
                // cookies .cookie method use kr k send krte h key-value ki form m
                res
                .cookie("accessToken", accessToken, options)
                .cookie("refreshToken", refreshToken, options)

                console.log("Tokens generated and stored");

                next();
             } else {
                 //isAuthenticated = false;
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

const logoutUser = asyncHandler (async (req, res) => {

    // const user = await User.findById(req.authorizedUser._id)
    await User.deleteOne({_id: req.authorizedUser._id})

    console.log("User deleted successfully");

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "Strict"
    }
    
    res.clearCookie("accessToken", options).clearCookie("refreshToken", options)
    console.log("User logged out successfully");

    res.render("login",{year:currentYear, key: process.env.siteKey});
})

// Function routes GET requests controllers
const haldiPage = asyncHandler( async (req, res) => {
//     // var files=fs.readdirSync(__dirname+"/public/haldiimages");

//    var elementStartFirst=process.env.imageStartFirst;
//    var elementEndFirst=process.env.imageEndFirst;
//    var imageLinkFirst=process.env.linkFirst;
    res.render("haldi",
    {
      color: 'efa601',
      year:currentYear,
      imgLink:process.env.linkFirst,
      imageStartIndex:process.env.imageStartFirst,
      imageEndIndex:process.env.imageEndFirst
    }
    );
})

const mehndiPage = asyncHandler (async (req, res) => {
    res.render("mehndi",
    {
       color: '7c8948',
       year:currentYear,
       imgLink:process.env.linkFirst,
       imageStartIndex:process.env.imageStartSecond,
       imageEndIndex:process.env.imageEndSecond
    }
    );
})

const sangeetPage = asyncHandler (async (req, res) => {
    res.render("sangeet",
    {
       color: 'ECB390',
       year:currentYear,
       imgLink:process.env.linkFifth,
       imageStartIndex:process.env.imageStartThird,
       imageEndIndex:process.env.imageEndThird
    }
    );
})

const receptionPage = asyncHandler (async (req, res) => {
    res.render("reception",
    {
       color: 'be944b',
       year:currentYear,
       imgLink:process.env.linkFourth,
       imageStartIndex:process.env.imageStartFourth,
       imageEndIndex:process.env.imageEndFourth
    }
    );
})

const welcomePage = asyncHandler (async (req, res) => {
    res.render("welcome",
    {
       color: 'c83b2a',
       year:currentYear,
       imgLink:process.env.linkFifth,
       imageStartIndex:process.env.imageStartFifth,
       imageEndIndex:process.env.imageEndFifth
    }
    );
})

const nikasiPage = asyncHandler (async (req, res) => {
    res.render("nikasi",
    {
       color: 'FFDBA4',
       year:currentYear,
       imgLink:process.env.linkSixth,
       imageStartIndex:process.env.imageStartSixth,
       imageEndIndex:process.env.imageEndSixth
    }
    );
})

const redirectToLoginPage = asyncHandler( async (req, res) => {
    res.redirect(`/vani-2022/users/login`);
})

export { homePage, loginPage, contactPage, galleryPage, failurePage, haldiPage, mehndiPage, sangeetPage, receptionPage, welcomePage,
    nikasiPage, redirectToLoginPage, loginUser, logoutUser }