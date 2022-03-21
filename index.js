const express = require("express"); //express 모듈을 가져옴->package.json 파일에서 확인 가능
const app = express(); //function을 이용해서 새로운 express앱을 만듦
const port = 5000; //백 서버로 사용할 포트
const bodyParser = require("body-parser");
const { User } = require("./models/User");

const config = require("./config/key");

//bodyparser 옵션 설정
app.use(bodyParser.urlencoded({ extended: true })); //application/x-www-form-urlencoded
app.use(bodyParser.json()); //application/json

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

app.post("/register", (req, res) => {
  //클라이언트에서 보내주는 정보들을 데이터 베이스에 넣어줌
  //req.body안에는 json 형식으로 정보가 들어 있음
  const user = new User(req.body);
  //몽고 DB에서 오는 메소드
  user.save((err, doc) => {
    //클라이언트에게 에러가 있다고 전달
    //json 형태로
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`)); //포트 5000번으로부터 응답
