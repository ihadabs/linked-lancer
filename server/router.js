const express = require('express')
const router = express.Router()

const passport = require('passport')
const {ensureAuthenticated, forwardAuthenticated} = require('../server/auth')

const db = require('./db')

// Helper
const getUserDestinationPage = (user) => {
	let destination = '/'
	if (user) {
		const typeId = user["TypeID"]
		destination = typeId === 1 ? 'admin' : (typeId === 2 ? "freelancer" : "employer")
	}
	return destination
}

// Alert
router.get('/alert', forwardAuthenticated, (request, response) =>
	response.render('alert')
)

// Alert
router.get('/alert-email-used', forwardAuthenticated, (request, response) =>
	response.render('alert-email-used')
)

// Login
router.post('/login', (request, response, next) => {
		// console.log("here we go login post!")
	 return passport.authenticate('local', {
			successRedirect: '/user',
			failureRedirect: '/alert'
		})(request, response, next)
	}
)

router.get('/login', forwardAuthenticated, (request, response) =>
	response.render('login')
)


router.post('/assign', ensureAuthenticated, (request, response) => {
	const projectId = request.body.projectId
	const freelancerId = request.body.freelancerId
	db.assignProject(projectId, freelancerId, () => {
		response.redirect('/user')
	})
})

router.post('/new-employer', forwardAuthenticated, db.createEmployer)
router.post('/new-freelancer', forwardAuthenticated, db.createFreelancer)

// Logout
router.get('/logout', ensureAuthenticated, (request, response) => {
	request.logout()
	response.redirect('/login')
})

// User: admin, freelancer, or employer
router.get('/user', ensureAuthenticated, (request, response) => {
	const user = request.user
	db.getProjects(projects => {
		db.getAccounts(accounts => {
			return response.render(getUserDestinationPage(user), {
				user: user,
				projects: projects
					.filter(project =>
						project["AccountID"] === user["AccountID"] ||
						project["FreelancerID"] === user["AccountID"]
					),
				accounts: accounts,
				allprojects: projects,
				freelansersIds: accounts.filter(a => a["TypeID"] === 2).map(a => a["AccountID"])
			})
		})
	})
})

// Employer
router.post('/project', ensureAuthenticated, db.createProject)


router.get('/create-profile', (request, response) =>
	response.render('create-profile')
)

router.get('/edit-profile', (request, response) =>
	response.render('edit-profile')
)

router.get('/messaging', (request, response) =>
	response.render('messaging')
)

router.get('/profile', (request, response) =>
	response.render('profile')
)

router.get('/project', (request, response) =>
	response.render('project')
)

router.get('/proposal-form', (request, response) =>
	response.render('proposal-form')
)

router.get('/search', ensureAuthenticated, (request, response) => {
	const user = request.user
	const query = request.query.query
	db.getProjects(projects => {
		db.getAccounts(accounts => {
			let as = accounts, ps = projects;
			as = as.filter(account => account["AccountID"] !== user["AccountID"]);
			if (user["TypeID"] === 2 || user["TypeID"] === 3) {
				as = as.filter(account => account["TypeID"] !== 1);
			}
			if (query) {
				ps = ps.filter(p => p["ProjectName"].includes(query));
				as = as.filter(a => a["AccountName"].includes(query) || a["AccountEmail"].includes(query));
			}
			return response.render('search-results', {
				user: user,
				projects: ps,
				accounts: as,
			})
		})
	})
})

// Index
router.get('/', (request, response) =>
	response.render('index')
)

router.get('/index', (request, response) => response.redirect('/'))

router.get('*', (request, response) => response.redirect('/'))

module.exports = router
