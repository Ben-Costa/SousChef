Example API Documentation
paths:
  /users/{userId}:
    get:
      summary: Returns a user by ID.
      parameters:
        - name: userId
          in: path
          required: true
          description: The ID of the user to return.
          schema:
            type: integer
            format: int64
            minimum: 1
      responses:
        '200':
          description: A user object.
          content:
            application/json:
              schema:
                type: object
                properties:
                  id:
                    type: integer
                    format: int64
                    example: 4
                  name:
                    type: string
                    example: Jessica Smith
        '400':
          description: The specified user ID is invalid (not a number).

Objects:
    - ingredient
        ingredientName (str)
        integrientTypeInfo (str)
        measurementInfo (dict)
        nutrientsInfo (dict)
        costInfo (str)
    - user
        userName (str)
        password (str)
        email (str)
        bDay (str)
        nameObj (dict)
        profilePic (str)
    - recipe
        name (str)
        ingredientsList (dict) 
        steps (dict) 
        servings (str)
        timeInfo (dateTime)

MongoConnector: 
    - user
        createUser(userToAdds)
          - will fail currently if one of the users in batch cannot be                added
        readUser(userNameToFind)
          - requires full username, fill fail if not exists
        searchUsers(userName)
          - given username substring, will return list of users that                  contain 
        updateUser(userName, userObject)
          - will attempt to find username and replace entire object with             provided user object
        deleteUser(userName)
          - will attempt to find username and delete
    - recipe
        createRecipe(recipeToAdd)
          - given list of recipes will add to db
          - will fail currently if one of the recipes in batch cannot be                added
        searchRecipes(recipeName, ingredients)
          - given recipe name and ingrecients substring, will return                 list of recipes that contain 
        updateRecipe(recipeObject)
          - will attempt to find recipe name and replace entire object               with provided object
        deleteRecipe(recipeName)
          - will attempt to find recipe by name and delete
          - fail if name not exists (exact match)
    - ingredient 
        createIngredient(ingredienToAdd)
          - given list of ingredients will add to db
          - will fail currently if one of the ingredient in batch cannot be          added
        searchIngredients(name)
          - given ingredient name and ingrecients substring, will return             list of ingredient that contain 
        updateIngredient(ingredientObject)
          - will attempt to find ingredient name and replace entire                  object with provided object
        deleteIngredient(ingredientName)
          - will attempt to find ingredient by name and delete
          - fail if name not exists (exact match)
paths:
  /users:
    get:
      summary: Returns a user by ID.
      parameters:
        - 
      responses:
        '200':
    post:

    delete:
    
  /ingredients:
    get:
      summary: Returns a user by ID.
      parameters:
        - 
      responses:
        '200':
    post:

    delete:

  /Recipes:
    get:
      summary: Returns a user by ID.
      parameters:
        - 
      responses:
        '200':
    post:

    delete:
