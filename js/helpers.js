import * as DOM from './dom.js';
const URL_MEALS = 'https://www.themealdb.com/api/json/v1/1/filter.php?c=QUERY';
const URL_MEALDETAILS = 'https://www.themealdb.com/api/json/v1/1/search.php?s=QUERY';

export const getData = async (url) => {
  const resp = await fetch(url);
  const data = await resp.json();
  return data;
}

export const renderMeal = meal => {
  let stringHTML = `<h2>${meal.strMeal}</h2>
    <article>
      <h3>${meal.strMeal}</h3>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" title="${meal.strMeal}">
      <h4>${meal.strCategory}</h4>
      <h4>${meal.strArea} | ${meal.strTags}</h4>
      <p>${meal.strInstructions}</p>\
    </article>`;
    // ingredientes
  DOM.meal.innerHTML = stringHTML;
}

export const renderMeals = (data, categoryName) => {
  let stringHTML = `<h2>${categoryName} Meals</h2>`;
  data.forEach( meal => {
    stringHTML += `<article id="${meal.idMeal}" class="meal-item">
      <h3 class="meal-title">${meal.strMeal}</h3>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" title="${meal.strMeal}">
    </article>`;
  });
  DOM.meals.innerHTML = stringHTML;
  document.querySelectorAll('.meal-title').forEach( element => {
    element.addEventListener('click', e => {
      const QUERY = e.target.innerText;
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
      <h3 class="category-title">${category.strCategory}</h3>
      <img src="${category.strCategoryThumb}" alt="${category.strCategory}" title="${category.strCategory}">
    </article>`;
  });
  DOM.categories.innerHTML = stringHTML;
  document.querySelectorAll('.category-title').forEach( element => {
    element.addEventListener('click', e => {
      const QUERY = e.target.innerText;
      getData(URL_MEALS.replace("QUERY", QUERY))
        .then( data => {
          renderMeals(data.meals, QUERY);
        })
        .catch( error => console.error(error))
    })
  })
}