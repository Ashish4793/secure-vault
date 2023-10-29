
export const getDashboard = (req,res) => {
    if (req.isAuthenticated()){
        res.render("dashboard");
    } else {
        res.redirect('/login');
    }
}