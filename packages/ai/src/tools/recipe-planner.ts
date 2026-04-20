type RecipePlanInput = {
  title: string;
  prepMinutes: number;
  cookMinutes: number;
  servings: number;
  ingredients: Array<unknown>;
};

export function summarizeRecipePlan(recipe: RecipePlanInput) {
  return {
    title: recipe.title,
    totalMinutes: recipe.prepMinutes + recipe.cookMinutes,
    servings: recipe.servings,
    ingredientCount: recipe.ingredients.length
  };
}