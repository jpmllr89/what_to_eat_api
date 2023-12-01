
// declare global variables
// const input = document.getElementById('foodName').textContent;

const foodItem = document.getElementById('foodItem');
const container = document.getElementById('container');
const addFavoriteIcon = document.getElementById('add');
const sortBtn = document.getElementsByClassName('sortBtn');
const sortBtnfavs = document.getElementsByClassName('sortBtnfavs');
const main = document.getElementById('main');
let idCounter = 0;

// console.log(recipes);

const htmlTemplates = {
  recipe: (htmlData) => {
    return `<div class='recipe' id=${idCounter}>
              <div class="row justify-content"><h2>${htmlData.meal}</h2><i class="fa fa-heart"></i></div>
              <img data-open="modal${idCounter}" src="${htmlData.thumb}" alt="Meal Thumbnail">
            </div>`
  },
  modal: (htmlData, htmlIngredients) => {
    return `<div class='recipe modal' id="modal${idCounter}">
              <div class="modal-display">
                <div class="modal-header"><h2>${htmlData.meal}</h2><i data-close class="fa fa-x"></i></div>
                <div class="modal-body">
                  <img src="${htmlData.thumb}" alt="Meal Thumbnail">
                  <div class="directionsBlock">
                    <div class="ingredientsBlock">
                      <h2>Ingredients</h2>
                      <div class="ingredientsContainer">${htmlIngredients}</div>
                    </div>
                    <div class="instructionsBlock">
                      <h2>Instructions</h2>
                      <div class="instructionsContainer">${htmlData.instructions}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>`
  }
}

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

const generateCard = async (url, templates) => {
  const response = await fetch(url);
  const data = await response.json();
  console.log(data.meals[0]['strIngredient1']);

  const htmlData = {
    meal: data.meals[0].strMeal,
    thumb: data.meals[0].strMealThumb,
    instructions: data.meals[0].strInstructions.replace(/'[0-9].' || 'STEP [0-9]'/g, '').split('\n').map(instruction => `<p>${instruction}</p>`).join(''),
    ingredients: getIngredients(data),
    measurements: getMeasurements(data),
  }

  const ingredientsHtml = htmlData.ingredients.map((ingredient, i) => {
    const measurement = htmlData.measurements[i] || '';
    return `<p>${measurement} ${ingredient}</p>`;
  }).join('');

  const finalHtml = templates.recipe(htmlData);
  const modalHtml = templates.modal(htmlData, ingredientsHtml);
  
  idCounter++;
  
  return [finalHtml, modalHtml];
};

// right here is the switching functionality
const moveCard = (id, direction) =>{

  const selection = document.getElementById(id);

  if(selection){
    selection
      .querySelector('i')
      .classList.toggle('fa-heart-broken', direction ==="toFavs");
    
    selection
      .querySelector('i')
      .classList.toggle('fa-heart', direction === 'toMain');
    
    const targetParent = 
      direction === 'toMain' 
        ? document.getElementById('container') 
        : document.getElementById('favorites');
    
    targetParent.appendChild(selection);

  }
}



foodItem.addEventListener('click', async () => {
  for (let i = 0; i < 10; i++) {
    const html = await generateCard(`https://www.themealdb.com/api/json/v1/1/random.php`, htmlTemplates);
    console.log(html[0]);
    console.log(html[1]);
    
    const recipeCard = document.createElement('template');
    recipeCard.innerHTML = html[0].trim();
    container.append(recipeCard.content.firstChild);

    const modalCard = document.createElement('template');
    modalCard.innerHTML = html[1].trim();
    main.append(modalCard.content.firstChild);
}
  // Modal functionality
  const modalOpen = "[data-open]";
  const modalClose = "[data-close]";
  const isVisible = 'show';



  const openModal = document.querySelectorAll(modalOpen);
  const closeModal = document.querySelectorAll(modalClose);

  for(const el of openModal){
    el.addEventListener('click', function() {
      const modalId = this.dataset.open;
      document.getElementById(modalId).classList.add(isVisible);
      event.preventDefault();
    });
  }

  for(const el of closeModal){
    el.addEventListener('click', function(){
      this.parentElement.parentElement.parentElement.classList.remove(isVisible);
    });
  }

  // Close Modal
  document.addEventListener('click', (e) =>{
    if(e.target === document.querySelector('.modal.show i')){
      document.querySelector('.modal.show').classList.remove(isVisible);
    }
  })
  
  document.addEventListener('keyup', (e) =>{
    if(e.key === 'Escape'){
      document.querySelector('.modal.show').classList.remove(isVisible);
    }
  });
  const recipes = Array.from(document.getElementsByClassName('recipe'));
  const addButtonSelector = document.querySelectorAll('div.recipe i');
  // const addButton = document.querySelectorAll(addButtonSelector)
  // console.log(addButton)
  addButtonSelector.forEach((item)=>{
    item.addEventListener('click', function(e){
      const recipe = e.target.closest('div.recipe');
      const target = recipe.parentNode.id;
      console.log(recipe, "recipe");
      console.log(target, "target");
      target == 'container' ? moveCard(recipe.id, 'toFavs') : moveCard(recipe.id, 'toMain')
  })});
});

// sort function will be here.  You need two.  One for the container and the other for the favs section.
const sortDataContainer = (direction) =>{
  const mainNode = document.getElementById("container");
  console.log(mainNode)
  const allItems = document.querySelectorAll("#container .recipe");
  const itemsArray = Array.from(allItems);
  console.log(itemsArray);
  direction === "desc"
  ? itemsArray.sort((a, b) => b.querySelector('h2').textContent.localeCompare(a.querySelector('h2').textContent)).forEach(item => mainNode.append(item))
  : itemsArray.sort((a, b) => a.querySelector('h2').textContent.localeCompare(b.querySelector('h2').textContent)).forEach(item => mainNode.append(item))
}

const sortDataFavs = (direction) =>{
  const mainNode = document.getElementById("favorites");
  console.log(mainNode)
  const allItems = document.querySelectorAll("#favorites .recipe");
  const itemsArray = Array.from(allItems);
  console.log(itemsArray);
  direction === "desc"
  ? itemsArray.sort((a, b) => b.querySelector('h2').textContent.localeCompare(a.querySelector('h2').textContent)).forEach(item => mainNode.append(item))
  : itemsArray.sort((a, b) => a.querySelector('h2').textContent.localeCompare(b.querySelector('h2').textContent)).forEach(item => mainNode.append(item))
}

// This applies the sorting function 
Array.from(sortBtn).forEach((button) => {
  button.addEventListener('click', function(e){
    if(e.target.parentNode.parentNode.classList.contains('favContainer')){
      console.log("BING")
      console.log(e.target.dataset.sortdir)
      sortDataFavs(e.target.dataset.sortdir);
    }else if(e.target.parentNode.parentNode.classList.contains('foodContainer')){
      console.log("BANG");
      console.log(e.target.dataset.sortdir)
      sortDataContainer(e.target.dataset.sortdir);
    }
  });
})

// Modals section