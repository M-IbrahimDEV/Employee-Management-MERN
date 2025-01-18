// import React from 'react';
import {useState, useEffect} from 'react'; 
import { Link, useLocation } from 'react-router-dom';
import './navbar.css';

const NavBar = () => {

  const location = useLocation();

  const [userEmail, setuserEmail] = useState(null);

  useEffect(() => {
    setuserEmail(localStorage.getItem('email'));  

  },[location]);


  return (
    <div className="navbar-container">
      <div className="navbar-brand">
        <div className="brand-text">Employee Management System</div>
      </div>
      <div className="navbar-links">


        {userEmail && (

          <Link to={location.pathname === '/' ? '/signup' : '/'}>
            <div className="link-text">{location.pathname === '/' ? 'nah' : 'nah'}</div>
          </Link>

        )}
        {!userEmail && (

          <Link to={location.pathname === '/' ? '/signup' : '/'}>
            <div className="link-text">{location.pathname === '/' ? 'Signup' : 'Login'}</div>
          </Link>

        )}




      </div>
    </div>
  );
};

export default NavBar;
