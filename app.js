var express   = require('express'),
 bodyParser   = require('body-parser'),
 exphbs       = require('express-handlebars'),
 path         = require('path'),
 nodemailer   = require('nodemailer');

var app = express();

// View engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set("view engine","ejs");

// Static folder
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(req, res){
  res.render("index");
});

app.post('/send', function(req, res){
  var output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>  
      <li>To: ${req.body.to}</li>
      <li>Subject: ${req.body.subject}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.body}</p>
  `;

  
  var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
    	// sender credentials
        user: 'Your gmail account', 
        pass: 'password'  
    },
    tls:{
      rejectUnauthorized:false
    }
  });

  
  var mailOptions = {
      from: '"Nodemailer Contact" <your gmail account same as above>', // sender address
      to: req.body.to, //email of receiver
      subject: req.body.subject, // Subject of the email
      text: req.body.body, // message of the email
      html: output // html body
  };

  
  transporter.sendMail(mailOptions, function(error, info){
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);   
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  });
  });

app.listen(3000, function(){
    console.log('Server started...');
});