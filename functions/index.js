const functions = require("firebase-functions");
const nodemailer = require("nodemailer");


const fs = require("fs");
const path = require('path');

const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailEmail,
    pass: gmailPassword
  }
});

exports.makerFxn = functions.database
  .ref("/maker/{id}")
  .onCreate((snapshot, context) => {
    // Grab the current value of what was written to the Realtime Database.
    const makers = snapshot.val();
    console.log(makers.name);
    console.log(makers.email);

    const makerID = context.params.id;

    // return snapshot.ref.parent.parent.child('confMaker')
    // .child(makerID).child(makers.name).set(makers.stamp);

    //firebase functions:config:set gmail.email=aks28id2@gmail.com gmail.password=bks.ska.01
    //To set email and password

    //To view the seted email and pass firebase functions:config:get

    sendEmail(makers, makerID);

    return null;
  });

function sendEmail(makers, makerID) {

  //http://www.google.com/accounts/DisplayUnlockCaptcha
  //This link is important to enable accesss to google account

  var UNIQUE_NAME = makers.name;
  var UNIQUE_ID = makerID;
  var UNIQUE_QR = `https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=${makerID}`
  

  var filePath = path.join(__dirname, 'templates/email.html');

  fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
    data = data.toString();
    data = data.replace(/##UNIQUE_NAME/g, UNIQUE_NAME);
    data = data.replace(/##UNIQUE_ID/g, UNIQUE_ID);
    data = data.replace(/##UNIQUE_QR/g, UNIQUE_QR);


    var mailOptions = {
        from: '"Aks Corp." <noreply@firebase.com>', // sender address 
        to: makers.email, // list of receivers 
        subject: 'Test email for makerFest', // Subject line 
        html: data // html body
    };


  // const mailOptions = {
  //   from: '"Aks Corp." <noreply@firebase.com>',
  //   to: makers.email,
  // };
  // // Building Email message.
  // mailOptions.subject = "Thanks and Welcome!";
  // mailOptions.text =
  // "Thanks you for subscribing to our newsletter. You will receive our next weekly newsletter.";

  

  try {
    mailTransport.sendMail(mailOptions);
  } catch(error) {
    console.error('There was an error while sending the email:', error);
  }


  return console.log(
    `Sendind mail to ${makers.name} with stamp ${makers.stamp}`
  );
  }); 
}

//To deploy firebase deploy --only functions:makerFxn
