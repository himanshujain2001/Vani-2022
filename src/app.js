import express from "express"
import cookieParser from "cookie-parser"

const app=express();

app.locals.basePath = "/vani-2022/users"

app.use(express.json({limit: "16kb"})) // to get data in json format
app.use(express.static("public")) // to get data from static files
app.use(express.urlencoded({extended: true})) // to get data from url
app.use(cookieParser()) // to store and remove cookies in user's browser
app.set('view engine', 'ejs');


// import router

import userRoute from "./routes/user.route.js"

// router defination

app.use('/vani-2022/users', userRoute)

// only telling render to do naviagte to this path as it's not going automatically to this for homepage
// Redirect all requests from the root ("/") to the base path
app.get("/", (req, res) => {
    res.redirect("/vani-2022/users");
});

export { app }
