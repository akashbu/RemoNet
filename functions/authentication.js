const express = require('express');
const router = express.Router();
var admin = require('firebase-admin');
var firebase = require('./configuration');
var ref = require('./reference')
var mailer = require('./mailing')
var userData = require('./UserData')
var usersref = ref.usersRef
router.post('/login',(request,response)=>{
    const { email, password } = request.body
    let errors = [];

    //Check required feilds
    if (!email || !password) {
        errors.push({ msg: 'Please fill all the fields' })
    }

    // //Check passwords length
    if (password.length < 6) {
        errors.push({ msg: "Password should contain atleast six characters" })
    }
    if (errors.length > 0) {
        return response.render('./index', {
            errors
        });
     }
    else {
        //validation passed
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function (user) {
            for(var i in userData.email){
                if(!(userData.email[i].localeCompare(email))){
                    if(userData.password[i].localeCompare(password)){
                        usersref.once('value',function(snap){
                            keys = Object.keys(snap.val())
                            for(var k=0;k<keys.length;k++){
                                if(snap.val()[keys[k]].email == email){
                                    usersref.child(keys[k]).update({
                                        'password' : password
                                    })
                                   break 
                                }
                            }
                        })
                    }
                    break;
                }
            }
            console.log('uid : ' + user.uid);

            if (!(email.localeCompare('remonet.shalaka@gmail.com')) || userData.admin[i] == true) {
                return response.redirect('../admin/UserManagement')
            }
            else {
                return response.redirect('../modules');
            }
        })
        .catch(function (error) {
                // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
                // ...
            errors.push({ msg: errorMessage });
            return response.render('index', {
                errors
            });        
        })
    }
})

router.post('/register', (req, res) => {
    const { fname, lname, designation, contact, email, password, password2 } = req.body;
    let errors = [];

    //Check required feilds
    if (!fname || !lname || !contact || !email || !password || !password2) {
        errors.push({ msg: 'Please fill all the fields' });
    }

    //Check passwords match
    if (password !== password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    //Check passwords length
    if (password.length < 6) {
        errors.push({ msg: "Password should contain atleast six characters" })
    }
    if(!validateEmail(email)){
        errors.push({ msg: 'Invalid Email' });
    }
    if (errors.length > 0) {
        return res.render('./signup', {
            errors,
            fname,
            lname,
            contact,
            email,
            password,
            password2
        });
    }
    else {
        //validation passed
        var approve = false;
        var reject = false;
        var role = 'NA';
        var uref = require('./reference');
        var ref = uref.usersRef;
        var k = 0;
        var flag = 0;
        var keys = Object.keys(userData);
        for (k = 0; k < keys.length; k++) {
            if (!(email.localeCompare(userData.email[k]))) {
                flag = 1;
                errors.push({ msg: "Email id already exists" });
                return res.redirect("./signup", {
                    errors
                });
            }
        }
        if (!flag) {
            var userInfo = {
                fname,
                lname,
                contact,
                email,
                role,
                password,
                approve,
                reject    
            };
            ref.push(userInfo);
            mailer.mailing(email);
            return res.redirect('../');
        }
    }
});

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

module.exports = router