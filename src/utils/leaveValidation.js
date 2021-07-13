import { getTodaysDate } from './getTodaysDate'

export const leaveValidation = (type, from, to, comments) => {

  //getting todats date
  let today = getTodaysDate();

  //if type is empty string
  if( type.trim() === '' ) {
    return {
      status: false,
      message: 'Required type of leave',
      severity: 'error',
    }
  }

  // if from or to is empty
  if( from.trim() === '' || to.trim() === '' ) {
    return {
      status: false,
      message: 'Date range is required',
      severity: 'error',
    }
  }

  //if from or to is lessa than today
  if( from < today || to < today ) {
    return {
      status: false,
      message: 'To date and from date must be greater than equal to today\'s date',
      severity: 'error',
    }
  }

  //if from > to
  if( from > to ) {
    return {
      status: false,
      message: 'To date must be greater than equal to from',
      severity: 'error',
    }
  }

  //if comments is empty string
  if(comments.trim() === '') {
    return {
      status: false,
      message: 'Required comments',
      severity: 'error',
    }
  }
  
  return {
    status: true,
  }
  
}