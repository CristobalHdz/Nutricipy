// User variables
var userInput = {
  age: 0,
  gender: "",
  height: 0,
  weight: 0,
  search: "",
};
var cal = 0;
var arrayOfFilters = [];
var arrayOfCautions = [];

// Redirect to second page
var otherHtml = "./assets/secondPage.html";

// Selecting DOM elements
var calculateBtn = $("#calculateBtn");
var searchInputBar = $('input[name = "input"]');
var heightInput = $("#heightInput");
var weightInput = $("#weightInput");
var ageInput = $("#ageInput");
var genderInput = $("#genderDiv");
var calculatedBmi = $("#bmi-Category");
var recipeDiv = $("#recipeDiv");

// Get values from local storage
heightInput.val(localStorage.getItem("height"));
weightInput.val(localStorage.getItem("weight"));
ageInput.val(localStorage.getItem("age"));
/*
  Retrieve the value of gender from local storage
  and display it to the page
*/
var selectedGender = localStorage.getItem("gender");
if (selectedGender == "male") {
  $('input[value="male"]').prop("checked", true);
} else if (selectedGender == "female") {
  $('input[value="female"]').prop("checked", true);
}

// Retrieve input from user from first page and switch pages
calculateBtn.on("click", function () {
  // Setting user input to local storage
  localStorage.setItem("height", heightInput.val());
  localStorage.setItem("weight", weightInput.val());
  localStorage.setItem("age", ageInput.val());
  localStorage.setItem("gender", $('input[name="gender"]:checked').val());
  localStorage.setItem("unit", $('input[name="measure"]:checked').val());

  updateUserInfo();
  location.replace(otherHtml);
});

// Updates the variable userInput based on values from local storage and converts if to metric if
// imperial unit is selected
function updateUserInfo() {
  var selectedUnit = localStorage.getItem("unit");
  if (selectedUnit == "metric") {
    $('input[value="metric"]').prop("checked", true);
    userInput.height = parseFloat(localStorage.getItem("height"));
    userInput.weight = parseFloat(localStorage.getItem("weight"));
    userInput.age = parseInt(localStorage.getItem("age"));
    userInput.gender = localStorage.getItem("gender");
    userInput.Unit = localStorage.getItem("Unit");
  } else if (selectedUnit == "imperial") {
    $('input[value="imperial"]').prop("checked", true);
    userInput.height = parseFloat(localStorage.getItem("height"))*30.48;
    userInput.weight = parseFloat(localStorage.getItem("weight"))*.454;
    userInput.age = parseInt(localStorage.getItem("age"));
    userInput.gender = localStorage.getItem("gender");
    userInput.Unit = localStorage.getItem("Unit");
  }
}

// Event listener for when the user clicks search
$("#submit").on("click", function () {
  updateUserInfo(); // Maybe it is redundant
  recipeDiv.html(""); // Clear dinamically created recipes

  // Reset filters
  arrayOfFilters = [];
  arrayOfCautions = [];
  
  // Push the user input into arrayOfFilters
  $("input:checkbox[name=filters]:checked").each(function () {
    arrayOfFilters.push($(this).val());
  });

  // Push the user input into arrayOfCautions
  $("input:checkbox[name=caution]:checked").each(function () {
    arrayOfCautions.push($(this).val());
  });

  // Store and add the search into local storage
  localStorage.setItem("searchInput", searchInputBar.val());
  userInput.search = localStorage.getItem("searchInput");

  // Calls the API to retrieve recipes based on max calories
  getRecipes(userInput, cal); 
});

// ***** RETRIEVE DATA ACCORDING TO USER'S NEEDS *****

// Object to store user's response to form
//to calculate bmi
function calculateBMI() {
  var weight = userInput.weight;
  var height = userInput.height;

  // Formula to calculate BMI
  var bmi = (weight / ((height * height) / 10000)).toFixed(2);

  /* 
    Display a message according to category of BMI in id calorie
    Add class to change color appropriately
  */
  if (bmi < 18.6) {
    calculatedBmi.text("Underweight");
    calculatedBmi.addClass("underWeight");
  } else if (bmi >= 18.6 && bmi < 24.9) {
    calculatedBmi.text("Normal");
    calculatedBmi.addClass("normalWeight");
  } else {
    calculatedBmi.text("Overweight");
    calculatedBmi.addClass("overWeight");
  }
}

// Get BMI and display calories
updateUserInfo();
getRecipesByCalorie(userInput);
calculateBMI();

// ***** MANAGE API CALL TO FITNESS API TO GET CALORIE INTAKE FOR USER *****

// Get the API url for calorie intake
function getCalorieUrl(userInput) {
  var params =
    "macrocalculator?age=" 
    + userInput.age 
    + "&gender=" 
    + userInput.gender
    + "&height=" 
    + userInput.height 
    + "&weight=" 
    + userInput.weight 
    + "&activitylevel=3&goal=maintain";

  var url = "https://fitness-calculator.p.rapidapi.com/" + params;

  return url;
}

// Make API call to Fitness API to get recipes by max calorie intake
function getRecipesByCalorie(userInput) {
  var settings = {
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
    $("#calories").text(Math.round(response.calorie / 3));
    cal = response.calorie / 3;
  });
}

// ***** MANAGE API CALL TO FOOD API TO GET RECIPES *****

// Get API url for recipe API
function getFoodUrl(userInput) {
  var params = "search?q=" + userInput.search + "&from=0&to=100";
  var url = "https://edamam-recipe-search.p.rapidapi.com/" + params;

  return url;
}

// Retrieve all recipes that satisfy user's search
function getRecipes(userInput, calorie) {
  var settings = {
    async: true,
    crossDomain: true,
    url: getFoodUrl(userInput),
    method: "GET",
    headers: {
      "x-rapidapi-key": "55e1fbba30msh2921cd4e574c53ep131afejsnd738f6e0eef3",
      "x-rapidapi-host": "edamam-recipe-search.p.rapidapi.com",
    },
  };

  $.ajax(settings).done(function (response) {
    processRecipes(response.hits, calorie);
  });
}

// Filter recipes according to user input
function processRecipes(recipes, calorie) {
  var validRecipes = [];

  for (var i = 0; i < recipes.length; i++) {
    var valid = true;

    // Check if recipe has appropriate health labels
    for (var j = 0; j < arrayOfFilters.length; j++) {
      console.log(arrayOfFilters[j]);
      if (
        !Object.values(recipes[i].recipe.healthLabels).includes(
          arrayOfFilters[j]
        )
      ) {
        valid = false;
      }
    }

    // Check if recipe doesn't have caution ingredients
    for (var j = 0; j < arrayOfCautions.length; j++) {
      if (
        Object.values(recipes[i].recipe.cautions).includes(arrayOfCautions[j])
      ) {
        valid = false;
      }
    }

    // Check if recipe does not exceed calorie limit
    if (recipes[i].recipe.calories > calorie) {
      valid = false;
    }

    if (valid) {
      validRecipes.push(recipes[i]);
    }
  }

  showRecipes(validRecipes); //call the showRecipes function
}

// Display the valid recipes in the screen
function showRecipes(recipes) {
  for (var i = 0; i < recipes.length; i++) {
    // Creating the card dinamically
    var div = $("<div>");
    div.addClass("card horizontal");

    var divImage = $("<div>");
    divImage.addClass("card-image col s10 m3 l3");

    var divStacked = $("<div>");
    divStacked.addClass("card-stacked");

    var divContent = $("<div>");
    divContent.addClass("card-content");

    var divAction = $("<div>");
    divAction.addClass("card-action");

    var recipeName = $("<h4>");
    recipeName.text(recipes[i].recipe.label);

    var calories = $("<p>");
    calories.text("Calories: " + Math.round(recipes[i].recipe.calories));

    var recipeLink = $("<a>");
    recipeLink.attr("href", recipes[i].recipe.url);
    recipeLink.attr("target", "_blank");
    recipeLink.text("Show Recipe");

    var img = $("<img>");

    img.attr("src", recipes[i].recipe.image);

    // Create card and append to recipe div
    divStacked.append(divContent);
    divStacked.append(divAction);
    div.append(divStacked);
    div.append(divImage);
    divContent.append(recipeName);
    divContent.append(calories);
    divAction.append(recipeLink);
    divImage.append(img);
    recipeDiv.append(div);
  }
}