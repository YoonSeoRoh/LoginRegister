import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { auth } from "../_actions/user_action";
import { useNavigate } from "react-router-dom";

export default function foo(SpecificComponent, option, adminRoute = null) {
  function AuthenticationCheck(props) {
    //null -> 아무나 출입이 가능한 페이지
    //true -> 로그인한 유저만 출입이 가능한 페이지
    //false -> 로그인한 유저는 출입이 불가능한 페이지
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
      dispatch(auth()).then((response) => {
        if (!response.payload.isAuth) {
          //로그인하지 않은 상태
          if (option) {
            //로그인한 유저만 출입이 가능한 페이지일 경우
            //로그인 페이지로 밀어냄
            navigate("/login");
          }
        } else {
          //로그인한 상태
          if (adminRoute && response.payload.isAdmin) {
            navigate("/");
          } else {
            //로그인한 유저가 출입이 불가능한 페이지일 경우
            if (option === false) {
              navigate("/");
            }
          }
        }
      });
    });
    return <SpecificComponent />;
  }
  return AuthenticationCheck;
}
