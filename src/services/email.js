var nodemailer = require('nodemailer');

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.sendGridAPIKey)

const sendEmail = (type, data) => {
  console.log(type,data)
  if (type == 'CREATE_LEAD') {
    msg = {
      to: "contact@webscooby.com", // Change to your recipient
      // cc: "admin@webscooby.com",
      from: process.env.senderEmail, // Change to your verified sender
      subject: 'New Lead Detected',
      html: `<!DOCTYPE html>
      <html lang="en">
      
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Raleway:ital,wght@1,100;1,600&display=swap" rel="stylesheet">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Raleway:ital,wght@1,100;1,600&display=swap" rel="stylesheet">
        <title>Craft Center</title>
      </head>
      
      <body style="margin: 0; padding: 0;">
        <table align="center" cellpadding="0" cellspacing="0" border="0" width="700"
          style="table-layout: fixed;padding: 25px 0;">
          <tbody>
            <tr align="center">
            <td>
            <a href="#"><img src='https://webscooby.com/assets/logo/logo.png' height='80' width='200'></img></a>
            </td>
            </tr>
            <tr>
              <td height="20"></td>
            </tr>
            <tr align="center">
              <td style="font-size: 28px; color: #000;font-family: 'Raleway', sans-serif;font-weight: 600;">New Lead Detected!</td>
            </tr>
            <tr align="center">
              <td style="font-size: 14px; color: #000;font-family: 'Raleway', sans-serif;padding: 10px 0px;font-weight: 600;">
              Lead FName: ${data.fname?data.fname:'-'}, Lead LName: ${data.lname?data.lname:'-'}
              Lead Country: ${data.country?data.country:'-'}, Lead Message: ${data.message?data.message:'-'}
              Lead Email: ${data.email?data.email:'-'},
              </td>
            </tr>
            <tr>
              <td height="40"></td>
            </tr>
          </tbody>
        </table>
      </body>
      
      </html>`
    }
  }

  sgMail
    .send(msg)
    .then((response) => {
      console.log('response',response)
      console.log(response[0].statusCode)
      console.log(response[0].headers)
    })
    .catch((error) => {
      console.error(error)
    })
}
module.exports = { sendEmail }
