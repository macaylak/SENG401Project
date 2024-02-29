/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v1/https");
const logger = require("firebase-functions/logger");

exports.generateRecipes = onRequest(async (req, res) => {
    try {
        const { foodItems } = req.body;

        // Make a request to ChatGPT API using Fetch
        const response = await fetch('https://chatgpt.com/api/v1/completion/', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer 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', // Replace with your secret API key
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: `Give food recipes that can be made for the food items: ${foodItems}`,
                model: "gpt-3.5-turbo-instruct"
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data from ChatGPT API');
        }

        const responseData = await response.json();

        // Extract and send back recipes to the client
        const recipes = responseData.choices.map(choice => choice.text.trim());
        res.json({ recipes });
    } catch (error) {
        console.error('Error generating recipes:', error);
        res.status(500).json({ error: 'Error generating recipes' });
    }
});
