// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signOut } from "firebase/auth";
import {
  getFirestore, collection,
  addDoc, deleteDoc, doc,
  query, where,
  getDocs
} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBedBX_3H7qBvrSDh23H9lA5BFBALRbskE",
  authDomain: "pro-5d7e4.firebaseapp.com",
  projectId: "pro-5d7e4",
  storageBucket: "pro-5d7e4.appspot.com",
  messagingSenderId: "774462040577",
  appId: "1:774462040577:web:1cd15a6e0f003efd96ae00",
  measurementId: "G-4XWMR3KVKC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore();
const colRef = collection(db, 'recipes');

const addRecipe = (recipe) => {
  addDoc(colRef, recipe)
  .catch((err) => {
      console.log(err.message);
  })
}

const deleteRecipe = (id) => {
  deleteDoc(doc(colRef, id))
  .catch((err) => {
      console.log(err.message);
  })
}

const getRecipes = (user, recipes, setRecipes) => {
  if (!user) return;

  var fetchedRecipes = [];
  const q = query(colRef, where("user", "==", user.email));

  getDocs(q)
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (!recipes.some((recipe) => recipe.id === doc.id)) {
          let recipe = doc.data();
          recipe.id = doc.id;
          fetchedRecipes.push(recipe);
        }
      });
      setRecipes([...recipes, ...fetchedRecipes]);
    })
    .catch((err) => {
      console.log(err.message);
    });
}

const logOut = () => {
  signOut(auth)
    .catch((err) => {
      console.error(err.message);
    })
}

export { auth, colRef, addRecipe, deleteRecipe, getRecipes, logOut};
