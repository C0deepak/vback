const express = require('express')
const { registerUser, loginUser, logoutUser, profile, detailUser, allUser } = require('../controllers/userController')
const { isAuthenticatedUser, isAdmin } = require('../middleware')
const router = express.Router()

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').get(logoutUser)
router.route('/profile').post(profile)
router.route('/scanQr').post(isAuthenticatedUser, isAdmin, detailUser)
router.route('/user').get(isAuthenticatedUser, isAdmin, allUser)

module.exports = router