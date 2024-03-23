const { onRequest } = require("firebase-functions/v1/https");
const functions = require("firebase-functions");
const fetch = require("node-fetch");

exports.generateRecipes = onRequest(async (req, res) => {
  try {
    const dict = req.body;
    console.log("dict:", dict)
    // const ingredients = dict.prompt;
    const messages = createMessages(dict);

    console.log("messages:", messages)

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${functions.config().project.chat_gpt_secret}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            messages: messages,
            model: "gpt-3.5-turbo",
            max_tokens: 800
        })
    });

    const jsonRes = await response.json()
    // console.log(jsonRes)
    const recipe = await jsonRes.choices[0].message.content.trim()
    console.log(recipe.substring(0, 200) + "...");

    const recipe_dict = parseRecipe(recipe)
    console.log(recipe_dict)
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

const createMessages = (dict) => {
  var userPrompt = `You are a recipe generator and you are not allowed to generate anything that isn't a recipe. You must follow these principles.
    1: DO NOT GENERATE RECIPES IF THE INGREDIENTS ARE NOT FOOD ITEMS.
    2: ONLY USE THE ITEMS THAT YOU RECOGNIZE AS FOOD ITEMS TO GENERATE THE RECIPE.
    3. TRY TO USE THE PREFERRED CUISINE, DIET, AND RESTRICTIONS TO GENERATE THE RECIPE. 
    4. DO NOT USE INGREDIENTS THAT ARE NOT IN THE LIST.
    5. RECIPES MAY USE AS LITTLE OR AS MANY INGREDIENTS AS NEEDED IN ORDER TO GENERATE A RECIPE.
    6. RECIPES CAN PRODUCE ANY KIND OF DISH, INCLUDING MAIN COURSES, DESSERTS, SNACKS, SMOOTHIES, SOUPS, etc.
    7. RECIPES DO NOT ALWAYS NEED A MAIN PROTEIN.
    IF THESE PRINCIPLES ARE NOT FOLLOWED, RESPOND ONLY WITH "recipe cannot be generated: " followed by a short ACCURATE description(max 20 words) of the reason why(invalid ingredients, restrictions could not be met, etc.).`

    userPrompt += `Here are the ingredients in my kitchen: [${dict.ingredients}].`
    if(dict.cuisine !== "") {
        userPrompt += " Preferred cuisine(optional): " + dict.cuisine + "."
    }
    if(dict.diet !== "") {
        userPrompt += " Diet: " + dict.diet + "."
    }
    if(dict.allergy !== "") {
        userPrompt += " Restrictions: " + dict.allergy + "."
    }
    // if(dict.not !== "") {
    //     userPrompt += " Do not generate: " + dict.not + "."
    // }

    // Add error messages with reasons why the recipe cannot be generated such as invalid ingredients, restrictions could not be met, etc.
    userPrompt += "Give me a recipe that has a title, ingredients list(with quantities), instructions, time(prep, cook, and total), and nutritional facts(with values) in this exact order. Title each section as such with a colon."

    const messages = [{
        role: 'user',
        content: userPrompt
    }]
    return messages
}

const parseRecipe = (recipe) => {
  //convert recipe to lowercase
  recipe = recipe.toLowerCase()
  if(recipe.length < 200) {
      // recipe.includes("recipe cannot be generated") || 
      return {title: recipe}
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
  // ingredients = "ingredients:\n" + ingredients

  var instructions = recipe.split("instructions:")[1].split("prep time:")[0].trim()
  if(instructions.includes("nutritional facts")) {
      instructions = instructions.split("nutritional facts")[0].trim()
  }
  // instructions = "instructions:\n" + instructions

  var prepTime = recipe.split("time:")[1].split("nutritional facts")[0].trim()
  if(prepTime.includes("ingredients")) {
      prepTime = prepTime.split("ingredients")[0].trim()
  }
  // prepTime = "prep time: " + prepTime

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

  // nutritionalFacts = "nutritional facts:\n" + nutritionalFacts

  return {
      title: title,
      ingredients: ingredients,
      instructions: instructions,
      prepTime: prepTime,
      nutritionalFacts: nutritionalFacts
  }
}
