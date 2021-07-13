import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import ReactDOM from 'react-dom'
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '../../store/modal/modalActions';
const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    width: '40%',
    textAlign: 'center'
  },
}));


//Portal For modal
export default function TransitionsModal(){
  return <>
    {
      ReactDOM.createPortal(<MyModal />, document.getElementById('modal'))
    }
  </>
}

//modal component
function MyModal() {

  const modalState = useSelector(state => state.modal);//redux satte
  const dispatch = useDispatch();//redux dispatch
  const classes = useStyles();

  //dispatching modal close action
  const handleClose = () => {
    dispatch(closeModal());
  }

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={modalState.open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={modalState.open}>
        <div className={classes.paper}>

          {/* avoiding any error by converting to string and then uppercasing  */}
          <h4>Type: {modalState?.leave?.type.toString().toUpperCase()}</h4>
          <h4>From: {modalState?.leave?.from}</h4>
          <h4>To: {modalState?.leave?.to}</h4>

          {/* if duration is less than or equal to 1 diaplay 'day' else 'days' */}
          <h4>Duration: {modalState?.leave?.duration} {modalState?.leave.duration > 1 ? 'days':'day'}</h4>
          <h4>Status: {modalState?.leave?.status}</h4>
          <h4>Comments: {modalState?.leave?.comments}</h4>
        </div>
      </Fade>
    </Modal>
  );
}