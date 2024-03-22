import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";

import About from './components/About';
import Login from './components/Login';
import Registration from './components/Registration';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';

import './index.css';

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();

  // Check if the current location is the login page
  const isLoginPage = location.pathname === '/login';
  const isRegistrationPage = location.pathname === '/registration';
  const isDashboardPage = location.pathname === '/dashboard';
  const isProfilePage = location.pathname === '/Profile';


  return (
    <div>
      {!(isLoginPage || isRegistrationPage || isDashboardPage || isProfilePage) &&(
        <section>
          <img className='logo' src="/Recipe4YouLogo.png" alt="logo" />
          <div className="account">
            <ul>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/registration">Sign Up</Link>
              </li>
            </ul>
          </div>
        </section>
      )}
      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      {/* main content */}
      <div className="main-content">
        {/* content goes here */}
      </div>
    </div>
  );
}

export default App;
