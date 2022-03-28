const express = require("express"); //express 모듈을 가져옴->package.json 파일에서 확인 가능
const app = express(); //function을 이용해서 새로운 express앱을 만듦
const port = 5000; //백 서버로 사용할 포트
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { User } = require("./models/User");
const { auth } = require("./middleware/auth");
const config = require("./config/key");

//bodyparser 옵션 설정
app.use(bodyParser.urlencoded({ extended: true })); //application/x-www-form-urlencoded
app.use(bodyParser.json()); //application/json->json 형태로 parsing

//cookie-parser 사용
app.use(cookieParser());

//mongoose를 이용해서 어플리케이션과 몽고DB를 연결
const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI, {
    //에러가 뜨지 않도록
    //몽구스 버전이 6.0 이상이라면 더 이상 지원하지 않음
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    //   useCreateIndex: true,
    //   useFindAndModify: false,
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("Hello World!"));

app.get("/api/hello", (req, res) => {
  res.send("Hello!");
});

app.post("/api/users/register", (req, res) => {
  //클라이언트에서 보내주는 정보들을 데이터 베이스에 넣어줌
  //req.body안에는 json 형식으로 정보가 들어 있음
  const user = new User(req.body);
  //몽고 DB에서 오는 메소드
  user.save((err, userInfo) => {
    //클라이언트에게 에러가 있다고 전달
    //json 형태로
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

app.post("/api/users/login", (req, res) => {
  //요청된 이메일을 데이터베이스에서 있는지 확인
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSucess: false,
        message: "제공된 이메일에 해당하는 유저가 존재하지 않습니다.",
      });
    }
    //요청한 이메일이 데이터베이스에 있으면 비밀번호가 맞는지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          loginSucess: false,
          message: "비밀번호가 틀렸습니다.",
        });
      //이메일 비밀번호 모두 맞으면 토큰 생성
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        //토큰을 저장 -> 쿠키, 로컬스토리지...
        //쿠키에 저장
        res
          .cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

app.get("/api/users/auth", auth, (req, res) => {
  //여기까지 미들웨어를 통과해왔다는 것은 authentication이 true라는 말
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

app.get("/api/users/logout", auth, (req, res) => {
  //로그아웃하려는 유저를 데이터베이스에서 찾음
  //토근을 지워줌
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({
      success: true,
    });
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`)); //포트 5000번으로부터 응답
