import { Router } from "express";
import { homePage, loginPage, contactPage, galleryPage, failurePage, haldiPage, mehndiPage, sangeetPage, receptionPage, welcomePage,
     nikasiPage, redirectToLoginPage, loginUser, logoutUser} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

// GET requests
router.route("/").get(homePage)
router.route("/login").get(loginPage)
router.route("/contact").get(contactPage)
router.route("/gallery").get(verifyJWT, galleryPage)
router.route("/failure").get(failurePage)

// Function routes GET requests

router.route("/haldi").get(verifyJWT, haldiPage)
router.route("/mehndi").get(verifyJWT, mehndiPage)
router.route("/sangeet").get(verifyJWT, sangeetPage)
router.route("/reception").get(verifyJWT, receptionPage)
router.route("/welcome").get(verifyJWT, welcomePage)
router.route("/nikasi").get(verifyJWT, nikasiPage)

// POST requests
router.route("/login").post(loginUser, galleryPage)
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/failure").post(redirectToLoginPage)

export default router