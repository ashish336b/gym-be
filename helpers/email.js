const mailer = require("nodemailer");

class Mailer {
  /**
   * @author Ashish Bhandari
   * @param {*} host
   * @param {*} port
   * @param {*} secure
   * @param {*} auth
   */
  constructor(host, port, secure, auth) {
    this.host = host || "smtp.mailtrap.io";
    this.port = port || 587;
    this.secure = secure || false;
    this.auth = auth || {
      user: "a7c511953b61cc",
      pass: "09a6b4ab0694f7",
    };
  }
  createConnection() {
    return mailer.createTransport({
      host: this.host,
      port: this.port,
      secure: this.secure,
      auth: this.auth,
    });
  }
  /**
     * @author Ashish Bhandari
     * @param {
        from: 'source Email',
        to: "destination email",
        subject: 'Subject',
        file: 'file to use for templating',
        data: {key : "data to send to templating file"},
    } info 
     */
  async sendMail(info) {
    await this.createConnection().sendMail({
      from: info.from,
      to: info.to,
      subject: info.subject,
      html: info.data,
    });
  }
}

module.exports = Mailer;
