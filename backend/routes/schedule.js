const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const auth = require('../middleware/auth');

router.get('/', auth, scheduleController.getSchedule);
router.post('/auto', auth, scheduleController.autoSchedule);

module.exports = router;
