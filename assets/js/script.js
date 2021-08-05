var arrayOfFilters = [];

var searchInputBar = $('input[name = "input"]');

$("#submit").on("click", function () {
  console.log("button clicked");
  recipeDiv.innerHTML = "";
  $("input:checkbox[name=filters]:checked").each(function () {
    arrayOfFilters.push("&health=" + $(this).val().toLowerCase());
    console.log(arrayOfFilters); //console log
  });
  console.log(arrayOfFilters);
  localStorage.setItem("searchInput", searchInputBar.val());
  console.log(localStorage.getItem("searchInput")); //console log
  console.log(arrayOfFilters.join(""));
  getRecipesByCalorie(userInput); //calling the first function
});
var searchInput = localStorage.getItem("searchInput");

// ***** RETRIEVE DATA ACCORDING TO USER'S NEEDS *****

// Object to store user's response to form
let userInput = {
  age: 19,
  gender: "male",
  height: 180,
  weight: 70,
  search: searchInput,
};

// Start the API Call to retrieve all recipies filtered by calories
//getRecipesByCalorie(userInput);

// ***** MANAGE API CALL TO FITNESS API TO GET CALORIE INTAKE FOR USER *****

// Get the API url for calorie intake
function getCalorieUrl(userInput) {
  const params =
    "macrocalculator?age=" +
    userInput.age +
    "&gender=" +
    userInput.gender +
    "&height=" +
    userInput.height +
    "&weight=" +
    userInput.weight +
    "&activitylevel=3&goal=maintain";
  const url = "https://fitness-calculator.p.rapidapi.com/" + params;

  return url;
}

// Make API call to Fitness API to get recipes by max calorie intake
function getRecipesByCalorie(userInput) {
  const settings = {
    async: true,
    crossDomain: true,
    url: getCalorieUrl(userInput),
    method: "GET",
    headers: {
      "x-rapidapi-key": "063a4befffmsh982429b07695621p17a36cjsnc0376e97dbec",
      "x-rapidapi-host": "fitness-calculator.p.rapidapi.com",
    },
  };

  // Calculate max calorie intake. Use data to filter food
  $.ajax(settings).then(function (response) {
    getRecipes(userInput, response.calorie); //3 meals
    console.log(response.calorie); // these are the calories for user display these in page
  });
}

// ***** MANAGE API CALL TO FOOD API TO GET RECIPES *****

function getFoodUrl(userInput) {
  const params =
    "search?q=" + userInput.search + "&from=0&to=17" + arrayOfFilters.join("");
  //&health=alcohol-free"
  const url = "https://edamam-recipe-search.p.rapidapi.com/" + params;

  return url;
}

// Retrieve all recipes that satisfy user's search
function getRecipes(userInput, calorie) {
  console.log(calorie); //calories divied by 3 meals
  // Make API Call
  const settings = {
    async: true,
    crossDomain: true,
    url: getFoodUrl(userInput),
    method: "GET",
    headers: {
      "x-rapidapi-key": "063a4befffmsh982429b07695621p17a36cjsnc0376e97dbec",
      "x-rapidapi-host": "edamam-recipe-search.p.rapidapi.com",
    },
  };

  $.ajax(settings).done(function (response) {
    processRecipes(response.hits, calorie);
  });
}

// Filter recipes according to user input
function processRecipes(recipes, calorie) {
  for (let i = 0; i < recipes.length; i++) {
    if (recipes[i].recipe.calories < calorie) {
      console.log(recipes[i]);
      console.log(recipes.length);
    }
  }
  showRecipes(recipes); //call the showRecipes function
}

//my stuff

var recipeDiv = $("#recipeDiv");

function showRecipes(recipes) {
  for (var i = 0; i < recipes.length; i++) {
    console.log(recipes.length);
    console.log(recipes[i]);
    //console.log(recipes[0].recipe.label)

    var div = $("<div>");

    var recipeName = $("<h4>");
    recipeName.text(recipes[i].recipe.label);

    var calories = $("<p>");
    calories.text("Calories: " + Math.round(recipes[i].recipe.calories));

    var recipeLink = $("<a>");
    recipeLink.attr("href", recipes[i].recipe.url);
    recipeLink.attr("target", "_blank");
    recipeLink.text("Link" + recipes[i].recipe.url);

    //append them
    recipeDiv.append(div);
    div.append(recipeName);
    div.append(calories);
    div.append(recipeLink);
  }
}
