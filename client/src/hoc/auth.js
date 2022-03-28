import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { auth } from "../_actions/user_action";
import { useNavigate } from "react-router-dom";

export default function foo(SpecificComponent, option, adminRoute = null) {
  function AuthenticationCheck(props) {
    //null -> �ƹ��� ������ ������ ������
    //true -> �α����� ������ ������ ������ ������
    //false -> �α����� ������ ������ �Ұ����� ������
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
      dispatch(auth()).then((response) => {
        if (!response.payload.isAuth) {
          //�α������� ���� ����
          if (option) {
            //�α����� ������ ������ ������ �������� ���
            //�α��� �������� �о
            navigate("/login");
          }
        } else {
          //�α����� ����
          if (adminRoute && response.payload.isAdmin) {
            navigate("/");
          } else {
            //�α����� ������ ������ �Ұ����� �������� ���
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
