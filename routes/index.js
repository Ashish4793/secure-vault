import express from 'express';
const router = express.Router();

import { getFiles } from "../controllers/file-handling.js";

router.get("/dashboard" , getFiles)

router.get("/" , (req,res) => {
    if (req.isAuthenticated()){
        res.render("home" , {authenticated : true})
    } else {
        res.render("home", {authenticated : false})
    }
});


export default router;