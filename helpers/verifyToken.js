let verifyToken = async (token) => {
  const jwt = require("jsonwebtoken");
  if (typeof token === "undefined") {
    return false;
  }
  let t = token.split(" ")[1];
  try {
    let authData = await jwt.verify(t, "12helloworld12");
    return authData;
  } catch (error) {
    return false;
  }
};
module.exports = verifyToken;
