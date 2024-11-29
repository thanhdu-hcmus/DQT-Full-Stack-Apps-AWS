import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util.js';

// Initialize the Express application
const app = express();

// Set the network port
const port = process.env.PORT || 8082;

// Use the body parser middleware to parse JSON data in POST requests
app.use(bodyParser.json());

// @TODO1 IMPLEMENT A RESTFUL ENDPOINT
// GET /filteredimage?image_url={{URL}}
// This endpoint accepts a public URL of an image, filters the image, and returns the filtered image.
// The steps to be performed are:
//    1. Validate the 'image_url' query parameter.
//    2. Call 'filterImageFromURL' to process and filter the image from the provided URL.
//    3. Send the resulting filtered image back in the response.
//    4. Clean up and delete the processed image file from the server after the response is sent.
// QUERY PARAMETERS:
//    image_url: A publicly accessible URL to the image that needs to be filtered.
// RETURNS:
//    The filtered image file (likely using res.sendFile(filteredpath) to send the file back).
/**************************************************************************** */

// Endpoint to handle the image filtering request
app.get("/filteredimage", async (req, res) => {

  const { image_url } = req.query; // Extract image_url from query parameters

  // Validate the image_url query parameter
  if (!image_url) {
    return res.status(400).send('Please provide a valid image URL');
  }

  try {
    // Call the helper function to filter the image
    const filteredImage = await filterImageFromURL(image_url);

    // Send the filtered image in the response
    res.sendFile(filteredImage, {}, async (err) => {
      if (err) {
        // If an error occurs while sending the file, log the error
        console.error(err);
      } else {
        // After the response is sent, delete the temporary filtered image file from the server
        await deleteLocalFiles([filteredImage]);
      }
    });

  } catch (error) {
    // If there's an error filtering the image, log it and send a 500 response
    console.error(error);
    return res.status(500).send("Could not filter the image");
  }
});

// Root endpoint
// Displays a simple message to guide the user on how to use the service
app.get("/", async (req, res) => {
  res.send("Try GET /filteredimage?image_url={{URL}} to filter an image.");
});

// Start the Express server
// The server will listen on the specified port and log a message indicating the server is running
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log('Press CTRL+C to stop the server');
});
