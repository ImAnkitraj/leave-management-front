import { LOGIN, LOGOUT } from "./authTypes";

export const login = ( token, userId ) => {
  return{
    type: LOGIN,
    payload: { token, userId },
  }
}


export const logout = () => {
  return {
    type: LOGOUT,
  }
}