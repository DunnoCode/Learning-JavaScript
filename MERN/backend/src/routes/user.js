const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const controller = require('../controllers/userControllers')

router.get('/', (req, res) => {
    res.json({ message: "Welcome to RayRay User router" });
})

router.get('/checkInvoice/:objectID', auth.verifyToken, controller.checkInvoice)
router.post('/checkoutWithLogin', auth.verifyToken, controller.checkoutWithLogin)
router.post('/checkoutWithoutLogin', controller.checkoutWithoutLogin)

module.exports = router;


