import { Snackbar } from '@material-ui/core';
import React from 'react';
import ReactDOM from 'react-dom';
import Alert from '../Alert/Alert';

//Creating portal for snackbar
function Toast( { open, severity, message, handleClose } ) {

  return (

    // portal
    ReactDOM.createPortal(
    <Snackbar 
      open={ open }  
      anchorOrigin={ { vertical:'top', horizontal:'right' } }
      autoHideDuration={ 6000 } 
      onClose={ handleClose }
    >
      <Alert onClose={handleClose} severity={severity}>
        { message }
      </Alert>
    </Snackbar>,
    document.getElementById('toast'))

  );

}

export default Toast;
