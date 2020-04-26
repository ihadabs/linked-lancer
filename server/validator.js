const fs = require('fs')

// Check if the student registered in the course
function checkIfRegistered(sid) {
	// Check if sid is undefined
	if (!sid) return [false, 'Please provide a student id.']

	// Get students list
	const rawdata = fs.readFileSync('./data/students.json')
	const students = JSON.parse(rawdata)

	// Try to find the student with the sid
	const theStudent = students.find(
		student => student.id == sid || student.sn == sid
	)
	if (theStudent) return [true, undefined, theStudent]

	// Could not find the student with the sid
	const errorMessage =
		`"${sid}", ` + 'sorry you are not registered in this course :('

	return [false, errorMessage]
}

function validateCode(code) {
	const rawdata = fs.readFileSync('./data/valid-code.json')
	const { validcode, timestamp } = JSON.parse(rawdata)

	// console.log(timeDifference(timestamp))
	console.log(validcode, code)

	if (
		validcode.toUpperCase() != code.toUpperCase() ||
		timeDifference(timestamp) > 5
	) {
		return [false, 'Attendance code is no longer valid :(']
	}

	return [true]
}

function timeDifference(timestamp) {
	return (Date.now() - timestamp) / 60000.0
}

module.exports = { checkIfRegistered, validateCode }
