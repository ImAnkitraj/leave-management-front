import { CLOSE_MODAL, OPEN_MODAL } from "./modalTypes";

const initialState = {
  leave: {},
  open: false,
}

const modalReducer = ( state = initialState, action ) => {

  switch( action.type ) {
    case OPEN_MODAL:
      return {
        leave: action.payload.leave,
        open: true,
      }
        
    case CLOSE_MODAL:
      return {
        leave: {},
        open: false,
     }

    default:
      return state;

  }
}

export default modalReducer;