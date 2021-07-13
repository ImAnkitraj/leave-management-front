import React, { useEffect, useReducer, useState } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { BACKEND_URL } from '../../../constants';
import axios from 'axios';
import TransitionsModal from '../../../components/Modal/Modal';
import { LinearProgress } from '@material-ui/core';
import Toast from '../../../components/Toast/Toast';
import { toastInitialState, toastReducer } from '../../toastReducer';
import { useDispatch, useSelector } from 'react-redux';
import { openModal } from '../../../store/modal/modalActions';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: '#293145',
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

export default function History() {
  
  const classes = useStyles(); //for material ui components
  const authState = useSelector( state => state.auth ); //redux auth state
  const dispatch = useDispatch(); //dispatch for redux
  const modalState = useSelector( state=>state.modal ); //selector for redux state selection
  const [ isLoading, setIsLoading ] = useState(true); //loading state
  const [ applications, setApplication ] = useState([]); //applications state
  const [ toastState, toastDispatch ] = useReducer(toastReducer, toastInitialState);//toast reducer

  //snackbar close
  //dispatch close action to toast reducer
  //require three fields {message, severity (set it to success as default for avoiding any errors from material ui)and openSnack}
  const handleSnackClose = () => {
    toastDispatch({
      type:'CLOSE',
      payload:{
        message:'',
        severity: 'success',
        openSnack: false,
      }
    })
  }

  useEffect(()=>{

    //fetch previous leave applications
    setIsLoading(true);

    //requesting by passing userId in params
    axios.get(BACKEND_URL+'/leave/user/'+authState.userId)
    .then( (res) => {

      if(res.data.status) {
        const apply = [...res.data.applications];

        //reversing the list to make latest application on top
        apply.reverse();
        setApplication([...apply]);
        setIsLoading(false)
      }

      else {
        throw new Error(res.data.message)
      }

    } )
    .catch( (err) => {

      //dispatching open snack action
      //type = 'OPEN'
      //payload = {
      //   message: some text,
      //   severity: success/error/warning,
      //   openSnack: true,
      // }
      toastDispatch({
        type:'OPEN',
        payload:{
          severity:'error',
          message:err.message,
          openSnack: true,
        }
      });

      setIsLoading(false);
    } );

  },[setApplication, authState.userId, setIsLoading])

  //setting data for modal
  //dispatching openModal event by passing the leave in parameter
  const handleModal = (leave) => {
    dispatch(openModal(leave));
  }

  //if loading return linear progress bar
  if(isLoading){
    return <LinearProgress/>
  }
  // else list of applications
  return (
    <>
      {/* Snackbar Portalised */}
      <Toast open={toastState.openSnack} message={toastState.message} handleClose={handleSnackClose} severity={toastState.severity}/>
      {
        applications && applications.length <= 0 ? (<div> No History </div>):(
          <>
            {/* Modal portalised */}
            { modalState.open && <TransitionsModal/> } 
            {/* table */}
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="customized table">
                {/* table column naming */}
                <TableHead fixed>
                  <TableRow>
                    <StyledTableCell>Type</StyledTableCell>
                    <StyledTableCell align="right">From</StyledTableCell>
                    <StyledTableCell align="right">To</StyledTableCell>
                    <StyledTableCell align="right">Duration</StyledTableCell>
                    <StyledTableCell align="right">Status</StyledTableCell>
                  </TableRow>
                </TableHead>
                {/* table body */}
                <TableBody>
                  { 
                    applications.map((_) => (
                      <StyledTableRow key={_._id}  >
                        <StyledTableCell onClick={ () => handleModal( _ )} style={ { cursor:'pointer' } } component="th" scope="row">
                          { _.type.toString() }
                        </StyledTableCell>
                        <StyledTableCell align="right">{ _.from.toString() }</StyledTableCell>
                        <StyledTableCell align="right">{ _.to.toString() }</StyledTableCell>
                        <StyledTableCell align="right">{ _.duration.toString() }</StyledTableCell>

                        {/* giving different color to status text */}
                        <StyledTableCell style={ { color: _.status === 'approved'?'green':'red' } } align="right">{ _.status.toUpperCase() }</StyledTableCell>
                      </StyledTableRow>
                    ))
                  }
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )
      }
    </>
  );
}