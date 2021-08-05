// ***** MANAGE API CALL TO FITNESS API TO GET CALORIE INTAKE FOR USER *****

// Get the API url for calorie intake
function getCalorieUrl(userInput) {
	const params = (
		"macrocalculator?age="
		+ userInput.age
		+ "&gender="
		+ userInput.gender
		+ "&height="
		+ userInput.height
		+ "&weight="
		+ userInput.weight
		+ "&activitylevel=3&goal=maintain"
	);
	const url = "https://fitness-calculator.p.rapidapi.com/" + params;

	return url;
}

// Make API call to Fitness API to get recipes by max calorie intake
function getRecipesByCalorie(userInput) {
	const settings = {
		"async": true,
		"crossDomain": true,
		"url": getCalorieUrl(userInput), 
		"method": "GET",
		"headers": {
			"x-rapidapi-key": "063a4befffmsh982429b07695621p17a36cjsnc0376e97dbec",
			"x-rapidapi-host": "fitness-calculator.p.rapidapi.com"
		}
	};

	// Calculate max calorie intake. Use data to filter food
 	$.ajax(settings).then(function (response) {
		 getRecipes(userInput, response.calorie);
		 console.log(response)// these are the calories for user display these in page
	});
}

// ***** MANAGE API CALL TO FOOD API TO GET RECIPES *****

function getFoodUrl(userInput) {
	const params = (
		"search?q=" 
		+ userInput.search
		+ "&from=0&to=100"
	)
	const url = "https://edamam-recipe-search.p.rapidapi.com/" + params;

	return url
}

// Retrieve all recipes that satisfy user's search
function getRecipes(userInput, calorie) {
	// Make API Call
	const settings = {
		"async": true,
		"crossDomain": true,
		"url": getFoodUrl(userInput),
		"method": "GET",
		"headers": {
			"x-rapidapi-key": "063a4befffmsh982429b07695621p17a36cjsnc0376e97dbec",
			"x-rapidapi-host": "edamam-recipe-search.p.rapidapi.com"
		}
	};

	$.ajax(settings).done(function (response) {
		processRecipes(response.hits, calorie);
	});

}

// Filter recipes according to user input
function processRecipes(recipes, calorie) {
	for(let i = 0; i < recipes.length; i++) {
		if(recipes[i].recipe.calories < calorie)
			console.log(recipes[i]);
	}
}

// ***** RETRIEVE DATA ACCORDING TO USER'S NEEDS *****

// Object to store user's response to form
let userInput = {
	age: 19,
	gender: "male",
	height: 180,
	weight: 70,
	search: "beef",
};

// Start the API Call to retrieve all recipies filtered by calories
getRecipesByCalorie(userInput);



//my stuff

var test = $("#test");
var arrayTest = [1, 2, 3, 4, 5, 6, 7, 8];

for (var i = 0; i < arrayTest.length; i++) {
  console.log(arrayTest[i]);
  var div = $("<div>");

  var recipeName = $("<h4>");
  recipeName.text("Recipe Name");

  var recipeLink = $("<a>");
  recipeLink.attr("href", "http://www.google.com");
  recipeLink.attr("target", "_blank");
  recipeLink.text("link");

  //currently just do body
  test.append(div);
  div.append(recipeName);
  div.append(recipeLink);
}
