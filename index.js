const express = require('express'); // Importing express
const app = express(); // Creating an express app
const startpoint = require("./routes/login.js");
const cors = require("cors");
require("dotenv").config();


// app.use(cors("http://localhost:3000"));
app.use(cors());
app.use(express.json());
app.use("/api", startpoint);
console.log("passed index");

// app.use("/admin",  require("./routes/login.js"))

// Set up the server to listen on port 4000
const port = process.env.SERVER_PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);

});
