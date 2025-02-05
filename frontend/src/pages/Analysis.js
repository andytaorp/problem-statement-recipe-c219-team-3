// const Analysis = () => {
//   const handleSubmit = (e) => {
//     e.preventDefault();
//   }

//   return (
//     <div>
//       <h2>Nutrition Analysis</h2>

//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>Upload Image:</label>
//           <input type="file" id="foodImg"/>
//         </div>

//         <button type="submit">Submit</button>
//       </form>
//     </div>
//   )
// }

// export default Analysis

import React, { useState } from "react";

const Analysis = () => {
  const [nutritionInfo, setNutritionInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const apiUserToken = "f23b0313ee7985b17c477258d8ef0983b5c3035c";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fileInput = e.target.foodImg.files[0];

    if (!fileInput) {
      alert("Please upload an image");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("image", fileInput);

    try {
      const segmentationResponse = await fetch(
        "https://api.logmeal.com/v2/image/segmentation/complete",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiUserToken}`,
          },
          body: formData,
        }
      );

      if (!segmentationResponse.ok) throw new Error("Image segmentation failed");

      const segmentationData = await segmentationResponse.json();
      const imageId = segmentationData.imageId;

      const nutritionResponse = await fetch(
        "https://api.logmeal.com/v2/recipe/nutritionalInfo",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiUserToken}`,
          },
          body: JSON.stringify({ imageId }),
        }
      );

      if (!nutritionResponse.ok) throw new Error("Nutrition analysis failed");

      const nutritionData = await nutritionResponse.json();
      setNutritionInfo(nutritionData);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to analyze the image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Nutrition Analysis</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Upload Image:</label>
          <input type="file" name="foodImg" accept="image/*" />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Analyzing..." : "Submit"}
        </button>
      </form>

      {nutritionInfo && (
        <div>
          <h3>Nutritional Details:</h3>
          <p>Calories: {nutritionInfo.calories} kcal</p>
          <p>Protein: {nutritionInfo.protein} g</p>
          <p>Carbohydrates: {nutritionInfo.carbohydrates} g</p>
          <p>Fats: {nutritionInfo.fats} g</p>
        </div>
      )}
    </div>
  );
};

export default Analysis;