import express from 'express'
const User = require('../../models/user');
import { dbConnector } from '../../server';
const router = express.Router();

// Get user by id
router.get('/api/v1/users/:userName', async (req, res) => {
  try {
    const user = await dbConnector.getUserByUserName(req.params.userName);
    if (!user) {
      return res.status(404).send();
    }
    res.status(200).send(user);
  }
  catch (error) {
    res.status(500).send(error);
  }
  });

// TODO Get all users
  
// Create a new user
router.post('/api/v1/users', (req, res) => {
    try {
      const user = new User(req.body);
      await dbConnector.createUser();
    }
});

// Update user by id
router.put('/api/v1/users/:id', (req, res) => {
    res.send('Update user by id')
});

// Delete user by id
router.delete('/api/v1/users/:id', (req, res) => {
    res.send('Delete user by id')
});

// Search for user by name or username
router.get('/api/v1/users/search', (req, res) => {
    res.send('Search for user by name or username')
});




  
export default router