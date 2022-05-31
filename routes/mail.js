const nodemailer = require("nodemailer");
const {google} = require("googleapis");

const CLIENT_ID = `396209215486-238mnuu8scpebu4t03kvrea86fln3pir.apps.googleusercontent.com`;

const CLIENT_SECRET = `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`;
const REDIRECT_URI = `https://developers.google.com/oauthplayground`;
const REFRESH_TOKEN = `1//045Do5BB9Kz5sCgYIARAAGAQSNwF-L9Ir2WHQ-E4s0CuAyL_87XGnQgnARfJTIIXAwSvr5UFZisLJdyBpq0Y-AuMRncSl4wnHX4w//04gm2RsrkA2EJCgYIARAAGAQSNwF-L9IrBTaE-U78P-DMr-Vm0CZpAvKdZnpLflBo03uHgW1vsMz2NpWbwn6pgcLONwJQUzXaHnY//04GLb19rWixdMCgYIAR1//04bf6ZPSVozDVCgYIARAAGAQSNwF-L9IrO4o0ykftbpoPHbivY29Qn5eQVvx1055gtOQySIzmIxVUtmzVqDfXZ8wold4LBNndP94AAGAQSNwF-L9IrfuI9tzbmnG8hkDJk_1F9liLwvSA4PbRfGdFtkj2pmF1A4FMBK4J9ddp1wZASnvIjlow`;

const oauthclient = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oauthclient.setCredentials({refresh_token: REFRESH_TOKEN});

async function sendMail(){ 
    try{
      const access_token = await oauthclient.getAccessToken();
      const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: "OAuth2",
          user:"abhishekpandey8883@gmail.com",
          clientId: CLIENT_ID,
          clientSecret: CLIENT_SECRET,
          refreshToken: REFRESH_TOKEN,
          accessToken: access_token
        }
      })
  
      const mailOpts = {
        from: "abhishekpandey8883@gmail.com",
        to:"abhishekpandey8883@gmail.com" ,
        subject: "Click on below Link to reset your password  ",
        text: "kuch bhi",
        html: "kuch bhi"
      }
  
      const result = await  transport.sendMail(mailOpts);
  
    }
    catch(err){
      return err;
    }
  }

  
  module.exports = sendMail;