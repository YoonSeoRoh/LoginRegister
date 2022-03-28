import { combineReducers } from "redux"; //여러개의 리듀서를 root 리듀서에 합쳐줌
import user from "./user_reducer";

const rootReducer = combineReducers({
  user,
});

export default rootReducer;
