import fs from "fs/promises"; // Use fs.promises for working with Promises instead of fs.sync
import Jimp from "jimp";
import axios from "axios";

// filterImageFromURL
// This function downloads an image from a given URL, resizes it, adjusts quality,
// and converts it to grayscale. It returns the absolute path of the filtered image
// that is saved locally on disk.
// INPUT:
//    inputURL: string - A publicly accessible URL of the image to be processed.
// RETURNS:
//    A promise that resolves to the absolute path of the locally saved filtered image.
export async function filterImageFromURL(inputURL) {
  try {
    // Download image from the provided URL
    const { data: photoBuffer } = await axios.get(inputURL, { responseType: "arraybuffer" });

    // Read and process the image using Jimp
    const photo = await Jimp.read(Buffer.from(photoBuffer, "binary"));

    // Create a unique file path for the filtered image
    const outputFilePath = `/tmp/filtered-${Date.now()}.jpg`;

    // Apply image transformations (resize, quality adjustment, grayscale)
    await photo
      .resize(256, 256) // Resize the image to 256x256 pixels
      .quality(60) // Set JPEG quality to 60%
      .greyscale() // Convert the image to grayscale
      .writeAsync(outputFilePath); // Save the processed image to disk

    return outputFilePath; // Return the path to the filtered image
  } catch (error) {
    throw new Error(`Unable to filter the image from URL: ${error.message}`);
  }
}

// deleteLocalFiles
// This function deletes files from the local disk after processing is complete.
// INPUTS:
//    files: Array<string> - An array of absolute paths to the files to be deleted.
export async function deleteLocalFiles(files) {
  try {
    // Iterate through the files array and delete each file asynchronously
    for (const file of files) {
      await fs.unlink(file); // Delete the file asynchronously
    }
  } catch (error) {
    throw new Error(`Unable to delete the files: ${error.message}`);
  }
}
