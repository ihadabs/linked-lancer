const LocalStrategy = require('passport-local').Strategy

const users = [
	{
		id: 1,
		username: 'mohammed',
		password: 'mohmoh',
		firstname: 'Mohammad',
		lastname: 'Alshayeb'
	},
	{
		id: 2,
		username: 'abdoabdo',
		password: 'abdoabdo',
		firstname: 'Mohammad',
		lastname: 'Alshayeb'
	}
]

module.exports = function(passport) {
	passport.use(
		new LocalStrategy((username, password, done) => {
			const user = { ...users.find(user => user.username == username) }

			// Check if user with such username exsits
			if (!user)
				return done(null, false, {
					message: 'Username was not found!'
				})

			// Check if passwords match
			if (user.password != password)
				return done(null, false, {
					message: 'Password is incorrect!'
				})

			delete user.password
			return done(null, user)
		})
	)

	passport.serializeUser((user, done) => done(null, user.id))

	passport.deserializeUser((id, done) => {
		const user = users.find(user => user.id == id)
		if (!user) done(Error('User was not found.'), undefined)
		else done(null, user)
	})
}
