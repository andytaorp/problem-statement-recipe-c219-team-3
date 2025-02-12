import React, { useState, useEffect } from 'react';
import { useRecipesContext } from '../hooks/useRecipesContext';

const RecipeList = () => {
  const { recipes } = useRecipesContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState(recipes);

  useEffect(() => {
    setFilteredRecipes(
      recipes.filter(recipe => 
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.ingredients.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, recipes]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search by recipe name or ingredients"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div>
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe) => (
            <div key={recipe._id}>
              <h3>{recipe.name}</h3>
              <p>{recipe.ingredients}</p>
            </div>
          ))
        ) : (
          <p>No recipes found</p>
        )}
      </div>
    </div>
  );
};
const [sortOption, setSortOption] = useState(''); // Sort option state
const [sortedRecipes, setSortedRecipes] = useState(recipes);

useEffect(() => {
  if (sortOption === 'time') {
    setSortedRecipes([...recipes].sort((a, b) => a.preparationTime - b.preparationTime));
  } else if (sortOption === 'difficulty') {
    setSortedRecipes([...recipes].sort((a, b) => a.difficultyLevel - b.difficultyLevel));
  } else {
    setSortedRecipes(recipes); // Default to original recipe list
  }
}, [sortOption, recipes]);

return (
  <div>
    <select onChange={(e) => setSortOption(e.target.value)} value={sortOption}>
      <option value="">Sort by</option>
      <option value="time">Preparation Time</option>
      <option value="difficulty">Difficulty Level</option>
    </select>

    <div>
      {sortedRecipes.map((recipe) => (
        <div key={recipe._id}>
          <h3>{recipe.name}</h3>
          <p>{recipe.ingredients}</p>
          <p>Prep Time: {recipe.preparationTime} mins</p>
          <p>Difficulty Level: {recipe.difficultyLevel}</p>
        </div>
      ))}
    </div>
  </div>
);

export default RecipeList;
