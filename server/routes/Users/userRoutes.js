import express from 'express'
const router = express.Router();

router.get('/helloworld', (req, res) => {
    res.send('User helloworld');
  });
    
export default router;