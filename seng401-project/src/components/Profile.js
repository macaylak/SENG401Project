// Profile.js
import React from 'react';

const Profile = () => {
  return (
    <div>
      <h2>Profile</h2>
      {/* Add profile editing form here */
      <form>
        <label>
          Username:
          <input type="text" name="username" />
        </label>
        <label>
          Password:
          <input type="password" name="password" />
        </label>
        <input type="submit" value="Save" />
        </form>}
    </div>
  );
}

export default Profile;
