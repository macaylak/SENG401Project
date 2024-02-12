// Goals.js
import React from 'react';

const Goals = () => {
  return (
    <div>
      <h2>Goals</h2>
      {/* Add goals editing form here */
      <form>
        <label>
          Goal:
          <input type="text" name="goal" />
        </label>
        <input type="submit" value="Save" />
        </form>}
    </div>
  );
}

export default Goals;
