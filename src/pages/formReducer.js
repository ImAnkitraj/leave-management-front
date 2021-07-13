import { getTodaysDate } from "../utils/getTodaysDate";
import { workingDaysBetweenDates } from '../utils/duration';

//initail state
export const formInitialState = {
  type:'',
  to: getTodaysDate(),
  from: getTodaysDate(),
  duration: 1,
  status:'pending', 
}

export const formReducer = (state, action) => {

  //action
  switch(action.type){
    case 'CHANGE_TYPE':{
      return{
        ...state,
        type: action.payload.type,
      };
    }
    
    //calculating duartion when from changes
    case 'CHANGE_FROM':{
      return{
        ...state,
        duration: workingDaysBetweenDates( action.payload.from, state.to ),
        from: action.payload.from,
      };
    }
      
    //calculating duartion when to changes
    case 'CHANGE_TO':{
      return{
        ...state,
        duration: workingDaysBetweenDates(state.from, action.payload.to),
        to: action.payload.to,
      };
    }
      
    default:{
      return {...state};
    }
  }
}