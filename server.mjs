import express from "express";
import cors from "cors"; // Import the CORS middleware
import fs from "fs/promises";

const app = express();

// Enable CORS for all routes
app.use(cors());

app.get("/quote", async (req, res) => {
  try {
    // Read the quotes.json file
    const data = await fs.readFile("quotes.json", "utf-8");

    // Parse the JSON data into an array of quotes
    const quotes = JSON.parse(data);

    // Pick a random quote from the array
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

    // Return the random quote as a JSON response
    res.json({ content: randomQuote });
  } catch (error) {
    // Handle any errors that occur during file reading or JSON parsing
    console.error("Error reading or parsing quotes:", error);
    res.status(500).send("Failed to load quote");
  }
});

// Start the server on port 3000
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
