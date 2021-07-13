import React, { useEffect, useReducer, useState } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import axios from 'axios';
import { BACKEND_URL } from '../../../constants';
import CloseIcon from '@material-ui/icons/Close';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import { IconButton, Tooltip, LinearProgress } from '@material-ui/core';
import TransitionsModal from '../../../components/Modal/Modal';
import Toast from '../../../components/Toast/Toast';
import { toastInitialState, toastReducer } from '../../toastReducer';
import { useDispatch, useSelector } from 'react-redux';
import { openModal } from '../../../store/modal/modalActions';

//Higher order component provided by material ui
const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: '#293145',
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);


//Higher order component provided by material ui
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

//Pending List component
export default function Pending() { 

  const authState = useSelector(state=>state.auth)//redux auth state
  const dispatch = useDispatch();//dispatch for redux
  const modalState = useSelector(state=>state.modal);//selector for redux state selector
  const [ isLoading, setIsLoading ] = useState(false); //loading state
  const [ applications, setApplication ] = useState([]); //appliactions array
  const classes = useStyles();//material ui classes
  const [ toastState, toastDispatch ] = useReducer( toastReducer, toastInitialState ) //sanckbar reducer

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

  //function to handle application approval
  const handleApprove = (id) => {

    //Approving leave application
    setIsLoading(true);

    //requesting with put method for marking application as approved
    //passing leaveId and userId in body
    axios.put(BACKEND_URL+'/leave/approved',{
      userId: authState.userId,
      id: id
    } )
    .then((res)=>{
      if(res.data.status){
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
            severity:'success',
            message:'Leave Approved',
            openSnack: true,
          }
        })

        //Reversing the appliactions for getting latest application on the top
        setApplication([...res.data.applications.reverse()])
      }
    })
    .catch((err)=>{

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
          message:'Leave Not Approved',
          openSnack: true,
        }
      })
    })

    //setting loading as false
    setIsLoading(false);

  }

  const handleReject = (id) => {

    //Rejecting leave application    
    axios.put(BACKEND_URL+'/leave/rejected',{
      userId: authState.userId,//passing userId
      id: id                                 //passing leave id
    } )
    .then((res)=>{
      if(res.data.status){

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
            severity:'success',
            message:'Leave Rejected',
            openSnack: true,
          }
        })

        //setting loading false
        setIsLoading(false);

        //Reversing the appliactions for getting latest application on the top
        setApplication([...res.data.applications.reverse()]);
      }
    })
    .catch((err)=>{

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
          message:'Leave Not Rejected',
          openSnack: true,
        }
      });

      setIsLoading(false);
    });

  }

  useEffect(()=>{

    //setting loading true
    setIsLoading(true);

    //requesting for peding applications lists with userId in params 
    axios.get(BACKEND_URL+'/leave/pending/'+authState.userId)
    .then((res)=>{
      if(res.data.status){

        const apply = [...res.data.applications];

        //reversing the list for making latest appliaction on the top
        setApplication([...apply.reverse()]);
        setIsLoading(false);

      }

      else{

        throw new Error(res.data.message);

      }

    })
    .catch((err)=>{

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

      //setting loading false
      setIsLoading(false);

    })
    
  },[ setIsLoading, authState.userId, setApplication ])

  //setting data for modal
  //dispatching openModal event by passing the leave in parameter
  const handleModal = (leave) => {
    dispatch(openModal(leave));
  }

  //if loading retuning loder ans JSX
  if(isLoading){
    return  <LinearProgress/>
  }

  // else the whole JSX component
  return (
  <>
  
    {/* Snackbar */}
    { 
      toastState.openSnack && <Toast 
        open={toastState.openSnack} 
        message={toastState.message} 
        handleClose={handleSnackClose} 
        severity={toastState.severity}
      /> 
    }

    {/* If no applications show No pending request else show list  */}
    {
      applications.length <= 0 ? (<span>No Pending requests</span>):(
        <>
        {/* table */}
        <TableContainer component={Paper}>

          { modalState.open && <TransitionsModal/> }
          <Table className={classes.table} aria-label="customized table">

            {/* column heading */}
            <TableHead >
              <TableRow>
                <StyledTableCell>Type</StyledTableCell>
                <StyledTableCell align="right">From</StyledTableCell>
                <StyledTableCell align="right">To</StyledTableCell>
                <StyledTableCell align="right">Duration</StyledTableCell>
                <StyledTableCell align="right">Actions</StyledTableCell>
              </TableRow>
            </TableHead>

            <TableBody>

              {/* table rows */}
                {applications.map((_) => (
                  <StyledTableRow key={_._id} >
                    <StyledTableCell onClick={()=>{handleModal(_)}} style={{cursor:'pointer'}} component="th" scope="row">
                      {_.type}
                    </StyledTableCell>
                    <StyledTableCell align="right">{_.from}</StyledTableCell>
                    <StyledTableCell align="right">{_.to}</StyledTableCell>
                    <StyledTableCell align="right">{_.duration}</StyledTableCell>
                    <StyledTableCell align="right">
                        <Tooltip title='Approve' onClick={ ()=>handleApprove(_._id) }>
                          <IconButton>
                              <DoneAllIcon style={{fonrSize:'40px'}}/>
                          </IconButton>
                        </Tooltip>
                        &nbsp;&nbsp;
                        <Tooltip title='Reject' onClick={ ()=>handleReject(_._id) }>
                          <IconButton >
                              <CloseIcon style={ { fonrSize:'40px' } }/>
                          </IconButton>
                        </Tooltip>
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              }
            </TableBody>
          </Table>
        </TableContainer>
      </>
      )
    }
  </> );
}