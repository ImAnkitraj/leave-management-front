import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import Apply from './pages/Apply/Apply';
import Leave from './pages/Leave/Leave';
import Auth from './pages/Auth/Auth';
import Layout from './components/Layout/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { login } from './store/auth/authActions';
import { useCookies } from 'react-cookie';

function App() {

  const [ cookies, ] = useCookies( [ 'auth' ] );//using cookies
  const dispatch = useDispatch(); //redux dispatch
  const authState = useSelector( state => state.auth ); //auth redux state
  
  useEffect(()=>{

    const token = cookies.token;
    const userId = cookies.userId;

    // after refresh
    // if user is already logged in setting the redux state
    // dispatching login action
    // token and userId as argument
    if( token && userId ){
      dispatch(login(token, userId));
    }

  },[ dispatch, cookies.token, cookies.userId ])

  return (
    <Router>
      <Switch>
        <Route path='/' exact>
          { authState.token === ''? <Auth/> :<Redirect to='/leave' exact from='/' />}
        </Route>
        { authState?.token === '' ? <Redirect to='/' exact/> : <Route path='/leave' exact><Layout><Leave/></Layout></Route> }
        { authState?.token === '' ? <Redirect to='/' exact/> : <Route path='/apply' exact><Layout><Apply/></Layout></Route> }
        { authState?.token === '' ? <Redirect to='/' from='*'/>:<Redirect to='/leave' from='*' /> }
      </Switch>
    </Router>
  );
}

export default App;
