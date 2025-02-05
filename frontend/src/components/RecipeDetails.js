import { useRecipesContext } from '../hooks/useRecipesContext'
import { useAuthContext } from '../hooks/useAuthContext'
import { useEffect } from "react";
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

const RecipeDetails = ({ recipe }) => {
  const { recipes, dispatch } = useRecipesContext();
  const { user } = useAuthContext();

  // ✅ Fetch Recipes When Page Loads
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes`);
        const json = await response.json();

        if (response.ok) {
          dispatch({ type: 'SET_RECIPES', payload: json }); // ✅ Save recipes globally
        }
      } catch (error) {
        console.error("Failed to fetch recipes:", error);
      }
    };

    if (user) {
      fetchRecipes();
    }
  }, [dispatch, user]); // ✅ Only fetch if user is logged in

  const handleDelete = async () => {
    if (!user) return;

    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes/${recipe._id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.token}`,
      }
    });

    const json = await response.json();

    if (response.ok) {
      dispatch({ type: 'DELETE_RECIPE', payload: json });
    }
  };

  const handleUpdate = async () => {
    if (!user) return;

    const updatedRecipe = {
      name: recipe.name,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      preparationTime: recipe.preparationTime,
      difficultyLevel: recipe.difficultyLevel
    };

    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes/${recipe._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`,
      },
      body: JSON.stringify(updatedRecipe)
    });

    const json = await response.json();

    if (response.ok) {
      dispatch({ type: 'UPDATE_RECIPE', payload: json });
    }
  };

  return (
    <div className="recipe-details">
      <h4>{recipe.name}</h4>
      <p><strong>Ingredients: </strong>{recipe.ingredients}</p>
      <p><strong>Instructions: </strong>{recipe.instructions}</p>
      <p><strong>Preparation Time (in minutes): </strong>{recipe.preparationTime}</p>
      <p><strong>Difficulty level: </strong>{recipe.difficultyLevel}</p>
      <p>{formatDistanceToNow(new Date(recipe.createdAt), { addSuffix: true })}</p>

      <span className="material-symbols-outlined" onClick={handleDelete}>delete</span>
      <button onClick={handleUpdate}>Edit Recipe</button>
    </div>
  );
};

export default RecipeDetails;
