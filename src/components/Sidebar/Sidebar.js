import React from 'react'
import './Sidebar.css'
import { NavLink, useHistory } from 'react-router-dom';
import { Tooltip } from '@material-ui/core';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import RestoreIcon from '@material-ui/icons/Restore';
import PostAddIcon from '@material-ui/icons/PostAdd';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/auth/authActions';
import { useCookies } from 'react-cookie';

function Sidebar() {

  const [ , setCookies ] = useCookies( [ 'auth' ] );
  const history = useHistory();
  const dispatch = useDispatch();

  //handling logout by clearing the cookies
  //then redirecting
  const handleLogout = (e) => {
    e.preventDefault();

    // setting cookie token and userId to empty string
    setCookies('token','');
    setCookies('userId','');

    // dispatching logout
    dispatch(logout());

    // redirecting to '/'
    history.push('/');
  }

  return (
    <div className='sidebar'>
      <div className="sidebar-primary">
        <div className="sidebar-primary-top">
          <div className="logo">
            {/* <img src={logo} alt="Logo" /> */}
          </div>
          <div className="sidebar-primary-top-menu">

            <Tooltip title="My Leaves">
              <NavLink to="/leave" className="sidebar-primary-top-menu-item">
                  <RestoreIcon className='icon'/>
              </NavLink>
            </Tooltip>

            <Tooltip title="Apply Leave">
              <NavLink to="/apply" className="sidebar-primary-top-menu-item">
                <PostAddIcon  className='icon'/>
              </NavLink>
            </Tooltip>

            <Tooltip title="Logout">
              <NavLink to="/logout" onClick={handleLogout} activeClassName="active" className="sidebar-primary-top-menu-item">
                <MeetingRoomIcon className='icon'/>
              </NavLink>
            </Tooltip>

          </div>
        </div>
      </div>  
    </div>
  )
}

export default Sidebar;
