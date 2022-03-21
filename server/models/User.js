const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    naxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

//save�ϱ� ��
userSchema.pre("save", function (next) {
  var user = this;
  //next�� ���� �ൿ
  //��й�ȣ�� ��ȣȭ
  if (user.isModified("password")) {
    //��й�ȣ�� ��ȯ�ɶ���
    //�̷������� ������ �ٸ� ������ ��й�ȣ�� �����ϰ� �ٲܶ����� ��� ��ȣȭ�Ǳ� ����!
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  //plainPassword�� ��ȣȭ�� ��й�ȣ�� ������ Ȯ��
  //��ȣȭ�� �� ���� ������ plainPassword�� ��ȣȭ�Ͽ� ������ Ȯ��
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err), cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function (cb) {
  //jsonwebtoken�� �̿��ؼ� token�� �����ϱ�
  var user = this;
  jwt.sign(user._id.toHexString(), "secretToken");
  user.token = token;
  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
