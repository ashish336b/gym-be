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
  async forgotPassword(params, req) {
    try {
      const user = await this.model.findOne(params);
      if (!user) {
        return { error: true, message: "cannot find admin with given email" };
      }
      let token = await jwt.sign({ email: params.email }, "12helloworld12", {
        expiresIn: "1h",
      });
      let url = `http://localhost:3000/admin/forgotPassword/${token}`;
      new Mailer().createConnection().sendMail({
        from: "shrijan@gmail.com",
        to: params.email,
        subject: "Password Reset Link",
        html: url,
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
