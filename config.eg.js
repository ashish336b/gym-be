module.exports = {
  mongoURI: "mongodb://localhost:27017/gym-be",
  port: 3000,
  baseUrl: `http://localhost:3000`,
  isDev: true,
  paypal: {
    mode: "sandbox", //sandbox or live
    client_id:
      "AVXxWZaYTznAA4bFDUjZBolgt_G_j2JN6DRYkp5xCpXLXAnsGl_YSWEp1aG52RiP_VmebIQTyYHqBtDR",
    client_secret:
      "ED_OMQI3hnGNeGGgKyRTAOMreL-Q6-QisAALUSMSlH059sO1LO02tUvmn-nQhoXFsJE0M4vfkJTJdAqk",
  },
};
