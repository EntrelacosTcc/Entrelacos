// routes/profile.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const ProfileController = require('../controllers/perfilusuarioController');

router.use(auth);

router.get('/', ProfileController.getProfile);
router.put('/', ProfileController.updateProfile);
router.put('/update-photo', ProfileController.updatePhoto);

module.exports = router;
