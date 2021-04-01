import * as DOM from './dom.js';
const URL_MEALS = 'https://www.themealdb.com/api/json/v1/1/filter.php?c=QUERY';
const URL_MEALDETAILS = 'https://www.themealdb.com/api/json/v1/1/search.php?s=QUERY';

export const getData = async (url) => {
  const resp = await fetch(url);
  const data = await resp.json();
  return data;
}

export const toggleModal = modal => {
  modal.classList.toggle("modal-hidden")
}

export const getIngredients = meal => {
  let measuredIngredients = "";
  const ingredients = [];
  const measures = [];

  for(let ingredient in meal) {
    (ingredient.includes("Ingredient") && meal[ingredient]) ? ingredients.push(meal[ingredient]) : null;
    (ingredient.includes("Measure") && meal[ingredient]) ? measures.push(meal[ingredient]) : null;
  }

  ingredients.forEach( (element, index) => {
    measuredIngredients += `<li>${ingredients[index]} (${measures[index]})</li>`
  });

  return measuredIngredients;
}

export const renderMeal = meal => {
  (meal.strTags) ? null : meal.strTags = "No tags";

  DOM.mealTitle.innerText = meal.strMeal;
  DOM.mealImage.setAttribute("src", meal.strMealThumb);
  DOM.mealImage.setAttribute("alt", meal.strMeal);
  DOM.mealImage.setAttribute("title", meal.strMeal);
  DOM.imgFrame.style.backgroundImage = `url('${meal.strMealThumb}')`;
  DOM.mealCategory.innerHTML = `<b>Category: </b>${meal.strCategory}`;
  DOM.mealArea.innerHTML = `<b>Area: </b>${meal.strArea}`;
  DOM.mealTags.innerHTML = `<b>Tags: </b>${meal.strTags.replace(",", ", ")}`;
  DOM.mealIngredients.innerHTML = getIngredients(meal);
  DOM.mealInstructions.innerText = meal.strInstructions;

  toggleModal(DOM.modal);
}

export const renderMeals = (data, categoryName) => {
  let stringHTML = `<h2>${categoryName} Meals</h2>`;
  data.forEach( meal => {
    stringHTML += `<article id="${meal.idMeal}" class="category-item">
      <h3 title="${meal.strMeal}">${meal.strMeal}</h3>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" title="${meal.strMeal}">
      <button class='btn btn-primary meal-btn' value='${meal.strMeal}'>Show recipe</button>
    </article>`;
  });
  DOM.categories.innerHTML = stringHTML;
  document.querySelectorAll('.meal-btn').forEach( element => {
    element.addEventListener('click', e => {
      const QUERY = e.target.value;
      getData(URL_MEALDETAILS.replace("QUERY", QUERY))
        .then( data => {
          renderMeal(data.meals[0], QUERY);
        })
        .catch( error => console.error(error))
    })
  })
}

export const renderCategories = data => {
  let stringHTML = '<h2>Categories</h2>';
  data.forEach( category => {
    stringHTML += `<article id="${category.idCategory}" class="category-item">
      <h3 title="${category.strCategory}">${category.strCategory}</h3>
      <img src="${category.strCategoryThumb}" alt="${category.strCategory}" title="${category.strCategory}">
      <button class='btn btn-primary category-btn' value='${category.strCategory}'>Show dishes</button>
    </article>`;
  });
  DOM.categories.innerHTML = stringHTML;
  document.querySelectorAll('.category-btn').forEach( element => {
    element.addEventListener('click', e => {
      const QUERY = e.target.value;
      getData(URL_MEALS.replace("QUERY", QUERY))
        .then( data => {
          renderMeals(data.meals, QUERY);
        })
        .catch( error => console.error(error))
    })
  })
}