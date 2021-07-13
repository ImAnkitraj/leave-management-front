
//initail state
export const toastInitialState = {
  message:'',
  severity:'success',
  openSnack:false,
};

export function toastReducer(state, action) {
  switch (action.type) {
    case 'OPEN':
      return {
        message: action.payload.message,
        severity: action.payload.severity,
        openSnack: action.payload.openSnack,
      };
    case 'CLOSE':
      return {
        message: '',
        severity: 'success',
        openSnack: action.payload.openSnack,
      };
    default:
      return {
        ...state
      }
  }
}