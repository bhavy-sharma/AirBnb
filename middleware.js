const Listing = require('./models/listing.js');


module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You Must be Logged in Before Create Listings");
        return res.redirect("/login");
    }
    next();
}


module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}


module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    let listing = await Listing.findById(id);
    if(!currUser && listing.owner._id.equals(res.locals.currUser.id)){
        req.flash("error", "You Don't have Permission my Child for doing this thing...")
        return res.redirect(`/listings/${id}`);
    }
    next();
}