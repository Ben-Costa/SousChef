const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


// Import the DbConnector class
const DbConnector = require("./dbConnector.js");

// Create a new DbConnector instance with your URI and database name
const dbConnector = new DbConnector(
  "mongodb://localhost:27017",
  "sample_mflix"
);

// Define an async function to run the server logic
async function run() {
  try {
    // Connect to the database
    await dbConnector.connect();

    // Perform some CRUD operations on various collections
    // For example, insert a document into the movies collection
    await dbConnector.insertOne("movies", {
      title: "The Matrix",
      year: 1999,
      genres: ["Action", "Sci-Fi"],
    });

    // For example, find one document from the users collection
    const user = await dbConnector.findOne("users", {
      email: "alice@example.com",
    });
    console.log(user);

    // For example, update one document in the comments collection
    await dbConnector.updateOne(
      "comments",
      { _id: "5a9427648b0beebeb69579cc" },
      { $set: { text: "This is an updated comment" } }
    );

    // For example, delete one document from the sessions collection
    await dbConnector.deleteOne("sessions", {
      user_id: "5a989e4a1d967e001a7889d4",
    });
  } catch (err) {
    // Log an error message
    console.error(err);
  } finally {
    // Disconnect from the database
    await dbConnector.disconnect();
  }
}

// Run the server logic
run().catch(console.error);
