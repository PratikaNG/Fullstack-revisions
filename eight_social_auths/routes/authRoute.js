const express = require('express');
const router = express.Router()
const passport = require('passport')

router.get('/login',(req,res)=>{
    res.render('login')
});
router.get('/google',passport.authenticate('google',{
    scope:['email','profile']
}),(req,res)=>{
    res.end('login with google.')
});

router.get('/google/callback',passport.authenticate('google'),(req,res)=>{
    res.send(req.user)
    // res.send('google callback')
});

router.get('/logout',(req,res)=>{});



module.exports = router;