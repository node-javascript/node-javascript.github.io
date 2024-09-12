const searchInputEl = document.querySelector('.search_inp');
const searchButtonEl = document.querySelector('.search_btn');
const recipeContinerEl = document.querySelector('.recipe_container');
const recipeGastronomyEl = document.querySelector('.recipe_gastronomy');
const popupCloseButtonEl = document.querySelector('.close_btn');


const fetchRecipe = async (food) => {
    recipeContinerEl.innerHTML = "<h2>Fetching Recipes ...</h2>";
    try {
        const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${food}`);
        const response = await data.json();

        recipeContinerEl.innerHTML = "";
        response.meals.forEach(meal => {
            const recipeDiv = document.createElement('div');
            recipeDiv.classList.add('recipe');
            recipeDiv.innerHTML = `
                <img src="${meal.strMealThumb}">
                <h3>${meal.strMeal}</h3>
                <p><span>${meal.strArea}</span> Dish</p>
                <p>Category : <span>${meal.strCategory}</span></p>
            `;

            // create Button
            const button = document.createElement('button');
            button.textContent = "View Recipe";
            recipeDiv.appendChild(button);

            // Adding EventListerner to recipe button
            button.addEventListener('click', (e) => {
                e.preventDefault();
                openRecipePopup(meal);
            });

            recipeContinerEl.appendChild(recipeDiv);
        });
    }
    catch (error) {
        recipeContinerEl.innerHTML = "<h2>Error in Fetching Recipes ...</h2>";
    }
}

// Function to fetch ingredients and measurements
const fetchIngredients = (meal) => {
    let ingredientsList = "";
    for(let i = 1; i < 20; i++) {
        // 재료 선택
        const ingredient = meal[`strIngredient${i}`];
        if(ingredient) {
            // 재료에 따른 용량 선택
            const measure = meal[`strMeasure${i}`];
            ingredientsList += `<li>${ingredient} : ${measure}</li>`
        }
        else { break; }
    }
    return ingredientsList;
}

const openRecipePopup = (meal) => {
    recipeDetailContinerEl.innerHTML = `
        <h2 class="recipeName">${meal.strMeal}</h2>
        <h3>Ingredents:</h3>
        <ul class="recipeIngredientList">${fetchIngredients(meal)}</ul>
        <div class="recipeInstructions">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
    `;

    // parent : recipe_details
    recipeDetailContinerEl.parentElement.style.display = 'block';
}

searchButtonEl.addEventListener('click', (e) => {
    e.preventDefault();
    const searchInput = searchInputEl.value.trim();
    if(!searchInput) {
        recipeContinerEl.innerHTML = `<h2>Type the meal in the Search...</h2>`;
        return;
    }
    searchInputEl.value = "";
    fetchRecipe(searchInput);
});

popupCloseButtonEl.addEventListener('click', () => {
    recipeDetailContinerEl.parentElement.style.display = "none";
})