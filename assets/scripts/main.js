// main.js

// CONSTANTS
const RECIPE_URLS = [
    'https://adarsh249.github.io/Lab8-Starter/recipes/1_50-thanksgiving-side-dishes.json',
    'https://adarsh249.github.io/Lab8-Starter/recipes/2_roasting-turkey-breast-with-stuffing.json',
    'https://adarsh249.github.io/Lab8-Starter/recipes/3_moms-cornbread-stuffing.json',
    'https://adarsh249.github.io/Lab8-Starter/recipes/4_50-indulgent-thanksgiving-side-dishes-for-any-holiday-gathering.json',
    'https://adarsh249.github.io/Lab8-Starter/recipes/5_healthy-thanksgiving-recipe-crockpot-turkey-breast.json',
    'https://adarsh249.github.io/Lab8-Starter/recipes/6_one-pot-thanksgiving-dinner.json',
];

// Run the init() function when the page has loaded
window.addEventListener('DOMContentLoaded', init);

// Starts the program, all function calls trace back here
async function init() {
  // initialize ServiceWorker
  initializeServiceWorker();
  // Get the recipes from localStorage
  let recipes;
  try {
    recipes = await getRecipes();
  } catch (err) {
    console.error(err);
  }
  // Add each recipe to the <main> element
  addRecipesToDocument(recipes);
}

/**
 * Detects if there's a service worker, then loads it and begins the process
 * of installing it and getting it running
 */
function initializeServiceWorker() {
  // B1 check for serviceWorker in the broswer
  if ('serviceWorker' in navigator) {
    // B2. Listen for the 'load' event on the window object
    window.addEventListener('load', () => {
      // B3. Register './sw.js' as a service worker
      navigator.serviceWorker.register('./sw.js').then(registration => {
        // B4. Log a success message if the registration is successful
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }).catch(error => {
        // B5. Log a failure message if the registration fails
        console.log('ServiceWorker registration failed: ', error);
      });
    });
  } else {
    console.log('Service workers are not supported in this browser.');
  }
}

/**
 * Reads 'recipes' from localStorage and returns an array of
 * all of the recipes found (parsed, not in string form). If
 * nothing is found in localStorage, network requests are made to all
 * of the URLs in RECIPE_URLs, an array is made from those recipes, that
 * array is saved to localStorage, and then the array is returned.
 * @returns {Array<Object>} An array of recipes found in localStorage
 */
async function getRecipes() {
  // EXPOSE - START (All expose numbers start with A)
  // A1. TODO - Check local storage to see if there are any recipes.
  //            If there are recipes, return them.
  let localRecipes = localStorage.getItem('recipes');
  if(localRecipes){
    return JSON.parse(localRecipes);
  }
  /**************************/
  // The rest of this method will be concerned with requesting the recipes
  // from the network
  // A2. TODO - Create an empty array to hold the recipes that you will fetch
    let recipes = [];
  // A3. TODO - Return a new Promise. If you are unfamiliar with promises, MDN
  //            has a great article on them. A promise takes one parameter - A
  //            function (we call these callback functions). That function will
  //            take two parameters - resolve, and reject. These are functions
  //            you can call to either resolve the Promise or Reject it.
   // A3. Return a new Promise.
   return new Promise(async (resolve, reject) => {
    // A4. Loop through each recipe in the RECIPE_URLS array constant declared above
    for (let i = 0; i < RECIPE_URLS.length; i++) {
      const url = RECIPE_URLS[i];

      // A5. Since we are going to be dealing with asynchronous code, create a try / catch block.
      try {
        // A6. For each URL in that array, fetch the URL
        const response = await fetch(url);

        // A7. For each fetch response, retrieve the JSON from it using .json().
        const recipe = await response.json();

        // A8. Add the new recipe to the recipes array
        recipes.push(recipe);

        // A9. Check to see if you have finished retrieving all of the recipes,
        // if you have, then save the recipes to storage using the function we have provided.
        if (i === RECIPE_URLS.length - 1) {
          saveRecipesToStorage(recipes);
          // Then, pass the recipes array to the Promise's resolve() method.
          resolve(recipes);
        }
      } catch (error) {
        // A10. Log any errors from catch using console.error
        console.error('Error fetching recipe:', error);

        // A11. Pass any errors to the Promise's reject() function
        reject(error);
      }
    }
  });
}

/**
 * Takes in an array of recipes, converts it to a string, and then
 * saves that string to 'recipes' in localStorage
 * @param {Array<Object>} recipes An array of recipes
 */
function saveRecipesToStorage(recipes) {
  localStorage.setItem('recipes', JSON.stringify(recipes));
}

/**
 * Takes in an array of recipes and for each recipe creates a
 * new <recipe-card> element, adds the recipe data to that card
 * using element.data = {...}, and then appends that new recipe
 * to <main>
 * @param {Array<Object>} recipes An array of recipes
 */
function addRecipesToDocument(recipes) {
  if (!recipes) return;
  let main = document.querySelector('main');
  recipes.forEach((recipe) => {
    let recipeCard = document.createElement('recipe-card');
    recipeCard.data = recipe;
    main.append(recipeCard);
  });
}