if (process.env.NODE_ENV === "production") {
  //배포 후
  module.exports = require("./prod");
} else {
  //로컬 개발 환경
  module.exports = require("./dev");
}
