const { onRequest } = require("firebase-functions/v1/https");
const functions = require("firebase-functions");
const fetch = require("node-fetch");

exports.generateRecipes = onRequest(async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${functions.config().project.chat_gpt_secret}`, // Replace with your secret API key
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: prompt,
        model: "gpt-3.5-turbo-instruct",
        max_tokens: 600
      })
    });

    const jsonRes = await response.json();
    const recipe = jsonRes.choices[0].text.trim();
    console.log(recipe);

    res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');

    res.status(200).json(recipe);
  } catch (error) {
    console.error('Error generating recipes:', error);
    res.status(500).json({ error: 'Error generating recipes' });
  }
});
