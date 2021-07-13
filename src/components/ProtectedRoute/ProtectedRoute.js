import React from 'react'
import { useSelector } from 'react-redux'
import { Redirect, Route } from 'react-router-dom'

function ProtectedRoute( props ) {

  const authState = useSelector( state=>state.auth );
  return (
      authState.token !== '' ? (
        <Route { ...props } />
      ):(
        <Redirect to='/'/>
      )
  );
  
}

export default ProtectedRoute;
