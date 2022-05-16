var reference = require('./reference');
var ref = reference.usersRef;
ref.on('value', gotData, errData);


var fname1 = [];
var lname1 = [];
var email1 = [];
var password1 = [];
var contact1 = [];
var roles1 = [];
var approve1 = [];
var reject1 = [];
var admin1 = [];

function gotData(data) {
    var userData = data.val();
    if(userData)
    {
        var keys = Object.keys(userData);
        for (var i = 0; i < keys.length; i++) {
            var k = keys[i];
            fname1[i] = userData[k].fname;
            lname1[i] = userData[k].lname;
            email1[i] = userData[k].email;
            password1[i] = userData[k].password;
            roles1[i] = userData[k].role;
            contact1[i] = userData[k].contact;
            approve1[i] = userData[k].approve;
            reject1[i] = userData[k].reject;    
            admin1[i] = userData[k].admin;
        }
    }
}

function errData(err) {
    console.log(err);
}

var usersData = {
    fname : fname1,
    lname : lname1 ,
    contact : contact1,
    email : email1,
    password : password1,
    role : roles1,
    approve : approve1,
    reject : reject1,
    admin : admin1
}

if(usersData)
{
    module.exports = usersData;
}
