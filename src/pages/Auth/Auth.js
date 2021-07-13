import React,{useCallback, useReducer, useState} from 'react';
import classes from './Auth.module.css';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { LinearProgress} from '@material-ui/core';
import Toast from '../../components/Toast/Toast';
import { validateCredentials } from '../../utils/validation';
import { BACKEND_URL } from '../../constants';
import { toastReducer, toastInitialState } from '../toastReducer';
import { useDispatch } from 'react-redux';
import { login } from '../../store/auth/authActions';
import { useCookies } from 'react-cookie';

function Auth() {

  const [, setCookies ] = useCookies( [ 'auth' ] );

  const dispatch = useDispatch(); //redux dispatch
  const history = useHistory(); //history
  const [ username, setUsername ] = useState( '' ); //username state
  const [ password, setPassword ] = useState( '' ); // password state
  const [ toastState, toastDispatch ] = useReducer( toastReducer, toastInitialState ); //toastReducer
  const [ isLoading, setIsLoading ] = useState( false ); //loading state

  //userame change handler
  const changeUsername = (e) => {
    setUsername(e.target.value)
  }

    //password change handler
  const changePassword = (e) => {
    setPassword(e.target.value)
  }

  //snackbar close handler
  const handleSnackClose = () => {

    //dispatch close action to toast reducer
    //require three fields {message, severity (set it to success as default for avoiding any errors from material ui)and openSnack}
    toastDispatch({type:'CLOSE', payload:{
        message: '',
        severity: 'success',
        openSnack: false,
    }});
  }

  //submit form handler
  //using useCallback to memoize the function definition
  const submitHandler = useCallback((e) => {

    e.preventDefault();

    // validation 
    // it returns an object with fields as status, severity and message
    // Eg {
          // status: false/true,
          // message: some Text,
          // severity: error/warning/success
    // }
    const validate = validateCredentials(username, password);

    //if validation is false then return
    if(!validate.status){

      //dispatching open snack action
      //type = 'OPEN'
      //payload = {
      //   message: some text,
      //   severity: success/error/warning,
      //   openSnack: true,
      // }
      toastDispatch({type: 'OPEN', payload:{
        message: validate.message,
        severity: validate.severity,
        openSnack: true,
      }})

      //returning from function
      return;
    }

    //else send request to backend
    setIsLoading(true);

    //hitting endpoint
    axios.post(BACKEND_URL+'/login',{
      username: username,
      password: password,
    })
    .then((res)=>{
      if(res.data.status === true){

        //getting token and userId from response
        const token = res.data.token;
        const userId = res.data.user._id;

        //storing in Cookies
        setCookies('token', token);
        setCookies('userId', userId);

        //dispatching login
        dispatch(login(token, userId));

        //loading as false
        setIsLoading(false);

        //redirecting to /leave
        history.push('/leave');
      }
      else{

        //throw error
        throw new Error(res.data.message);
      }
    })
    .catch(err=>{

      //catching error and display in snackbar
      setIsLoading(false);

      //dispatching open snack action
      //Eg : type = 'OPEN'
      //Eg : payload = {
      //   message: some text,
      //   severity: success/error/warning,
      //   openSnack: true,
      // }
      toastDispatch({
        type:'OPEN',
        payload:{
          message: err.message,
          severity: 'error',
          openSnack: true
        }
      })
    })

  },[ password, username, dispatch, setCookies, history ]);

  return isLoading ? <LinearProgress/> : (
    <>
      {/* snackbar */}
      {toastState.openSnack && <Toast open={toastState.openSnack} message={toastState.message} handleClose={handleSnackClose} severity={toastState?.severity}/>}
      
      <section className={classes.auth}>

        {/* Loader */}
        {isLoading && <LinearProgress />}

        {/* Heading/Title */}
        <h1>Login</h1>

        {/* Form */}
        <form>

          {/* Username Field */}
          <div className={classes.control}>
            <label htmlFor='username'>Your Username</label>
            <input type='text' id='username' value={ username } onChange={ changeUsername } required />
          </div>
          <br/>

          {/* Password Field */}
          <div className={classes.control}>
            <label htmlFor='password'>Your Password</label>
            <input type='password' id='password' value={ password }  onChange={ changePassword } required />
            <p style={{color:'whitesmoke'}}>Atleast 6 characters long</p>
          </div>

          {/* Login Button */}
          <div className={classes.actions}>
            <button onClick={submitHandler}>Login</button>
          </div>
        </form>
      </section>
    </>
  )
}

export default Auth;
