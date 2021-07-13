import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import './Layout.css';

function Layout(props) {
  return (
    <div className='app'>
      <Sidebar/>
        <div className='app-body'>
          {props.children}
        </div>
    </div>
  )
}

export default Layout;
