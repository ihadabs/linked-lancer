const config = require('./config')
const path = require('path')
const session = require('express-session')
const passport = require('passport')
const router = require('./server/router')

const cors = require('cors')
const expressLayouts = require('express-ejs-layouts')
const express = require('express')
const app = express()

const port = 3000

// Passport Config
require('./server/passport')(passport)

// Cors
app.use(cors())

// EJS
app.use(expressLayouts)
app.set('view engine', 'ejs')
app.set('views', path.join(config.__project_dirname, '/client/html'));
app.use(express.static(config.__project_dirname + '/client'));


// Express body parser
app.use(express.urlencoded({ extended: true }))


// Express session
app.use(
	session({
		secret: 'secret',
		resave: true,
		saveUninitialized: true
	})
)

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())


// Routes
app.use(router)


app.listen(
	port,
	console.log('\x1B[0;36m' + `[url] http://localhost:${port}` + '\x1B[0m')
)

