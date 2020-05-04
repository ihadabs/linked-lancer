const LocalStrategy = require('passport-local').Strategy
const db = require('./db')

module.exports = function(passport) {
	passport.use(
		new LocalStrategy((email, password, done) => {
			return db.getAccounts((users) => {

				// Check if there is a user with this email
				const user = {
					...users.find(user =>
						user["AccountEmail"].toLowerCase() === email.toLowerCase()
					)
				}

				// Check if user with such username exsits
				if (!user)
					return done(null, false, {
						message: 'Email was not found!'
					})

				// Check if passwords match
				if (user["Password"] !== password)
					return done(null, false, {
						message: 'Password is incorrect!'
					})

				// Delete user field before returning the user
				delete user["Password"]

				return done(null, user)
			})
		})
	)

	passport.serializeUser((user, done) => {
		// console.log('serializeUser: ', user)
		return done(null, user["AccountID"])
	})

	passport.deserializeUser((AccountID, done) =>
		db.getAccounts((users) => {
			const user = users.find(user => user["AccountID"] === AccountID)
			if (!user) return done(Error('User was not found.'), undefined)
			else return done(null, user)
		})
	)
}
