module.exports = {
  mailing: function (email) {
    const nodemailer = require("nodemailer");  
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
        to: 'remonet.shalaka@gmail.com', // list of receivers
        subject: "Request for user registration", // Subject line
        text: `User email : `+email+`\n Requesting for approval!!!`, // plain text body
        html: "<a href='https://remonet-70172.firebaseapp.com/userManagement'>Verify</a> " // html body
      };
      
        // send mail with defined transport object
      transporter.sendMail(mailOptions, function (err, info) {
        if(err)
          console.log()
        else
          console.log(info);
      });  
    }
}


