const express = require('express')
const router = express.Router()
var firebase = require('./configuration')
var userData = require('./UserData')
router.get('/',(request,response)=>{
    firebase.auth().onAuthStateChanged(function(user){
        if(user){
            console.log('User present')
            return response.redirect('./modules')                       
        }
        else{
             console.log('User not present')
             return response.render('index')
        }
    })
})

router.get('/login',(request,response)=>{
    firebase.auth().onAuthStateChanged(function(user){
        if(user){
            console.log('User present')
            return response.redirect('./modules')
        }
        else{
            console.log('User not present')
            return response.render('index')
        }
    })
})

router.get('/contact',(request,response)=>{
    firebase.auth().onAuthStateChanged(function(user){
        if(user){            var role
            for(var i in userData.email){
                if(userData.email[i] == user.email)
                    break
            }
            console.log('User present')
            var present = true
            return response.render('contact',{
            email:user.email,
            presents:present,admin:userData.admin[i]
        })
        }
        else{
            var admin =false
            var present = false
            console.log('User not present')
            return response.render('contact',{
                presents:present,admin
            })
        }
    })
})

router.post('/',(request,response)=>{
    firebase.auth().onAuthStateChanged(function(user){
        if(user){
                        console.log('User present')
            return response.redirect('../modules')
        }
        else{
            var errors
            if(request.query.errors){
                errors = request.query.errors
            }
            console.log('User not present')
            return response.render('index',{errors})
        }
    })
})

router.get('/modules',(request,response)=>{
    firebase.auth().onAuthStateChanged(function(user){
        if(user){
            for(var i in userData.email){
                if(userData.email[i] == user.email){
                    break 
                }
            }
            console.log('User present')
            var present= user.email
            return response.render('modules',{     
                presents:present,admin:userData.admin[i]
            })
        }
        else{
            console.log('User not present')
            return response.redirect('./')
        }
    })
})

router.get('/signup',(request,response)=>{
    firebase.auth().onAuthStateChanged(function(user){
        if(user){
                return response.redirect('./modules')
        }
        else{
            console.log("request=      "+ request)
            return response.render('signup')
        }
    })
})

router.post('/signup',(request,response)=>{
    firebase.auth().onAuthStateChanged(function(user){
        if(user){
            return response.redirect('./modules')
        }
        else{
            console.log("request=      "+ request)
            return response.render('signup')
        }
    })
})

router.get('/passwordReset',(request,response)=>{
    firebase.auth().onAuthStateChanged(function(user){
        if(user){
            return response.redirect('./modules')
        }
        else{
            console.log("request=      "+ request)
            return response.render('reset.ejs')
        }
    })
})

router.post('/passwordReset',(request,response)=>{
    firebase.auth().onAuthStateChanged(function(user){
        if(user){
            return response.redirect('./modules')
        }
        else{
            const { email } = request.body;
            let errors = [];
            //Check required feilds
            if (!email) {
                errors.push({ msg: 'Please fill the email field' });
            }
            if (errors.length > 0) {
                response.render('reset.ejs', {
                    errors
                });
            }
            else{
                //validation passed
                firebase.auth().sendPasswordResetEmail(email)
                .then(function () {
                    console.log('password reset mail send !!')
                    return response.redirect('../');
                })
                .catch(function (error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    // ...
                    errors.push({ msg: errorMessage });
                    return response.render('reset.ejs', {
                        errors
                    });
                });
            }   
        }
    })
})

router.get('/logout',(request,response)=>{
    firebase.auth().signOut();
    return response.redirect('../');
})

module.exports = router