import { combineReducers } from "redux";
import authReducer from "./auth/authReducer";
import modalReducer from "./modal/modalReducer";

const rootReducer = combineReducers({
  auth: authReducer, 
  modal: modalReducer,
});

export default rootReducer;