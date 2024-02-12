// Dashboard.js
import React from 'react';
import './styles/Dashboard.css';
function Dashboard() {
  return (
    <div>
      {/* hide account component */}
      <style>{`
        .account {
          display: none;
        }
      `}</style>
      {/* dashboard title */}
      <h2>Dashboard</h2>
      {/* sidemenu */}
      <div className="sidemenu">
        <ul>
          <li>Profile</li>
          <li>Recipes</li>
          <li>Meal Plan</li>
          <li>Settings</li>
        </ul>
        <a href="/">Logout</a>
      </div>
      {/* main content */}
      <div className="main-content">
        {/* content goes here */}
      </div>
      {/* new recipe button */}
      <button>New Recipe</button>
      {/* recipe display */}
      <div className="recipe-display">
        {/* recipe cards */}
      </div>
    </div>
  );
}

export default Dashboard;
