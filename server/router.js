const express = require('express')
const router = express.Router()


const config = require('../config')
const passport = require('passport')

const {ensureAuthenticated, forwardAuthenticated} = require('../server/auth')


router.get('/', (request, response) =>
	response.render('index', {
		name: 'Abdulaziz',
	})
)

router.get('/login', (request, response) =>
	response.render('login')
)

// Redirect all to instructor
router.get('*', (request, response) => response.redirect('/'))

module.exports = router
