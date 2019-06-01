'use strict';

// Require all dependencies
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

// Initialize Express app
const app = express();
// Set a port number
const port = process.env.PORT || 4600;

// Load environment variables in development
if (app.get('env') === 'development') {
  require('dotenv').config();
}

/**
 * Database related config
 */
// Connect to MongoDB database
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });

// Check MongoDb connection status
const db = mongoose.connection;
db.on('error', error => console.log('Error connecting to db:', error));
db.on('open', () => console.log('Connected to db'));

// Define food schema
const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String },
  description: { type: String },
  rating: { type: Number, min: 0, max: 5, default: 0 }
});

// Define food model from schema
const Food = mongoose.model('Food', foodSchema);

/**
 * Middleware for all routes
 */
// Setup basic security for all routes
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

/**
 * Routes
 */
// Root route.
app.get('/', (req, res) => {
  res.send('African Food server!');
});

/**
 * Food routes. CRUD - Create Read Update Delete
 */
// Create a new food entry (C)
app.post('/food', (req, res) => {
  const food = new Food(req.body);
  food.save()
    .then(food => res.status(201).json({
      msg: 'Successfully created new food record',
      food: food
    }))
    .catch(error => {
      console.log('Error creating new food record:', error.name, error.message);
      res.status(500).json({
        msg: 'Error creating new food record',
        // error: error
      });
    })
});

// Get all food entries (R)
app.get('/food', (req, res) => {
  Food.find()
    .then(food => res.status(200).json({
      msg: 'Successfully obtained all food records',
      food: food
    }))
    .catch(error => {
      console.log('Error obtaining all food records', error.name, error.message);
      res.status(500).json({
        msg: 'Error obtaining all food records'
      });
    })
});

// Get a particular food record (R)
app.get('/food/:id', (req, res) => {
  Food.findById(req.params.id)
    .then(food => {
      if (food === null) {
        return res.status(404).json({
          msg: 'Food record not found'
        });
      }
      res.status(200).json({
        msg: 'Successfully obtained food record',
        food: food
      })
    })
    .catch(error => {
      console.log('Error obtaining food record', error.name, error.message);
      res.status(500).json({
        msg: 'Error obtaining food record'
      });
    })
});

// Update food record (U)
app.put('/food/:id', (req, res) => {
  Food.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(food => {
      if (food === null) {
        return res.status(404).json({
          msg: 'Food record not found'
        });
      }
      res.status(200).json({
        msg: 'Successfully updated food record',
        food: food
      })
    })
    .catch(error => {
      console.log('Error updating food record', error.name, error.message);
      res.status(500).json({
        msg: 'Error updating food record'
      });
    })
});

// Delete food rcord (D)
app.delete('/food/:id', (req, res) => {
  Food.findByIdAndDelete(req.params.id)
    .then(resp => {
      if (food === null) {
        return res.status(404).json({
          msg: 'Food record not found'
        });
      }
      res.status(200).json({
        msg: 'Successfully deleted food record'
      })
    })
    .catch(error => {
      console.log('Error deleting food record', error.name, error.message);
      res.status(500).json({
        msg: 'Error deleting food record'
      });
    })
})

/**
 * Start app server by listening on port
 */
app.listen(port, () => {
  console.log('Server is listening on port', port);
});