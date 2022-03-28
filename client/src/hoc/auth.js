import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { auth } from "../_actions/user_action";

export default function foo(SpecificComponent, option, adminRoute = null) {
  function AuthenticationCheck(props) {
    const dispatch = useDispatch();
    useEffect(() => {
      dispatch(auth()).then((response) => {});
    }, []);
    return <SpecificComponent />;
  }
  return AuthenticationCheck;
}
