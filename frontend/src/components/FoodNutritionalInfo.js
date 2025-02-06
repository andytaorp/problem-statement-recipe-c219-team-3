import React, { useState } from 'react';
import axios from 'axios';

const FoodNutritionalInfo = () => {
  const [image, setImage] = useState(null);
  const [nutritionData, setNutritionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', image);

    try {
      // Send image to backend
      const response = await axios.post('http://localhost:5000/api/user/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setNutritionData(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching data. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Upload Image for Nutritional Info</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Get Nutritional Info'}
        </button>
      </form>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      {nutritionData && (
        <div>
          <h3>Nutritional Information</h3>
          <p><strong>Calories:</strong> {nutritionData.calories} kcal</p>
          <p><strong>Serving Size:</strong> {nutritionData.serving_size} grams</p>
          <p><strong>Carbs:</strong> {nutritionData.carbs} g</p>
          <p><strong>Protein:</strong> {nutritionData.protein} g</p>
          <p><strong>Fat:</strong> {nutritionData.fat} g</p>
          <p><strong>Sugar:</strong> {nutritionData.sugar} g</p>
          <p><strong>Sodium:</strong> {nutritionData.sodium} mg</p>
        </div>
      )}
    </div>
  );
};

export default FoodNutritionalInfo;
