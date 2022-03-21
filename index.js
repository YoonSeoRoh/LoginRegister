const express = require("express"); //express ����� ������->package.json ���Ͽ��� Ȯ�� ����
const app = express(); //function�� �̿��ؼ� ���ο� express���� ����
const port = 5000; //�� ������ ����� ��Ʈ

//mongoose�� �̿��ؼ� ���ø����̼ǰ� ����DB�� ����
const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://yoonseoroh:yoonseoroh@boilerplate.bkw5g.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {
      //������ ���� �ʵ���
      //������ ������ 6.0 �̻��̶�� �� �̻� �������� ����
      //   useNewUrlParser: true,
      //   useUnifiedTopology: true,
      //   useCreateIndex: true,
      //   useFindAndModify: false,
    }
  )
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`)); //��Ʈ 5000�����κ��� ����
