import express from 'express'
const router = express.Router();

router.get('/helloworld', (req, res) => {
    // Handle user profile route
    res.send('Users helloworld');
  });
  
export default router