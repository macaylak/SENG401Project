// About.js
import React from 'react';
import './styles/About.css';

function About() {
  return (
    <body>
      <h3 class = 'VisionHeading'>Our Project  Vision</h3>
      <h2>About Recipes4You</h2>
      <div className="content">
      <img className = 'food' src="https://images.immediate.co.uk/production/volatile/sites/30/2023/02/High-protein-foods-268221e.jpg?quality=90&resize=556,505" />
       <p className='writing'>
        <h4 class = 'subheading'> AI-Powered Meal Planning for a Sustainable Lifestyle</h4>
        <div class='line'></div> {/* Add this line */}
        <p>
            Recipes4You is a web-based solution designed to help users reduce food waste
            and plan meals more effectively. Our goal is to provide a sustainable and
            health-conscious approach to meal planning by offering personalized recipe
            suggestions based on available ingredients and nutritional goals.
        </p>
        <p>
            With Recipes4You, users can create customized recipes tailored to their dietary
            preferences, allergies, and fitness goals. By utilizing AI-generated recipe
            suggestions, we aim to inspire creativity in the kitchen and promote a more
            thoughtful approach to nutrition.
        </p>
        <p>
            Our mission is to empower users to make informed decisions about their food
            choices while reducing food waste and promoting a sustainable lifestyle.
        </p>
        <img className='signature' src="/signature.png" />

        </p>
      </div>


    </body>
  );
}

export default About;
