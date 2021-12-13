const express = require('express');
const router = express.Router();
const controller = require('../controllers/musicControllers')

router.get('/', (req, res) => {
    res.json({ message: "Welcome to RayRay Music Router" });
});

router.get('/getAllMusics', controller.getAllMusicsData)
router.get('/getMusicData/:objectID', controller.getMusicData)
router.get('/getMusicImage/:imageName', controller.getMusicImage)
router.get('/getMusicAudio/:audioName', controller.getMusicAudio)

module.exports = router;