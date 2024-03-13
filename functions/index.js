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
// const project = require('project')(functions.config().project.chat_gpt_secret);

// const logger = require("firebase-functions/logger");

// const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
// const { defineSecret } = require("firebase-functions/params");
// const chatGPTKey = defineSecret("ChatGPT_Key");

// async function getChatGPTApiKey() {
//     // Create a new Secret Manager client
//     // const client = new SecretManagerServiceClient();
  
//     // Replace 'YOUR_SECRET_ID' with the ID of your secret in Secret Manager
//     // const name = 'projects/774462040577/secrets/ChatGPT_Key';
  
//     // Fetch the latest version of the secret
//     // const [version] = await client.accessSecretVersion({
//     //   name: name,
//     // });
  
//     // Extract the payload
//     const payload = version.payload.data.toString('utf8');
  
//     return payload;
// }

exports.generateRecipes = onRequest(async (req, res) => {
    // key = chatGPTKey;
    // console.log(key);
    // response_dict = { key: key };
    // res.json({ response_dict });
    // res.status(200).send();
    try {
        // const key = chatGPTKey
        // console.log("key", functions.config().project.chat_gpt_secret);
        // const response_dict = { key: functions.config().project.chat_gpt_secret };
//         curl https://api.openai.com/v1/chat/completions \
//   -H "Content-Type: application/json" \
//   -H "Authorization: Bearer $OPENAI_API_KEY" \
//   -d '{
//     "model": "gpt-3.5-turbo",
//     "messages": [
//       {
//         "role": "system",
//         "content": "You are a helpful assistant."
//       },
//       {
//         "role": "user",
//         "content": "Hello!"
//       }
//     ]
//   }'

        const response = await fetch('https://api.openai.com/v1/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${functions.config().project.chat_gpt_secret}`, // Replace with your secret API key
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: `I have chocolate, m&ms, skittles, okra, coffee beans, cottage cheese, and bologna in my kitchen. Give me a recipe to cook that has an ingredients list, instructions, prep time, and nutritional facts for the dish.`,
                model: "gpt-3.5-turbo-instruct",
                max_tokens: 600
            }),
        });
        const jsonRes = await response.json()
        const recipe = jsonRes.choices[0].text.trim()
        console.log(recipe)
        res.json(recipe);
        res.status(200).send();
    } catch (error) {
        console.error('Error generating recipes:', error);
        res.status(500).json({ error: 'Error generating recipes' });
    }
    //     console.log('Request body:', req.body);
    //     const { foodItems } = req.body;
    //     // Make a request to ChatGPT API using Fetch


    //     if (!response.ok) {
    //         throw new Error('Failed to fetch data from ChatGPT API');
    //     }

    //     // console.log('Response:', response);

    //     const responseData = await response.json();

    //     // Extract and send back recipes to the client
    //     const recipes = responseData.choices.map(choice => choice.text.trim());
    //     res.json({ recipes });
    // } catch (error) {
    //     console.error('Error generating recipes:', error);
    //     res.status(500).json({ error: 'Error generating recipes' });
    // }
    // console.error('Error getting ChatGPT API key:', error);
    // res.status(500).json({ error: 'Error getting ChatGPT API key' });

});
