const express = require('express');
const router = express.Router();
const auth = require('./auth')
const controller = require('../controllers/authControllers')


// app.post("/api/auth/login", controller.login)
router.post('/login', controller.login)
router.post('/register', controller.register)

module.exports = router;


