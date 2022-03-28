import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import LandingPage from "./components/views/LandingPage/LandingPage";
import LoginPage from "./components/views/LoginPage/LoginPage";
import RegisterPage from "./components/views/RegisterPage/RegisterPage";

function App() {
  //null -> 아무나 출입이 가능한 페이지
  //true -> 로그인한 유저만 출입이 가능한 페이지
  //false -> 로그인한 유저는 출입이 불가능한 페이지
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<LandingPage />}></Route>
          <Route exact path="/login" element={<LoginPage />}></Route>
          <Route exact path="/register" element={<RegisterPage />}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
