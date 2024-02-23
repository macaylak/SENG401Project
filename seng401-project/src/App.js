// App.js
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from "react-router-dom";

import About from './components/About';
import Login from './components/Login';
import Registration from './components/Registration';
import Dashboard from './components/Dashboard';



import './index.css';

function App() {
  return (
    <Router>
      <div>
        <section>
        <img className='logo' src="/Recipe4YouLogo.png" alt = "logo" />
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
        <Routes>
          <Route path="/" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
        {/* main content */}
        <div className="main-content">
          {/* content goes here */}
        </div>
      </div>
    </Router>

  );
}

export default App;
