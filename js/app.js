import { getData, renderCategories } from './helpers.js';
const URL_CATEGORIES = 'https://www.themealdb.com/api/json/v1/1/categories.php';

getData(URL_CATEGORIES)
  .then( data => {
    renderCategories(data.categories);
  })
  .catch( error => console.error(error))
