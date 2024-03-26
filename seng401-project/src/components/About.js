// About.js
import React from 'react';
import './styles/About.css';

function About() {
  return (
    <body>
      <h3 class = 'VisionHeading'>Our Mission</h3>
      <div className="content">
      
       <p className='writing'>
        <h4 class = 'subheading'> AI-Powered Meal Planning for a Sustainable Lifestyle</h4>
      
        <p class = 'statement'>
            Recipes4You is a web-based solution designed to help users reduce food waste
            and plan meals more effectively. Our goal is to provide a sustainable and
            health-conscious approach to meal planning by offering personalized recipe
            suggestions based on available ingredients and nutritional goals.
        </p>
        <div class='line'></div> {/* Add this line */}
        <div className="Boxes">
        <div class = 'wrapper'>
          <div class = 'box'>
            <img src = "https://cdn0.iconfinder.com/data/icons/thin-essentials/57/thin-058_recycle_bin_delete_garbage-512.png"/>
            <h6 class = 'boxheader'> Reduce Waste</h6>
            <p>
              Our platform suggests recipes based on the ingredients you already have, 
              ensuring every item in your pantry gets used efficiently. By preventing 
              unnecessary purchases and eliminating food waste, Recipes4You not only saves
              you money but also promotes a more sustainable lifestyle.
            </p>
          </div>
        </div>

        <div class = 'wrapper'>
          <div class = 'box'>
            <img src = "https://static-00.iconduck.com/assets.00/recipe-keeper-icon-2048x1890-iha2xi6m.png"/>
            <h6 class = 'boxheader'> Generate Infinite Recipes</h6>
            <p>
              With Recipes4You, your culinary possibilities are endless. Our AI-powered 
              platform offers a diverse range of recipes tailored to your preferences and 
              dietary needs. Whether you're a seasoned chef or just starting in the kitchen, 
              our personalized suggestions will inspire creativity and keep mealtime exciting.
            </p>
          </div>
        </div>

        <div class = 'wrapper'>
          <div class = 'box'>
            <img src = "https://static.thenounproject.com/png/1047774-200.png"/>
            <h6 class = 'boxheader'> Strategic Meal Planning</h6>
            <p>
              Our platform suggests recipes that align with your nutritional goals, making 
              healthy eating more accessible than ever. By organizing your meals effectively, 
              Recipes4You empowers you to make informed decisions about your food choices, 
              supporting your journey to a healthier lifestyle.
            </p>
          </div>
        </div>

        </div>
        
        <div>

          <div className='AboutFooter'>
            <p className='AF'>&copy; 2024 Recipes4You</p>
          </div>
      
        </div>

        </p>
      </div>


  

    </body>

  );
  
}

export default About;
