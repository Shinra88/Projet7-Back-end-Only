const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

const validEmail = require('../middleware/valid-email');
const validPass = require('../middleware/valid-pass');

router.post('/signup', validEmail, validPass, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;