import { useState, useEffect } from "react";
import { useRecipesContext } from "../hooks/useRecipesContext";
import { useAuthContext } from "../hooks/useAuthContext";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

const RecipeDetails = ({ recipe }) => {
  const { dispatch } = useRecipesContext();
  const { user } = useAuthContext();

  const [isEditing, setIsEditing] = useState(false);
  const [updatedRecipe, setUpdatedRecipe] = useState(recipe);

  const handleEditClick = () => setIsEditing(true);
  const handleCancelEdit = () => {
    setIsEditing(false);
    setUpdatedRecipe(recipe);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedRecipe({ ...updatedRecipe, [name]: value });
  };

  const handleUpdate = async () => {
    if (!user) return;

    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes/${recipe._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(updatedRecipe),
    });

    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "UPDATE_RECIPE", payload: json });
      setIsEditing(false);
    } else {
      alert(`Error: ${json.error}`);
    }
  };

  const handleDelete = async () => {
    if (!user) return;

    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes/${recipe._id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "DELETE_RECIPE", payload: json });
    }
  };

  return (
    <div className="recipe-details">
      <h4>{isEditing ? "Edit Recipe" : recipe.name}</h4>

      {isEditing ? (
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={updatedRecipe.name} onChange={handleChange} />

          <label>Ingredients:</label>
          <textarea name="ingredients" value={updatedRecipe.ingredients} onChange={handleChange} />

          <label>Instructions:</label>
          <textarea name="instructions" value={updatedRecipe.instructions} onChange={handleChange} />

          <label>Preparation Time (minutes):</label>
          <input type="number" name="preparationTime" value={updatedRecipe.preparationTime} onChange={handleChange} />

          <label>Difficulty Level (Easy, Medium, Hard):</label>
          <input type="text" name="difficultyLevel" value={updatedRecipe.difficultyLevel} onChange={handleChange} />

          <button onClick={handleUpdate}>Save Changes</button>
          <button onClick={handleCancelEdit}>Cancel</button>
        </div>
      ) : (
        <>
          <p><strong>Ingredients:</strong> {recipe.ingredients}</p>
          <p><strong>Instructions:</strong> {recipe.instructions}</p>
          <p><strong>Preparation Time (minutes):</strong> {recipe.preparationTime}</p>
          <p><strong>Difficulty Level:</strong> {recipe.difficultyLevel}</p>
          <p>{formatDistanceToNow(new Date(recipe.createdAt), { addSuffix: true })}</p>

          <span className="material-symbols-outlined" onClick={handleDelete}>delete</span>
          <button onClick={handleEditClick}>Edit Recipe</button>
        </>
      )}
    </div>
  );
};

export default RecipeDetails;

// import { useRecipesContext } from '../hooks/useRecipesContext'
// import { useAuthContext } from '../hooks/useAuthContext'
// import { useState } from 'react';


// const RecipeDetails = ({ recipe }) => {
//   const { recipes, dispatch } = useRecipesContext();
//   const { user } = useAuthContext();

//   const [isEditing, setIsEditing] = useState(false);
//   const [updatedRecipe, setUpdatedRecipe] = useState(recipe);

//   const handleEditClick = () => {
//     setIsEditing(true);
//   };

//   const handleCancelEdit = () => {
//     setIsEditing(false);
//     setUpdatedRecipe(recipe); // Reset the form back to original values
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setUpdatedRecipe({
//       ...updatedRecipe,
//       [name]: value,
//     });
//   };

//   const handleUpdate = async () => {
//     if (!user) return;

//     const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes/${recipe._id}`, {
//       method: 'PATCH',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${user.token}`,
//       },
//       body: JSON.stringify(updatedRecipe),
//     });

//     const json = await response.json();

//     if (response.ok) {
//       dispatch({ type: 'UPDATE_RECIPE', payload: json });
//       setIsEditing(false);  // Close the edit form after updating
//     } else {
//       alert(`Error: ${json.error}`);
//     }
//   };

//   return (
//     <div className="recipe-details">
//       <h4>{isEditing ? 'Edit Recipe' : recipe.name}</h4>

//       {isEditing ? (
//         <div>
//           <label>Name:</label>
//           <input
//             type="text"
//             name="name"
//             value={updatedRecipe.name}
//             onChange={handleChange}
//           />

//           <label>Ingredients:</label>
//           <textarea
//             name="ingredients"
//             value={updatedRecipe.ingredients}
//             onChange={handleChange}
//           />

//           <label>Step by step instructions:</label>
//           <textarea
//             name="instructions"
//             value={updatedRecipe.instructions}
//             onChange={handleChange}
//           />

//           <label>Preparation Time, in minutes:</label>
//           <input
//             type="number"
//             name="preparationTime"
//             value={updatedRecipe.preparationTime}
//             onChange={handleChange}
//           />

//           <label>Difficulty Level, (Easy, Medium, Hard):</label>
//           <input
//             type="text"
//             name="difficultyLevel"
//             value={updatedRecipe.difficultyLevel}
//             onChange={handleChange}
//           />

//           <button onClick={handleUpdate}>Save Changes</button>
//           <button onClick={handleCancelEdit}>Cancel</button>
//         </div>
//       ) : (
//         <>
//           <p><strong>Ingredients: </strong>{recipe.ingredients}</p>
//           <p><strong>Instructions: </strong>{recipe.instructions}</p>
//           <p><strong>Preparation Time (in minutes): </strong>{recipe.preparationTime}</p>
//           <p><strong>Difficulty level: </strong>{recipe.difficultyLevel}</p>

//           <button onClick={handleEditClick}>Edit Recipe</button>
//         </>
//       )}
//     </div>
//   );
// };

// export default RecipeDetails;
