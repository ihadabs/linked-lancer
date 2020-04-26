module.exports = {
	ensureAuthenticated: function(request, response, next) {
		if (request.isAuthenticated()) return next()
		else response.redirect('/instructor/login')
	},
	forwardAuthenticated: (request, response, next) => {
		if (!request.isAuthenticated()) return next()
		else response.redirect('/instructor/generate')
	}
}
