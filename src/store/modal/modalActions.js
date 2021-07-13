import { OPEN_MODAL, CLOSE_MODAL } from "./modalTypes";

export const openModal = ( leave ) => {

  return {
    type: OPEN_MODAL,
    payload: { leave },
  }

}

export const closeModal = () => {

  return {
    type: CLOSE_MODAL,
    payload: {},
  }

}


