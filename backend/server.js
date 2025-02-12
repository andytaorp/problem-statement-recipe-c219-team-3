// server.js - Main Backend Entry
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const recipeRoutes = require("./routes/recipeRoutes");

// // // ai thingy tryout
// const multer = require('multer');
// const axios = require('axios');
// const fs = require('fs');
// const path = require('path');

// // // Set up multer for file uploads
// const upload = multer({ dest: 'uploads/' });
// // // ai thingy tryout
// app.post('/api/user/upload', upload.single('image'), async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: 'No image uploaded' });
//   }

//   const imgPath = path.join(__dirname, req.file.path);
//   const apiUserToken = 'f23b0313ee7985b17c477258d8ef0983b5c3035c';
//   const headers = { 'Authorization': `Bearer ${apiUserToken}` };

//   try {
//     // Upload the image for food segmentation
//     const foodDetectionResponse = await axios.post(
//       'https://api.logmeal.com/v2/image/segmentation/complete',
//       { headers, files: { image: fs.createReadStream(imgPath) } }
//     );

//     // Retrieve the imageId from the response
//     const imageId = foodDetectionResponse.data.imageId;

//     // Retrieve nutritional information based on the imageId
//     const nutritionResponse = await axios.post(
//       'https://api.logmeal.com/v2/recipe/nutritionalInfo',
//       { imageId },
//       { headers }
//     );

//     // Delete the uploaded image after processing
//     fs.unlinkSync(imgPath);

//     // Return the nutritional information to the frontend
//     res.json(nutritionResponse.data);
//   } catch (error) {
//     console.error('Error processing image:', error);
//     res.status(500).json({ error: 'Failed to fetch nutritional information' });
//   }
// });
// // ai thingy tryout

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/user", authRoutes);

app.use("/api/recipes", recipeRoutes);

const PORT = process.env.PORT || 4000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // Listen for requests
    app.listen(PORT, () => {
      console.log("Connected to DB & listening on port", PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });
