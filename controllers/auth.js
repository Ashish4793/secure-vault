import User from '../model/usersModel.js'


export const getLoginPage = (req,res) => {
    if (req.isAuthenticated()){
        res.redirect("/")
    } else {
        res.render("login");
    }
}

export const getRegisterPage = (req,res) => {
    if (req.isAuthenticated()){
        res.redirect("/")
    } else {
        res.render("register");
    }
}

export const registerTrigger = (req,res) => {
    if (req.isAuthenticated()){
        res.redirect("/")
    } else {
        User.register({
            username: req.body.username, name : req.body.name 
            }, req.body.password, function (err, user) {
            if (err) {
                console.log(err.code);
                if (err.code === 11000) {
                    console.log(err);
                } else {
                    console.error('Error:', err);
                }
            } else {
                res.send("Success register")
            }
        });
    }
}