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

//save하기 전
userSchema.pre("save", function (next) {
  var user = this;
  //next는 다음 행동
  //비밀번호를 암호화
  if (user.isModified("password")) {
    //비밀번호가 변환될때만
    //이렇게하지 않으면 다른 정보를 비밀번호를 제외하고 바꿀때마다 계속 암호화되기 때문!
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
  //plainPassword와 암호화된 비밀번호가 같은지 확인
  //복호화할 수 없기 때문에 plainPassword를 암호화하여 같은지 확인
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err), cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function (cb) {
  //jsonwebtoken을 이용해서 token을 생성하기
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
