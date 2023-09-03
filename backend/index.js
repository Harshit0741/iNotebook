const express = require('express');
const mongoose = require('mongoose');
var cors = require('cors')

const mongoURI = "mongodb://127.0.0.1:27017/inotebook?directConnection=true";

const connectToMongo = () => {
  mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log("Connected to Mongo Successfully");
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB:", err);
    });
};

connectToMongo(); // Connect to MongoDB

const app = express(); // Initialize Express
const port = 5000;
app.use(cors());

app.use(express.json())

// Available Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => {
  console.log(`iNotebook backend listening on port http://localhost:${port}`);
});

