const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');



const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "dc40558be1212f",
      pass: "d4fde857ed0cb1"
    }
  });

  transport.use('compile', hbs({
      viewEngine: 'handlebars',
      viewPath: Path2D.resolve('./src/mail/'),
      extName: '.html',
  }));

  module.exports = transport;