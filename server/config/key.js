if (process.env.NODE_ENV === "production") {
  //���� ��
  module.exports = require("./prod");
} else {
  //���� ���� ȯ��
  module.exports = require("./dev");
}
