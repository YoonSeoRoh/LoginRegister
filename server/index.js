const express = require("express"); //express ����� ������->package.json ���Ͽ��� Ȯ�� ����
const app = express(); //function�� �̿��ؼ� ���ο� express���� ����
const port = 5000; //�� ������ ����� ��Ʈ
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { User } = require("./models/User");

const config = require("./config/key");

//bodyparser �ɼ� ����
app.use(bodyParser.urlencoded({ extended: true })); //application/x-www-form-urlencoded
app.use(bodyParser.json()); //application/json

//cookie-parser ���
app.use(cookieParser());

//mongoose�� �̿��ؼ� ���ø����̼ǰ� ����DB�� ����
const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI, {
    //������ ���� �ʵ���
    //������ ������ 6.0 �̻��̶�� �� �̻� �������� ����
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

app.post("/register", (req, res) => {
  //Ŭ���̾�Ʈ���� �����ִ� �������� ������ ���̽��� �־���
  //req.body�ȿ��� json �������� ������ ��� ����
  const user = new User(req.body);
  //���� DB���� ���� �޼ҵ�
  user.save((err, doc) => {
    //Ŭ���̾�Ʈ���� ������ �ִٰ� ����
    //json ���·�
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

app.post("/login", (req, res) => {
  //��û�� �̸����� �����ͺ��̽����� �ִ��� Ȯ��
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSucess: false,
        message: "������ �̸��Ͽ� �ش��ϴ� ������ �������� �ʽ��ϴ�.",
      });
    }
    //��û�� �̸����� �����ͺ��̽��� ������ ��й�ȣ�� �´��� Ȯ��
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          loginSucess: false,
          message: "��й�ȣ�� Ʋ�Ƚ��ϴ�.",
        });
      //�̸��� ��й�ȣ ��� ������ ��ū ����
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        //��ū�� ���� -> ��Ű, ���ý��丮��...
        //��Ű�� ����
        res
          .cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`)); //��Ʈ 5000�����κ��� ����
