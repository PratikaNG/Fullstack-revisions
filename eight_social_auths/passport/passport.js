const passport = require('passport');
const User = require('../models/userModel')
var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:4000/auth/google/callback"
  },
//   function(accessToken, refreshToken, profile, cb) {
//     User.findOrCreate({ googleId: profile.id }, function (err, user) {
//       return cb(err, user);
//     });
//   }
(accessToken, refreshToken, profile, next)=>{
    // console.log("Profile",profile);
    console.log("Profile",profile._json.email);
    User.findOne({email:profile._json.email})
    .then((user)=>{
        if(user){
            console.log("user already exsist in DB",user)
            next(null,user)
        }else{
            User.create({
                name: profile.displayName,
                googleId: profile.id,
                email:profile._json.email
            }).then((user)=>{console.log("User",user)
                next(null,user)
            })
            .catch((error)=>{console.log(err)})
        }
    })
    // next();
}
));