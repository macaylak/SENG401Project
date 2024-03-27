import axios from 'axios';
import { auth, colRef, deleteRecipe } from '../../firebase';
import { onSnapshot, query, where, getDocs } from 'firebase/firestore';

/**
 * Function to handle generating a new recipe
 * @param {Object} input - The input object containing the ingredients, cuisine, diet, and allergy
 * @param {Array[Object]} recipes - The user's current recipes
 * @param {Function} setRecipes - The function to set the user's recipes
 * @param {Function} setShowModal - The function to set the modal state
 * @param {boolean} regenerate - A boolean to determine if the recipe is being regenerated
 * @param {Object} oldRecipe - The old recipe object, if regenerating, null otherwise
 */
const handleSubmitNewRecipe = async (input, recipes, setRecipes, setShowModal, regenerate=false, oldRecipe=null) => {
    if (!input.ingredients.trim()) return;

    try {
        const response = await axios.post(
        'https://us-central1-pro-5d7e4.cloudfunctions.net/generateRecipes',
        { ingredients: input.ingredients, cuisine: input.cuisine, diet: input.diet, allergy: input.allergy}
        );

        if (response.status === 200) {
        var recipeDict = response.data;
        if (!recipeDict.title.includes('recipe cannot be generated')) {
            if(!regenerate) {
            recipeDict.ingredientsAvailable = input.ingredients;
            recipeDict.user = auth.currentUser.email;
            if(input.cuisine !== '') {
                recipeDict.cuisine = input.cuisine;
            }
            if(input.diet !== '') {
                recipeDict.diet = input.diet;
            }
            if(input.allergy !== '') {
                recipeDict.allergy = input.allergy;
            }
            setRecipes([recipeDict, ...recipes]);
            }
            else {
            // setRecipes((recipes.filter((r) => r.title !== oldRecipe.title)));
            var oldTitle = oldRecipe.title;
            oldRecipe.title = recipeDict.title;
            oldRecipe.ingredients = recipeDict.ingredients;
            oldRecipe.instructions = recipeDict.instructions;
            oldRecipe.prepTime = recipeDict.prepTime;
            oldRecipe.nutritionalFacts = recipeDict.nutritionalFacts;
            setRecipes(() => {
                return recipes.map((recipe) => {
                if (recipe.title === oldTitle) {
                    return oldRecipe;
                }
                return recipe;
                });
            });
            }
        } else {
            alert(recipeDict.title);
        }
        }
    } catch (error) {
        console.error('Error sending message:', error);
    }
    setShowModal(false); // Close modal after submitting
};

/**
 * Function to handle searching for a recipe
 * @param {Event} e - The event object
 * @param {Function} setSearching - The function to set the searching state
 * @param {Function} setSearchedRecipes - The function to set the searched recipes
 */
const handleSearch = (e, setSearching, setSearchedRecipes) => {
    // query(colRef, where("title", "==", recipe_dict.title))
    const search = e.target.value.toLowerCase();
    if (search === '') {
      setSearching(false);
      return;
    }
    setSearching(true);
    const q = query(colRef, where("user", "==", auth.currentUser.email));
    onSnapshot(q, (snapshot) => {
      let filteredRecipes = [];

      snapshot.docs.forEach((doc) => {
        if (doc.data().title.includes(search) || doc.data().ingredients.includes(search)) {
          filteredRecipes.push(doc.data());
        }
      })
      setSearchedRecipes(filteredRecipes);
    })
}

const handleDeleteFromDB = (recipe, recipes, setRecipes) => {
    var id = '';
    getDocs(query(colRef, where("title", "==", recipe.title)))
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => { 
        id = doc.id;
      });

      if(id !== '') {
        deleteRecipe(id);
      }
      setRecipes(recipes.filter((r) => r.title !== recipe.title));
    })
    .catch((err) => {
      console.log(err.message);
    });
  }

export {handleSubmitNewRecipe, handleSearch, handleDeleteFromDB};