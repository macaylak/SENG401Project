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
        <header>
          <h1>Recipes4You</h1>
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
        </header>
        <Routes>
          <Route path="/" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Add a catch-all route for unknown routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        {/* main content */}
        <div className="main-content">
          {/* content goes here */}
        </div>
      </div>
    </Router>
  );
}

// Component for 404 error
function NotFound() {
  return <h2>404 - Not Found</h2>;
}

export default App;
