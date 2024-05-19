Here is the API documentation and data models in markdown format:

```markdown
# Example API Documentation

## Paths

### `/users/{userId}`

#### GET

**Summary**: Returns a user by ID.

**Parameters**:

- **userId** (path, required): The ID of the user to return. (integer, int64, minimum: 1)

**Responses**:

- '200': A user object. (application/json)

    ```json
    {
        "id": {
            "type": "integer",
            "format": "int64",
            "example": 4
        },
        "name": {
            "type": "string",
            "example": "Jessica Smith"
        }
    }
    ```

- '400': The specified user ID is invalid (not a number).

## Objects

### Ingredient

- **ingredientName** (str)
- **integrientTypeInfo** (list: str)
- **measurementInfo** (dict: {density_unit: str, amount: dec})
- **nutrientsInfo** (dict)
- **costInfo** (dict: {monetary_unit: str, amount: dec})

### User

- **userName** (str)
- **password** (str)
- **email** (str)
- **bDay** (str)
- **nameObj** (dict: {firstname: str, lastname: str, middle: str})
- **profilePic** (str)
- **sessionToken** (str)

### Recipe

- **name** (str)
- **ingredientsList** (dict)
- **steps** (dict)
- **servings** (str)
- **timeInfo** (str)

## MongoConnector

### User

- **createUser(userToAdds)**: Will fail currently if one of the users in batch cannot be added.
- **readUser(userNameToFind)**: Requires full username, will fail if not exists.
- **searchUsers(userName)**: Given username substring, will return list of users that contain.
- **updateUser(userName, userObject)**: Will attempt to find username and replace entire object with provided user object.
- **deleteUser(userName)**: Will attempt to find username and delete.

### Recipe

- **createRecipe(recipeToAdd)**: Given list of recipes will add to db. Will fail currently if one of the recipes in batch cannot be added.
- **searchRecipes(recipeName, ingredients)**: Given recipe name and ingredients substring, will return list of recipes that contain.
- **updateRecipe(recipeObject)**: Will attempt to find recipe name and replace entire object with provided object.
- **deleteRecipe(recipeName)**: Will attempt to find recipe by name and delete. Fail if name not exists (exact match).

### Ingredient

- **createIngredient(ingredientToAdd)**: Given list of ingredients will add to db. Will fail currently if one of the ingredient in batch cannot be added.
- **searchIngredients(name)**: Given ingredient name and ingredients substring, will return list of ingredient that contain.
- **updateIngredient(ingredientObject)**: Will attempt to find ingredient name and replace entire object with provided object.
- **deleteIngredient(ingredientName)**: Will attempt to find ingredient by name and delete. Fail if name not exists (exact match).

### Paths

#### `/user/{username}`

##### GET

If username is empty: return current user session user obj.

**Summary**: Returns a user by exact username.

**Responses**:

- '200'

##### POST

##### DELETE

#### `/users?name=John`

##### GET

#### `/ingredient/{ingredientname}`

##### GET

**Summary**: Returns a user by ID.

**Responses**:

- '200'

##### POST

##### DELETE

#### `/ingredients?name=sdfsd&type=integrientTypeInfo`

##### GET

#### `/recipe/{name}`

##### GET

**Summary**: Returns a user by ID.

**Responses**:

- '200'

##### POST

##### DELETE

#### `/recipes?name&type&ingredients&cost`

##### GET
```
