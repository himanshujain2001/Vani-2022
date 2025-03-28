import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
    phonenumber: {
        type: String,
        required: [true, "Phone number is required"],
        unique: true,
        minlength: 10,
        maxlength: 10
    },
    refreshToken: {
        type: String
    }

}, {timestamps: true})

userSchema.pre("save", async function (next) {
    if(!this.isModified("phonenumber"))  return next()

    this.phonenumber = await bcrypt.hash(this.phonenumber, 10)
    next()
})

userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            phonenumber: this.phonenumber
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: process.env.ACCESS_TOKEN_EXPIRY}
    )
}

userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: process.env.REFRESH_TOKEN_EXPIRY}
    )
}

export const User = mongoose.model("User", userSchema)