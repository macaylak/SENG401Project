/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// import * as functions from "firebase-functions";

const {onRequest} = require("firebase-functions/v1/https");
const functions = require("firebase-functions");


exports.generateRecipes = onRequest(async (req, res) => {

    try {


        const response = await fetch('https://api.openai.com/v1/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${functions.config().project.chat_gpt_secret}`, // Replace with your secret API key
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: `I have chocolate, m&ms, skittles, okra, coffee beans, cottage cheese, and bologna in my kitchen. Give me a recipe to cook that has an ingredients list, instructions, prep time, and nutritional facts for the dish.`,
                model: "gpt-3.5-turbo-instruct",
                max_tokens: 600
            })
        });
        const jsonRes = await response.json()
        const recipe = jsonRes.choices[0].text.trim()
        console.log(recipe)
        res.set('Access-Control-Allow-Origin', '*');
        // res.;
        res.status(200).json(recipe);
    } catch (error) {
        console.error('Error generating recipes:', error);
        res.status(500).json({ error: 'Error generating recipes' });
    }

});
