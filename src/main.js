
// declare global variables
const input = document.getElementById('foodName').textContent;
const foodItem = document.getElementById('foodItem');
const container = document.getElementById('container');
const recipes = Array.from(document.getElementsByClassName('recipe'));
const addFavoriteIcon = document.getElementById('add');
let idCounter = 0;

console.log(addFavoriteIcon);

// const htmlGenerators = {
//   card:{
//     meal: (data) => `<h1>${data}</h1>`,
//     thumb: (data) => `<img src="${data}" alt="Meal Thumbnail">`,
//     instructions: (data) => data.map(instruction => `<p>${instruction}</p>`).join('')
//   }
// };
const addFavorite = () => {
  addFavoriteIcon.style.color = 'red';
};
const getIngredients = (data) => {
  const ingredients = [];
  const iterateData = data.meals[0];
  console.log
  for (let i = 1; i <= 20; i++) {
    const ingredient = iterateData[`strIngredient${i}`];
    if (ingredient && ingredient !== '') {
      ingredients.push(ingredient);
    }
  }
  return ingredients;
}

const getMeasurements = (data) => {
  const measurements = [];
  const iterateData = data.meals[0];
  for (let i = 1; i <= 20; i++) {
    const measurement = iterateData[`strMeasure${i}`];
    if (measurement && measurement !== '') {
      measurements.push(measurement);
    }
  }
  return measurements;
}

const generateCard = async (url, i) => {
  const response = await fetch(url);
  const data = await response.json();
  console.log(data.meals[0]['strIngredient1']);

  const mealHtml = data.meals[0].strMeal;
  const thumbHtml = data.meals[0].strMealThumb;
  const instructionsHtml = data.meals[0].strInstructions.replace(/'[0-9].' || 'STEP [0-9]'/g, '').split('\n').map(instruction => `<p>${instruction}</p>`).join('');
  const ingredients = getIngredients(data);
  const measurements = getMeasurements(data);

  const ingredientsHtml = ingredients.map((ingredient, i) => {
    const measurement = measurements[i] || '';
    return `<p>${measurement} ${ingredient}</p>`;
  }).join('');

  const finalHtml = `
  <div class='recipe' id="${idCounter}">
    <div class="row justify-content"><h2>${mealHtml}</h2><i id="add" onClick="addFavorite()">&hearts; Add</i></div>
    <img src="${thumbHtml}" alt="Meal Thumbnail">
    <h2>Ingredients</h2>
    <div>${ingredientsHtml}</div>
    <h2>Instructions</h2>
    <div>${instructionsHtml}</div>
  </div>
  `;
  
  idCounter++;
  console.log(finalHtml);
  return finalHtml;

  // You can then append `finalHtml` to your DOM or use it as needed.
};

generateCard(`https://www.themealdb.com/api/json/v1/1/random.php`);



// console.log(input);
foodItem.addEventListener('click', async () => {
  for (let i = 0; i < 10; i++) {
    const html = await generateCard(`https://www.themealdb.com/api/json/v1/1/random.php`, i);
    container.innerHTML += html;
  }
});


container.addEventListener('click', (event) => {
  if (event.target && event.target.id === 'add') {
    const recipeCard = event.target.parentElement.parentElement;
    
  }
});
// console.log(url);