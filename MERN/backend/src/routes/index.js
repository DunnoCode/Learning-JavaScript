const express = require('express');
const router = express.Router();
const authRouter = require('./auth');
const userRouter = require('./user');
const musicRouter = require('./music')



router.get('/', (req, res) => {
    res.json({message: "/api pathing"})
})

router.use('/auth', authRouter);
router.use('/music', musicRouter);
router.use('/user', userRouter);

module.exports = router