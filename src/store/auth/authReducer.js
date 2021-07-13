import { LOGIN, LOGOUT } from "./authTypes";

const initialState = {
  token: '',
  userId: '',
}

const authReducer = (state = initialState, action) => {
  switch(action.type) {

    case LOGIN:
      return {
        token: action.payload.token,
        userId: action.payload.userId
      };
        
    case LOGOUT:
      return {
        token: '',
        userId: ''
      };

    default:
      return state;
    }
}

export default authReducer;