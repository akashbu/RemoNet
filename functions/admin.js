const express = require('express')
const router = express.Router()
var firebase2 = require('firebase')
const firebase = require('./configuration')
const userData = require('./UserData')
var admin = require('firebase-admin')
const nodemailer = require("nodemailer")

var config = {
	apiKey: "AIzaSyD8adTF-SWhIvmzCcFzwv3gEHe2CmOk3rg",
	authDomain: "remonet-f20c4.firebaseapp.com",
	databaseURL: "https://remonet-f20c4.firebaseio.com",
}

var secondaryApp = firebase2.initializeApp(config, "Secondary")

router.get('/UserManagement',(request,response)=>{
    firebase.auth().onAuthStateChanged(function(user){
        if(user){
            for(var i in userData.email){
                if(userData.email[i] == user.email){
                            break
                }
            }
            if(!(user.email.localeCompare('remonet.shalaka@gmail.com')) || userData.admin[i] ==true){
                return response.render('management',{userData})
            }
            else{
                return response.redirect('../../modules')
            }
        }
        else{
            console.log("user not present")
            return response.redirect('../../')
        }
    })
})

router.get('/userDetails',(request,response)=>{
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            for(var i in userData.email){
                if(userData.email[i] == user.email){
                            break
                }
            }
            if(!(user.email.localeCompare('remonet.shalaka@gmail.com')) || userData.admin[i] ==true){
                var email = request.query.email
                console.log(email)
                var i=0
                var keys = Object.keys(userData)
                for (i = 0; i < keys.length; i++) {
                    console.log("db : "+ userData.email[i])
                    if (!(email.localeCompare(userData.email[i]))) {
                        flag =1
                        var data = {
                            fname   : userData.fname[i],
                            lname   : userData.lname[i],
                            email   : userData.email[i],
                            roles   : userData.role[i],
                            contact : userData.contact[i],
                            approve : userData.approve[i],
                            reject  : userData.reject[i],
                            admin : userData.admin[i]
                        }
                        return response.render('userDetails',{
                            data 
                        })
                    }    
                }
                if(!flag){
                    return response.redirect('UserManagement')
                }
            }
            else{
                return response.redirect('../../modules')
            }
        }
        else{
            return response.redirect('../../')
        }
    })
})

router.get('/Approve',(request,response)=>{
    firebase.auth().onAuthStateChanged(function(user){
        if(user){
            for(var i in userData.email){
                if(userData.email[i] == user.email){
                            break
                }
            }
            if(!(user.email.localeCompare('remonet.shalaka@gmail.com')) || userData.admin[i] ==true){
                console.log("ok")
                var email = request.query.email
                var role = request.query.roles
                var adm =request.query.admin
                var temp = role.split(/,/)
                var roles =''
                for(i in temp){
                    roles = roles.concat(temp[i])
                    roles =roles.concat('#')
                }
                var password
                var flag = 0
                var keys = Object.keys(userData)
                console.log("email : " + email)
                for (k = 0; k < keys.length; k++) {
                    if ((!(email.localeCompare(userData.email[k]))) && userData.approve[k]===false) {
                        password = userData.password[k]
                        flag = 1
                        break
                    }
                }
                if (flag) {
                    var reference = require('./reference')
                    var db = admin.database()
                    var refer = reference.usersRef
                    refer.once('value', gotData, errData)
                    function gotData(data) {
                        var userData = data.val()
                        if (userData) {
                            var keys = Object.keys(userData)
                            var newPostKey = keys[k]; //particular key for user detail.
                            console.log("The key is : " + newPostKey)
                            if(adm == 'false'){
                                adm = false
                            }
                            else{
                                adm=true
                            }
                            db.ref("UserDetails/"+newPostKey).update({approve : true,reject : false,role : roles,admin:adm})
                            secondaryApp.auth().createUserWithEmailAndPassword(email, password)
                            .then(function(firebaseUser) {
                                console.log("User " + firebaseUser.uid + " created successfully!");
                                secondaryApp.auth().signOut();
                                admin.auth().getUserByEmail(email)
                                .then(function (userRecord) {
                                    var userId = userRecord.uid;
                                    console.log('Successfully fetched user data:', userRecord.toJSON());
                                    admin.auth().updateUser(userId, {
                                        disabled: false
                                    })
                                }) 
                                .catch(function(err){
                                    console.log(err)
                                    response.redirect('/UserManagement')
                                })
                                      // create reusable transporter object using the default SMTP transport
                                let transporter = nodemailer.createTransport({
                                        service: 'gmail', // true for 465, false for other ports
                                        auth: {
                                            user: 'remonet.shalaka@gmail.com', // generated ethereal user
                                            pass: 'ReMo@Shalaka2019' // generated ethereal password
                                        }
                                });
                                      // setup email data with unicode symbols
                                let mailOptions = {
                                    from: 'remonet.shalaka@gmail.com', // sender address
                                    to: email, // list of receivers
                                    subject: "Login Approval", // Subject line
                                    text: `User email : `+email+`\n  approved!!!`, // plain text body
                                    html: "<a href='https://remonet-70172.firebaseapp.com/'>Login</a> " // html body
                                };
                                      // send mail with defined transport object
                                transporter.sendMail(mailOptions, function (err, info) {
                                    if(err)
                                        console.log()
                                    else
                                        console.log(info);
                                });
                                return response.redirect('./userDetails?email='+email)
                            });
                        }
                    }
                    function errData(err) {
                        console.log(err);
                        return response.redirect('./UserManagement')
                    }
                }
                else{
                    console.log("Data not found")
                    return response.redirect('./UserManagement')
                }
            }
            else{
                return response.redirect('../../modules')
            }
        }
        else{
            return response.redirect('../../')
        }
    })
})

router.get('/Reject',(request,response)=>{
    firebase.auth().onAuthStateChanged(function(user){
        if(user){
            for(var i in userData.email){
                if(userData.email[i] == user.email){
                            break
                }
            }
            if(!(user.email.localeCompare('remonet.shalaka@gmail.com')) || userData.admin[i] ==true){
                console.log("ok")
                var password
                var flag = 0
                var keys = Object.keys(userData)
                var email = request.query.email
                for (var k = 0; k < keys.length; k++) {
                    if (!(email.localeCompare(userData.email[k])) && userData.approve[k]===false && userData.reject[k] === false) {
                        flag = 1
                        break
                    }
                }
                if (flag) {
                    var reference = require('./reference')
                    var db = admin.database()
                    var refer = reference.usersRef
                    refer.once('value', gotData, errData)
                    function gotData(data) {
                        var userData = data.val()
                        if (userData) {
                            var keys = Object.keys(userData)
                            var newPostKey = keys[k]; //particular key for user detail.
                            console.log("The key is : " + newPostKey)
                            db.ref("UserDetails/"+newPostKey).update({reject : true})
                            
                            let transporter = nodemailer.createTransport({
                                service: 'gmail', // true for 465, false for other ports
                                auth: {
                                    user: 'remonet.shalaka@gmail.com', // generated ethereal user
                                    pass: 'ReMo@Shalaka2019' // generated ethereal password
                                }
                            });
                            
                              // setup email data with unicode symbols
                            let mailOptions = {
                                from: 'remonet.shalaka@gmail.com', // sender address
                                to: email, // list of receivers
                                subject: "Verification Denied", // Subject line
                                text: `User email : `+email+`\n  User Verification Denied. Contact your admin for more details.`, // plain text body
                            };
                            
                              // send mail with defined transport object
                            transporter.sendMail(mailOptions, function (err, info) {
                                if(err)
                                   console.log()
                                else
                                  console.log(info);
                            });
                            return response.redirect('./userDetails?email='+email)
                        }
                    }
                    function errData(err) {
                        console.log(err);
                        return response.redirect('./userDetails?email='+email)
                    }
                }
                else{
                    console.log("Data not found")
                    return response.redirect('./UserManagement')
                }
            }
            else{
                return response.redirect('../../modules')
            }
        }
        else{
            return response.redirect('../../')
        }
    })
})

router.get('/Deactivate',(request,response)=>{
    firebase.auth().onAuthStateChanged(function(user){
        if(user){
            for(var i in userData.email){
                if(userData.email[i] == user.email){
                            break
                }
            }
            if(!(user.email.localeCompare('remonet.shalaka@gmail.com'))|| userData.admin[i]==true){
                console.log("ok")
                var email = request.query.email
                var flag = 0
                var keys = Object.keys(userData)
                for (var k = 0; k < keys.length; k++) {
                    if (!(email.localeCompare(userData.email[k])) && userData.approve[k]===true && userData.reject[k] === false) {
                        flag = 1
                        break
                    }
                }
                if (flag) {
                    var reference = require('./reference')
                    var db = admin.database()
                    var refer = reference.usersRef
                    refer.once('value', gotData, errData)
                    function gotData(data) {
                        var userData = data.val()
                        if (userData) {
                            var keys = Object.keys(userData)
                            var newPostKey = keys[k]; //particular key for user detail.
                            console.log("The key is : " + newPostKey)
                            db.ref("UserDetails/"+newPostKey).update({reject : true})
                            admin.auth().getUserByEmail(email)
                            .then(function (userRecord) {
                                // See the UserRecord reference doc for the contents of userRecord.
                                var userId = userRecord.uid;
                                console.log('Successfully fetched user data:', userRecord.toJSON());
                                admin.auth().updateUser(userId, {
                                    disabled: true
                                })
                            }) 
                            let transporter = nodemailer.createTransport({
                                service: 'gmail', // true for 465, false for other ports
                                auth: {
                                    user: 'remonet.shalaka@gmail.com', // generated ethereal user
                                    pass: 'ReMo@Shalaka2019' // generated ethereal password
                                }
                            });
                            
                              // setup email data with unicode symbols
                            let mailOptions = {
                                from: 'remonet.shalaka@gmail.com', // sender address
                                to: email, // list of receivers
                                subject: "Acount Deactivation", // Subject line
                                text: `User email : `+email+`\n  Account has be deactivated. Contact your admin for more details`, // plain text body
                            };
                            
                              // send mail with defined transport object
                            transporter.sendMail(mailOptions, function (err, info) {
                                if(err)
                                   console.log()
                                else
                                  console.log(info);
                            });
                            return response.redirect('./userDetails?email='+email)
                        }
                    }
                    function errData(err) {
                        console.log(err);
                        return response.redirect('./UserManagement')
                    }
                    
                }
                else{
                    console.log("Data not found")
                    return response.redirect('./UserManagement')
                }
            }
            else{
                return response.redirect('../../modules')
            }
        }
        else{
            return response.redirect('../../')
        }
    })
})

router.get('/Activate',(request,response)=>{
    firebase.auth().onAuthStateChanged(function(user){
        if(user){
            for(var i in userData.email){
                if(userData.email[i] == user.email){
                            break
                }
            }
            if(!(user.email.localeCompare('remonet.shalaka@gmail.com'))|| userData.admin[i] == true){
                console.log("ok")
                var email = request.query.email
                var role = request.query.roles
                var adm = request.query.admin
                var temp = role.split(/,/)
                var roles =''
                for(i in temp){
                    roles = roles.concat(temp[i])
                    roles =roles.concat('#')
                }
                console.log(roles)
                var password
                var flag = 0
                var keys = Object.keys(userData)
                console.log("email : " + email)
                for (var k = 0; k < keys.length; k++) {
                    if (!(email.localeCompare(userData.email[k])) && userData.approve[k]===true && userData.reject[k] === true ) {
                        password = userData.password[k]
                        flag = 1
                        break
                    }
                }
                if (flag) {
                    var reference = require('./reference')
                    var db = admin.database()
                    var refer = reference.usersRef
                    refer.once('value', gotData, errData)
                    function gotData(data) {
                        var userData = data.val()
                        if (userData) {
                            var keys = Object.keys(userData)
                            var newPostKey = keys[k]; //particular key for user detail.
                            console.log("The key is : " + newPostKey)
                            if(adm == 'false'){
                                adm = false
                            }
                            else{
                                adm = true
                            }
                            db.ref("UserDetails/"+newPostKey).update({reject : false,role : roles,admin:adm})
                            admin.auth().getUserByEmail(email)
                            .then(function (userRecord) {
                                // See the UserRecord reference doc for the contents of userRecord.
                                var userId = userRecord.uid;
                                console.log('Successfully fetched user data:', userRecord.toJSON());
                                admin.auth().updateUser(userId, {
                                    disabled: false
                                })
                            }) 
                                      // create reusable transporter object using the default SMTP transport
                            let transporter = nodemailer.createTransport({
                                service: 'gmail', // true for 465, false for other ports
                                auth: {
                                    user: 'remonet.shalaka@gmail.com', // generated ethereal user
                                    pass: 'ReMo@Shalaka2019' // generated ethereal password
                                }
                            });
                                      // setup email data with unicode symbols
                            let mailOptions = {
                                from: 'remonet.shalaka@gmail.com', // sender address
                                to: email, // list of receivers
                                subject: "Login Approval", // Subject line
                                text: `User email : `+email+`\n  approved!!!`, // plain text body
                                html: "<a href='https://remonet-70172.firebaseapp.com/'>Login</a> " // html body
                            };
                                      // send mail with defined transport object
                            transporter.sendMail(mailOptions, function (err, info) {
                                if(err)
                                   console.log()
                                else
                                    console.log(info);
                            });
                            return response.redirect('./userDetails?email='+email)
                        }
                    }
                    function errData(err) {
                        console.log(err);
                        return response.redirect('./UserManagement')
                    }
                }
                else{
                    console.log("Data not found")
                    return response.redirect('./UserManagement')
                }
            }
            else{
                return response.redirect('../../modules')
            }
        }
        else{
            return response.redirect('../../')
        }
    })
})

module.exports = router