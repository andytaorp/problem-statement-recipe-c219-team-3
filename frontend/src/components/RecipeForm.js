import { useState } from 'react'
import { useRecipesContext } from '../hooks/useRecipesContext'
import { useAuthContext } from '../hooks/useAuthContext'

const RecipeForm = () => {
  const { dispatch } = useRecipesContext()
  const { user } = useAuthContext()

  const [name, setName] = useState('')
  const [ingredients, setIngredients] = useState('')
  const [instructions, setInstructions] = useState('')
  const [preparationTime, setpreparationTime] = useState('')
  const [difficultyLevel, setdifficultyLevel] = useState('')
  const [error, setError] = useState(null)
  const [emptyFields, setEmptyFields] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents page reload on form submission
  
    if (!user) {
      setError('You must be logged in');
      return;
    }
    console.log('User Token:', user?.token);

  
    // Ensure ingredients are sent as an array and preparationTime as a number
    const recipe = {
      name,
      ingredients: ingredients.split(',').map(item => item.trim()), // Convert string to array
      instructions,
      preparationTime: Number(preparationTime), // Convert string to number
      difficultyLevel
    };
  
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes`, {
      method: 'POST',
      body: JSON.stringify(recipe),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      }
    });
  
    const json = await response.json();
  
    if (!response.ok) {
      setError(json.error);
      setEmptyFields(json.emptyFields);
    }
    
    if (response.ok) {
      setEmptyFields([]);
      setError(null);
      setName('');
      setIngredients('');
      setInstructions('');
      setpreparationTime('');
      setdifficultyLevel('');
      dispatch({ type: 'CREATE_RECIPE', payload: json });
    }
  };
  

  return (
    <form className="create" onSubmit={handleSubmit}> 
      <h3>Add a New Recipe</h3>

      <label>Recipe Name:</label>
      <input 
        type="text" 
        onChange={(e) => setName(e.target.value)} 
        value={name}
        className={emptyFields.includes('name') ? 'error' : ''}
      />

      <label>Ingredients Required:</label>
      <input 
        type="text" 
        onChange={(e) => setIngredients(e.target.value)} 
        value={ingredients}
        className={emptyFields.includes('ingredients') ? 'error' : ''}
      />

      <label>Steps:</label>
      <input 
        type="text" 
        onChange={(e) => setInstructions(e.target.value)} 
        value={instructions}
        className={emptyFields.includes('instructions') ? 'error' : ''}
      />

      <label>Preparation Time:</label>
      <input 
        type="text" 
        onChange={(e) => setpreparationTime(e.target.value)} 
        value={preparationTime}
        className={emptyFields.includes('preparationTime') ? 'error' : ''}
      />

      <label>Difficulty Level:</label>
      <select 
        onChange={(e) => setdifficultyLevel(e.target.value)} 
        value={difficultyLevel} 
        className={emptyFields.includes('difficultyLevel') ? 'error' : ''}
      >
        <option value="" disabled>Select the difficulty level</option>
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>

      <button>Add Recipe</button>
      {error && <div className="error">{error}</div>}
    </form>
  )
}

export default RecipeForm