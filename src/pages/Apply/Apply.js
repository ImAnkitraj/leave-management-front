import { Button, LinearProgress } from '@material-ui/core';
import React, { useEffect, useReducer, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Toast from '../../components/Toast/Toast';
import { formReducer, formInitialState } from '../formReducer';
import { toastInitialState, toastReducer } from '../toastReducer';
import classes from './Apply.module.css';
import { leaveValidation } from '../../utils/leaveValidation'
import { BACKEND_URL } from '../../constants';
import axios from 'axios';

function Apply() {

  const history = useHistory(); 
  const [ isLoading, setIsLoading ] = useState(false); //isloading state management
  const [ formState, formDispatch ] = useReducer(formReducer, formInitialState); //form reducer
  const [ toastState, toastDispatch ] = useReducer(toastReducer, toastInitialState); //toast reducer
  const [ comments, setComments ] = useState(''); //commnets state
  const [ isDisabled, setIsDisabled ] = useState(true); //disabled state

  //snackbar close handler for dispatching close snackbar action
  const handleSnackClose = () => {

    //three fields required {message, severity(set it to success for avoiding errors from material-ui componenet), openSnack}
    toastDispatch({
      type:'CLOSE',
      payload:{
        message:'',
        severity: 'success',
        openSnack: false,
      }
    })
  }

  //dispatching on from field change
  const fromChange = (e) => {
    formDispatch({type: 'CHANGE_FROM', payload:{
      from: e.target.value
    }})
  }

  //dispatching on to field change
  const toChange = (e) => {
    formDispatch({type: 'CHANGE_TO', payload:{
      to: e.target.value
    }})
  }

  //handling comments change
  const commentsChange = (e) => {
    setComments(e.target.value)
  }

  //dispatching on type field change
  const typeChange = (e) => {

    formDispatch({
      type: 'CHANGE_TYPE', 
      payload:{
        type: e.target.value
      }
    });

  }

  const applyHandler = (e) => {

    e.preventDefault();

    //validate object is returned from leaveValidation function 
    //with keys as status, message and severity
    const validate = leaveValidation(formState.type, formState.from, formState.to, comments);
    
    //if validation fails return
    if( validate.status === false ) {

      //setting snackbar fields
      toastDispatch({
        type:'OPEN',
        payload:{
          message: validate.message,
          severity: validate.severity,
          openSnack: true,
        }
      });

      return;
    }

    //else request to the backend
    setIsLoading(true);

    //getting userId from localStorage
    const userId = localStorage.getItem('userId');

    //post request to backend endpoint for applying leave
    //send leave object {to, from, duation, comments} with userId in body
    axios.post(BACKEND_URL+'/apply',{
      userId,
      type: formState.type,
      from: formState.from.toString(),
      to: formState.to.toString(),
      duration: formState.duration,
      comments: comments,
    })
    .then((res) => {

      //if response from server is true
      if(res.data.status === true) {

        //setting snackbar fields
        toastDispatch({
          type:'OPEN',
          payload:{
            message: 'Successfully Applied',
            severity: 'success',
            openSnack: true,
          }
        });

        setIsLoading(false);

        //Redirecting to /leave
        history.push('/leave');

      }

      //else throwing errors
      else{

        //throwing error
        throw new Error(res.data.message);
      }
    })
    .catch((err)=>{

      //catching error
      //setting snackbar
      toastDispatch({
        type:'OPEN',
        payload:{
          message: err.message,
          severity: 'error',
          openSnack: true,
        }
      });
    })
    .finally(()=>{
      
      //setting loading as false
      setIsLoading(false);
    })
  }


  useEffect( () => {

    //checking for empty fields and setting button to disabled or active
    if( comments.trim() !== '' && formState.type.trim() !== '' && formState.from.trim() !== '' && formState.to.trim() !== '' ){
      setIsDisabled(false);
    }
    else setIsDisabled(true);

  },[ comments, formState.type, formState.from, formState.to, setIsDisabled ] );

  return (

    <div>

      {/* Header component require title as props */}
      <Header title='Apply for Leave'/>

      {/* Snackbar portal */}
      <Toast open={toastState.openSnack} message={toastState.message} handleClose={handleSnackClose} severity={toastState.severity}/>
      
      {/* Form */}
      <form className={classes.form} onSubmit={applyHandler}>

        {/* Loader */}
        {isLoading && <LinearProgress />}

        <div className={classes.control}>
          <label htmlFor='Leave Type'>Leave Type</label>
          <select value={formState.type} onChange={typeChange}>
            <option disabled value=''>None</option>
            <option value='sick leave'>Sick Leave</option>
            <option value='annual leave'>Annual Leave</option>
            <option value='privilege leave'>Privilege Leave</option>
          </select>
          <p>Type of leave</p>
        </div>
        <div className={classes.control}>
          <label htmlFor='from'>From</label>
          <input value={formState.from} onChange={fromChange} type='date' id='from'/>
        </div>
        <div className={classes.control}>
          <label htmlFor='to'>To</label>
          <input value={formState.to} onChange={toChange} type='date' id='to'/>
        </div>
        <div className={classes.control}>
          <label htmlFor='duration'>Duration </label>
          <input value={formState.duration} type='number' id='duration'disabled/>
          <p>Saturdays and Sundays are not counted</p>
        </div>
        <div className={classes.control}>
          <label htmlFor='comments'>Comments</label>
          <textarea value={comments} onChange={commentsChange} type='text' id='comments'/>
        </div>
        <div className={classes.control}>
          <label htmlFor='status'>Status</label>
          <input value={'pending'} type='text' disabled id='status'/>
          <p>Default pending</p>
        </div>

        {/* Showing active/disabled button */}
        <div className={classes.action}>
          {
            isDisabled ? (
            <Button  type='submit' disabled variant="contained" color="primary">
              Apply
            </Button>
            ):(
            <Button  type='submit' variant="contained" color="primary">
              Apply
            </Button>
            )
          }
        </div>
      </form>
    </div>
  )
}

export default Apply;
