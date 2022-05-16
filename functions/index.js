const functions = require('firebase-functions');
const express= require('express')
const app = express()

var admin = require('firebase-admin');
app.set('views','./views')
app.set('view engine','ejs')
app.set('images','../public');
app.use(express.static("images"));
app.set('css','../public');
app.use(express.static("css"));

app.use(express.urlencoded({ extended: false }))
app.use('/',require('./routesAuthentication'))
app.use('/authentication',require('./authentication'))
app.use('/admin',require('./admin'))
app.use('/dataRetrieval',require('./DataRetrival'))
app.listen(3000,()=>{
    console.log("Listening")
})
exports.app = functions.https.onRequest(app);