const express = require('express')
const user = require('../controller/userController')
const router = express.Router()


router.post('/register', user.createUser)

module.exports = router