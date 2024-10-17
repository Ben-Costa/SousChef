import express from 'express'
import User from '../../../server/dataObjects/user.js';
import { dbConnector } from '../../../server/server.js';
const router = express.Router();

// TODO Get all users using pagination
router.get('/api/v1/users/list', async (req, res) => {
  console.log('Get all users using pagination');
  try {
    const { page = 1, limit = 10} = req.query;
    const dbResponse = await dbConnector.searchUsers("", parseInt(limit), parseInt(page));
    const JSONResponse = [];
    console.log(dbResponse.data.data)
    for(let i = 0; i < dbResponse.data.data.length; i++){
      JSONResponse.push(dbResponse.data.data[i].toJSON());
    }
    //send page number and total number of pages
    const pagination = dbResponse.data.pagination;
    res.setHeader('pagination', JSON.stringify({currentPage: pagination.currentPage, hasMore: pagination.hasMore, pageSize: pagination.pageSize}));
    res.status(200).send(JSONResponse);
  }
  catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
  });

// Get user by id
router.get('/api/v1/users/:userName', async (req, res) => {
  try {
    const dbResponse = await dbConnector.readUser(req.params.userName);
    if (dbResponse.statusCode === 404) {
      return res.status(404).send();
    }
    
    let userJson = dbResponse.data.toJSON();
    console.log(`return json: ${userJson}`);
    res.status(200).send(userJson);
  }
  catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
  });

// Create a new user
// test curl -X POST http://localhost:3000/user/api/v1/users \-H "Content-Type: application/json" \-d 
//'{  "userName": "testUser",  "password": "testPassword123",  "email": "testuser@example.com",  "bDay": "1990-01-01",  "firstName": "Test",  "lastName": "User",  "profilePic": "https://example.com/profilepic.jpg"}'
router.post('/api/v1/users', async (req, res) => {
    try {
      console.log(req.body);
      const newUser = User.fromJSON(req.body);
      const dbResponse = await dbConnector.createUser(newUser);
      console.log(dbResponse);
      if (dbResponse.statusCode === 500) {
        return res.status(500).send(['User already exists']);
      }
      res.status(201).send(['New User Successfully Created: ' + newUser.toJSON()]);
      console.log(req.body);
    }
    catch (error) {
      res.status(500).send(error)
      console.error(error);
    }
  });

// Update user by id
router.put('/api/v1/users/:id', (req, res) => {
    try {
      console.log(req.body);
      const newUser = User.fromJSON(req.body);
      const dbResponse = dbConnector.updateUser(newUser);
      console.log(dbResponse);
      res.status(201).send(['User Updated: ' + newUser.getUserName()]);
    } catch (error) {
      res.status(500).send(error)
    }
});

// Delete user by id
router.delete('/api/v1/users/:id', (req, res) => {
    res.send('Delete user by id')
});

export default router;