import express from "express"
import cookieParser from "cookie-parser"
import helmet from "helmet"
import rateLimit from "express-rate-limit"

const app = express();

app.locals.basePath = "/vani-2022/users"

app.use(express.json({limit: "16kb"})) // to get data in json format
app.use(express.static("public")) // to get data from static files
app.use(express.urlencoded({extended: true})) // to get data from url
app.use(cookieParser()) // to store and remove cookies in user's browser
app.use(helmet());

app.set('view engine', 'ejs');

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 5 requests
    message: "Too many requests, please try again later.",
  });

// import router

import userRoute from "./routes/user.route.js"

// router defination
// apiLimiter will automatically be inherited by all the endpoints defined in userRoute
app.use('/vani-2022/users', apiLimiter, userRoute)

// only telling render to do naviagte to this path as it's not going automatically to this for homepage
// Redirect all requests from the root ("/") to the base path
app.get("/", (req, res) => {
    res.redirect("/vani-2022/users");
});

export { app }
