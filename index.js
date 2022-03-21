const express = require("express"); //express 모듈을 가져옴->package.json 파일에서 확인 가능
const app = express(); //function을 이용해서 새로운 express앱을 만듦
const port = 5000; //백 서버로 사용할 포트

//mongoose를 이용해서 어플리케이션과 몽고DB를 연결
const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://yoonseoroh:yoonseoroh@boilerplate.bkw5g.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {
      //에러가 뜨지 않도록
      //몽구스 버전이 6.0 이상이라면 더 이상 지원하지 않음
      //   useNewUrlParser: true,
      //   useUnifiedTopology: true,
      //   useCreateIndex: true,
      //   useFindAndModify: false,
    }
  )
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`)); //포트 5000번으로부터 응답
