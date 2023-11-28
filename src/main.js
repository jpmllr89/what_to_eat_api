
// declare global variables
// const input = document.getElementById('foodName').textContent;
const foodItem = document.getElementById('foodItem');
const container = document.getElementById('container');
const addFavoriteIcon = document.getElementById('add');
const addButtonSelector ='div.recipes i';
let idCounter = 0;

// console.log(recipes);


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

const generateCard = async (url) => {
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
  <div class='recipe' id=${idCounter}>
    <div class="row justify-content"><h2>${mealHtml}</h2><i class="fa fa-heart">&hearts; Add</i></div>
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
// addFavorite.addEventListener('click', () => {
//   addFavorite.style.color = 'red';
// });

// right here is the switching functionality
const moveCard = (id, direction) =>{

  const selection = document.getElementById(id);
  console.log(selection);

  if(selection){
    selection
      .querySelector('i')
      .classList.toggle('fa-heart-broken', direction ==="toFavs");
    
    selection
      .querySelector('i')
      .classList.toggle('fa-heart-circle-plus', direction === 'toMain');
    
    const targetParent = 
      direction === 'toMain' 
        ? document.getElementById('container') 
        : document.getElementById('favorites');
    
    targetParent.appendChild(selection);

  }
}

// recipes.forEach((item)=>{
//   item.addEventListener('click', function(e){
//     const target = e.target.parentNode.id;
//     console.log(target);
//     target == 'container' ? moveCard(item.id, 'toFavs') : moveCard(item.id, 'toMain')
// })});


foodItem.addEventListener('click', async () => {
  for (let i = 0; i < 10; i++) {
    const html = await generateCard(`https://www.themealdb.com/api/json/v1/1/random.php`, i);
    container.innerHTML += html;
  }
  const recipes = Array.from(document.getElementsByClassName('recipe'));
  // const addButton = document.querySelectorAll(addButtonSelector)
  // console.log(addButton)
  recipes.forEach((item)=>{
    item.addEventListener('click', function(e){
      const recipe = e.target.closest('div.recipe');
      const target = recipe.parentNode.id;
      console.log(recipe, "recipe");
      console.log(target, "target");
      target == 'container' ? moveCard(recipe.id, 'toFavs') : moveCard(recipe.id, 'toMain')
  })});
});

// console.log(url);