import express from "express";
const router = express.Router();
import passport from 'passport';
import passportLocalMongoose from 'passport-local-mongoose';
import User from '../model/usersModel.js'

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

import {getLoginPage , getRegisterPage , registerTrigger} from '../controllers/auth.js'

router.get("/login" , getLoginPage);
router.get("/register" , getRegisterPage);
// router.post("/register" , registerTrigger);

router.post("/login" , passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/badcred"
}), function (req, res) {})

router.get("/logout", (req,res) => {
    req.logout(function (err) {
        if (!err) {
            res.redirect('/');
        } else {
            console.log(err);
        }
    });
})

export default router;