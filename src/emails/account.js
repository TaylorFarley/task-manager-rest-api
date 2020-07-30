
const sgMail = require('@sendgrid/mail')



sgMail.setApiKey(process.env.sendgridAPIKey)

const sendWelcomeEmail = (email,name)=>{
  msg = {
    to: email,
    from: 'twfarley88@gmail.com',
    subject: 'Welcome!',
    text: 'regular text',
    html: `welcome SIR mr ${name}`,
  };
  sgMail.send(msg);
}

const pleasedont = (email,name)=>{
  msg = {
    to: email,
    from: 'twfarley88@gmail.com',
    subject: 'GoodBye :(',
    text: 'regular text',
    html: `please dont go ${name}`,
  };
  sgMail.send(msg);

}

module.exports = {
  sendWelcomeEmail,
  pleasedont
}