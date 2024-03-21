const { onRequest } = require("firebase-functions/v1/https");
const functions = require("firebase-functions");
const fetch = require("node-fetch");

exports.generateRecipes = onRequest(async (req, res) => {
  try {
    const dict = req.body;
    const ingredients = dict.prompt;
    console.log("ingredients available:", ingredients)
    const prompt = `You are a recipe generator, you are not allowed to generate anything that isn't a recipe.You are gonna strictly follow 2 principles
    1: DO NOT GIVE RECIPES IF THE INGREDIENTS THAT THE USER INPUTS ARE NOT FOOD ITEMS YOU WILL SAY CANNOT GENERATE RECIPE BECAUSE THE INGREDIENTS ARE NOT FOOD ITEMS
    2: MAKE SURE TO USE ALL THE INDGREDIENTS  THAT THE USER INPUTS AND GIVE THE RECIPE 
    . Here are the ingredients in my kitchen: [${ingredients}]. Give me a recipe that has a title, ingredients list, instructions, prep time, and nutritional facts in this exact order.`;
    console.log("prompt:", prompt)

    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${functions.config().project.chat_gpt_secret}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: prompt,
        model: "gpt-3.5-turbo-instruct",
        max_tokens: 800
      })
    });

    const jsonRes = await response.json();
    var recipe = jsonRes.choices[0].text.trim();

    console.log(recipe.substring(0, 200) + "...");

    const recipe_dict = parseRecipe(recipe)
    // recipe = "test"
    // console.log(recipe);

    res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');

    console.log("title:", recipe_dict.title)
    res.status(200).json(recipe_dict);
  } catch (error) {
    console.error('Error generating recipes:', error);
    res.status(500).json({ error: 'Error generating recipes' });
  }
});

const parseRecipe = (recipe) => {
  //convert recipe to lowercase
  recipe = recipe.toLowerCase()
  if(recipe.length < 200) {
      // recipe.includes("recipe cannot be generated") || 
      return {title: "Recipe cannot be generated"}
  }
  var title = recipe.split("ingredients:")[0].trim()
  if(title.includes("prep time")) {
      title = title.split("prep time")[0].trim()
  }
  if(title.includes("recipe:")) {
      title = title.split("recipe:")[1].trim()
  }
  if(title.includes("title:")) {
      title = title.split("title:")[1].trim()
  }
  if(title.includes("recipe name:")) {
      title = title.split("recipe name:")[1].trim()
  }

  var ingredients = recipe.split("ingredients:")[1].split("instructions:")[0].trim()
  ingredients = "ingredients:\n" + ingredients

  var instructions = recipe.split("instructions:")[1].split("prep time:")[0].trim()
  if(instructions.includes("nutritional facts")) {
      instructions = instructions.split("nutritional facts")[0].trim()
  }
  instructions = "instructions:\n" + instructions

  var prepTime = recipe.split("prep time:")[1].split("nutritional facts")[0].trim()
  if(prepTime.includes("ingredients")) {
      prepTime = prepTime.split("ingredients")[0].trim()
  }
  prepTime = "prep time: " + prepTime

  // var nutritionalFacts = recipe.split("Nutritional facts")[1].trim()
  var nutritionalFacts = ""
  if(recipe.split("nutritional facts")[1].includes("(per serving):")) {
      nutritionalFacts = recipe.split("(per serving):")[1].trim()
  }
  else {
      nutritionalFacts = recipe.split("nutritional facts:")[1].trim()
  }
  // check if "recipe cannot be generated" is at the end of nutritional facts
  if(nutritionalFacts.includes("recipe cannot be generated")) {
      nutritionalFacts = nutritionalFacts.split("recipe cannot be generated")[0].trim()
  }

  nutritionalFacts = "nutritional facts:\n" + nutritionalFacts

  return {
      title: title,
      ingredients: ingredients,
      instructions: instructions,
      prepTime: prepTime,
      nutritionalFacts: nutritionalFacts
  }
}
