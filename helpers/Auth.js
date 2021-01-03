const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Mailer = require("../helpers/email");
class Auth {
  constructor(model) {
    this.model = model;
  }

  async login(params, req) {
    const user = await this.model.findOne(params);
    if (!user) {
      return false;
    }
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return false;
    }
    user.password = null;
    let token = await jwt.sign({ user: user }, "12helloworld12", {
      expiresIn: "12h",
    });
    return token;
  }
  async register(req) {
    try {
      req.body.password = bcrypt.hashSync(
        req.body.password,
        bcrypt.genSaltSync(10)
      );
      let model = this.model;
      await new model(req.body).save();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async forgotPassword(params, url, req) {
    try {
      const user = await this.model.findOne(params);
      if (!user) {
        return { error: true, message: "cannot find admin with given email" };
      }
      let token = await jwt.sign({ email: params.email }, "12helloworld12", {
        expiresIn: "1h",
      });
      url = `${url}/${token}`;
      let html = `<!doctype html>
      <html>
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        </head>
        <body style="font-family: sans-serif;">
          <div style="display: block; margin: auto; max-width: 600px;" class="main">
            <h1 style="font-size: 18px; font-weight: bold; margin-top: 20px">Shrijan Malakar Fitness House</h1>
            <p>Your token is:</p>
            
            <a href="${url}">Reset Link</a>
            <h1 style="color : red">Warning! Remember Not to share this token</h1>
          </div>
          <!-- Example of invalid for email html/css, will be detected by Mailtrap: -->
          <style>
            .main { background-color: white; }
            a:hover { border-left-width: 1em; min-height: 2em; }
          </style>
        </body>
      </html>`;
      new Mailer().createConnection().sendMail({
        from: "shrijan@gmail.com",
        to: params.email,
        subject: "Password Reset Link",
        html: html,
      });
      return {
        error: null,
        message: "forgot password token is sent to your email",
      };
    } catch (error) {
      throw error;
    }
  }
  async updatePassword(params, req) {
    try {
      let data = await jwt.verify(params.token, "12helloworld12");
      if (!data) {
        return { error: true, message: "Token expired" };
      }
      let user = await this.model.findOne({
        email: data.email,
        isDeleted: false,
      });
      if (!user) {
        return false;
      }
      if (!req.body.password && !req.body.confirmPassword) {
        return {
          error: true,
          message: "Please provide password and confirmPassword",
        };
      }
      if (req.body.password !== req.body.confirmPassword) {
        return false;
      }
      req.body.password = bcrypt.hashSync(
        req.body.password,
        bcrypt.genSaltSync(10)
      );
      user.password = req.body.password;
      await user.save();
      return { error: null, message: "Success" };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Auth;
