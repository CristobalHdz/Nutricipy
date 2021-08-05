var test = $("#test")
var arrayTest = [1,2,3,4,5,6,7,8];

for (var i = 0; i < arrayTest.length; i++){
 console.log(arrayTest[i])
    var div = $("<div>")

    var recipeName = $("<h4>")
   recipeName.text("Recipe Name")

   var recipeLink = $("<a>")
   recipeLink.text("Link")
   recipeLink.href = "www.amazon.com"

   //currently just do body
   test.append(div)
   div.append(recipeName)
   div.append(recipeLink)

}