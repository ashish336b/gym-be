const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
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
}

module.exports = Auth;
