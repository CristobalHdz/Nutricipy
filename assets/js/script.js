var cal = 0;

var arrayOfFilters = [];
var arrayOfCautions = [];
var otherHtml = "assets/secondPage.html";

var calculateBtn = $("#calculateBtn");
var searchInputBar = $('input[name = "input"]');
var heightInput = $("#heightInput");
var weightInput = $("#weightInput");
var ageInput = $("#ageInput");
var genderInput = $("#genderDiv");
var calculatedBmi = $("#bmi-Category");

heightInput.val(localStorage.getItem("height"));
weightInput.val(localStorage.getItem("weight"));
ageInput.val(localStorage.getItem("age"));

var selectedGender = localStorage.getItem("gender");

if (selectedGender == "male") {
  $('input[value="male"]').prop("checked", true);
} else if (selectedGender == "female") {
  $('input[value="female"]').prop("checked", true);
}

calculateBtn.on("click", function () {
  console.log("btn");
  localStorage.setItem("height", heightInput.val());
  console.log(localStorage.getItem("height"));

  localStorage.setItem("weight", weightInput.val());
  console.log(localStorage.getItem("weight"));

  localStorage.setItem("age", ageInput.val());
  console.log(localStorage.getItem("age"));

  localStorage.setItem("gender", $('input[name="gender"]:checked').val());
  console.log(localStorage.getItem("gender"));

  localStorage.setItem("unit", $('input[name="measure"]:checked').val());
  console.log(localStorage.getItem("measure"));

  updateUserInfo();
  console.log(userInput);
  location.replace(otherHtml);
});

function updateUserInfo() {
  var selectedUnit = localStorage.getItem("unit");
  if (selectedUnit == "metric") {
    $('input[value="metric"]').prop("checked", true);
    userInput.height = parseInt(localStorage.getItem("height"));
    console.log(userInput.height);
    userInput.weight = parseInt(localStorage.getItem("weight"));
    console.log(userInput.weight);
    userInput.age = parseInt(localStorage.getItem("age"));
    console.log(userInput.age);
    userInput.gender = localStorage.getItem("gender");
    console.log(userInput.gender);
    userInput.Unit = localStorage.getItem("Unit");
    console.log(userInput.Unit);
  } else if (selectedUnit == "imperial") {
    $('input[value="imperial"]').prop("checked", true);
    userInput.height = parseInt(localStorage.getItem("height"))*30.48;
    console.log(userInput.height);
    userInput.weight = parseInt(localStorage.getItem("weight"))*.454;
    console.log(userInput.weight);
    userInput.age = parseInt(localStorage.getItem("age"));
    console.log(userInput.age);
    userInput.gender = localStorage.getItem("gender");
    console.log(userInput.gender);
    userInput.Unit = localStorage.getItem("Unit");
    console.log(userInput.Unit);
  }
  console.log(selectedUnit);



}

$("#submit").on("click", function () {
  updateUserInfo();
  console.log(userInput);
  recipeDiv.html("");
  arrayOfFilters = [];
  arrayOfCautions = [];
  console.log("button clicked");
  $("input:checkbox[name=filters]:checked").each(function () {
    //  arrayOfFilters.push("&health=" + $(this).val().toLowerCase());
    arrayOfFilters.push($(this).val());
  });

  $("input:checkbox[name=caution]:checked").each(function () {
    //  arrayOfFilters.push("&health=" + $(this).val().toLowerCase());
    arrayOfCautions.push($(this).val());
  });

  console.log(arrayOfFilters);
  console.log(arrayOfCautions);
  localStorage.setItem("searchInput", searchInputBar.val());
  console.log(localStorage.getItem("searchInput")); //console log
  //console.log(arrayOfFilters.join(""));
  userInput.search = localStorage.getItem("searchInput");
  console.log(userInput);
  //getRecipesByCalorie(userInput); //calling the first function
  getRecipes(userInput, cal); //3 meals
});

// ***** RETRIEVE DATA ACCORDING TO USER'S NEEDS *****

// Object to store user's response to form
let userInput = {
  age: 0,
  gender: "",
  height: "0",
  weight: 0,
  search: "",
};
//to calculate bmi
function calculateBMI() {
  var weight = userInput.weight;

  console.log("userINput " + weight);

  var height = userInput.height;
  console.log("userINput " + height);
  let bmi = (weight / ((height * height) / 10000)).toFixed(2);
  console.log(bmi);

  if (bmi < 18.6) {
    console.log("underweight");
    calculatedBmi.text("Underweight");
    calculatedBmi.addClass("underWeight");
  } else if (bmi >= 18.6 && bmi < 24.9) {
    console.log("normal");
    calculatedBmi.text("Normal");
    calculatedBmi.addClass("normalWeight");
  } else {
    console.log("overweight");
    calculatedBmi.text("Overweight");
    calculatedBmi.addClass("overWeight");
  }
}

// Start the API Call to retrieve all recipies filtered by calories
updateUserInfo();
getRecipesByCalorie(userInput);
calculateBMI();

// ***** MANAGE API CALL TO FITNESS API TO GET CALORIE INTAKE FOR USER *****

// Get the API url for calorie intake
function getCalorieUrl(userInput) {
  console.log(userInput);
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
    // REMINDER: I DELETED THE DIVISION FOR TESTING PURPOSES
    // ********************
    // ********************
    console.log(response); // these are the calories for user display these in page
    $("#calories").text(Math.round(response.calorie / 3));

    // getRecipes(userInput, response.calorie / 3); //3 meals
    cal = response.calorie / 3;
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
  console.log("max allowed " + calorie);

  for (let i = 0; i < recipes.length; i++) {
    var valid = true;

    // Check if recipe has appropriate health labels
    for (let j = 0; j < arrayOfFilters.length; j++) {
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
    for (let j = 0; j < arrayOfCautions.length; j++) {
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

//my stuff

var recipeDiv = $("#recipeDiv");

function showRecipes(recipes) {
  for (var i = 0; i < recipes.length; i++) {
    console.log(recipes.length);
    console.log(recipes[i]);
    //console.log(recipes[0].recipe.label)

    var div = $("<div>");
    div.addClass("card");
    div.addClass("horizontal");
    var div2 = $("<div>");
    div2.addClass("card-image col s10 m3 l3");

    var div3 = $("<div>");
    div3.addClass("card-stacked");

    var div4 = $("<div>");
    div4.addClass("card-content");

    var div5 = $("<div>");
    div5.addClass("card-action");

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
    // img.text(recipes[i].recipe.image);

    //append them
    div3.append(div4);
    div3.append(div5);
    div.append(div3);
    div.append(div2);
    div4.append(recipeName);
    div4.append(calories);
    div5.append(recipeLink);
    div2.append(img);
    recipeDiv.append(div);
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
