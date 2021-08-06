var arrayOfFilters = [];

var searchInputBar = $('input[name = "input"]');

$("#submit").on("click", function () {
  recipeDiv.html("");
  arrayOfFilters = [];
  console.log("button clicked");
  $("input:checkbox[name=filters]:checked").each(function () {
    //  arrayOfFilters.push("&health=" + $(this).val().toLowerCase());
    arrayOfFilters.push($(this).val());
    console.log(arrayOfFilters); //console log
  });

  console.log(arrayOfFilters);
  localStorage.setItem("searchInput", searchInputBar.val());
  console.log(localStorage.getItem("searchInput")); //console log
  //console.log(arrayOfFilters.join(""));
  userInput.search = localStorage.getItem("searchInput");
  console.log(userInput);
  getRecipesByCalorie(userInput); //calling the first function
});

// ***** RETRIEVE DATA ACCORDING TO USER'S NEEDS *****

// Object to store user's response to form
let userInput = {
  age: 19,
  gender: "male",
  height: 180,
  weight: 70,
  search: "",
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
    getRecipes(userInput, response.calorie / 3); //3 meals
    console.log(response.calorie); // these are the calories for user display these in page
  });
}

// ***** MANAGE API CALL TO FOOD API TO GET RECIPES *****

function getFoodUrl(userInput) {
  const params = "search?q=" + userInput.search + "&from=0&to=100";
  //&health=alcohol-free" + arrayOfFilters.join("")
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
  var vaildRecipes = [];
  console.log("max allowed " + calorie);

  for (let i = 0; i < recipes.length; i++) {
    //console.log(recipes[i])
    var vaild = true;

    for (let j = 0; j < arrayOfFilters.length; j++) {
      console.log(arrayOfFilters[j]);
      if (
        !Object.values(recipes[i].recipe.healthLabels).includes(
          arrayOfFilters[j]
        )
      ) {
        vaild = false;
      }
    }
    if (recipes[i].recipe.calories > calorie) {
      vaild = false;
    }
    console.log(vaild);
    if (vaild) {
      vaildRecipes.push(recipes[i]);
    }
  }
  showRecipes(vaildRecipes); //call the showRecipes function
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

    var img = $("<img>");
    img.attr("src", recipes[i].recipe.image);
    // img.text(recipes[i].recipe.image);

    //append them
    recipeDiv.append(div);
    div.append(recipeName);
    div.append(calories);
    div.append(recipeLink);
    div.append(img);
  }
}

//function clearBox (recipeDiv){
//    while(div.firstChild)
//}

/*
function processRecipes(recipes, calorie) {
  var vaildRecipes = [];

  for (let i = 0; i < recipes.length; i++) {
    //console.log(recipes[i])
    var vaild = true;

    for (let j = 0; j < arrayOfFilters.length; j++) {
        console.log(arrayOfFilters[j])
      if (
        !Object.values(recipes[i].recipe.healthLabels).includes(
          arrayOfFilters[j]
        )
      ) {
        vaild = false;
      }
      if (recipes[i].recipe.calories < calorie) {
        vaild = false;
      }
    }
    console.log(vaild)
    if (vaild) {
        console.log("vaild")
      vaildRecipes.push(recipes[i]);
    }
  }
  showRecipes(vaildRecipes); //call the showRecipes function
}
*/
