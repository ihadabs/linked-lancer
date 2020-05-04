const pg = require('pg')

const pool = new pg.Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    database: 'linkedlancer'
})

const queries = {
    getAccounts: 'SELECT * FROM "AccountView";',
    getProjects: 'SELECT * FROM "ProjectView";',
    createProject: `INSERT INTO "Project" ("ProjectName", "ProjectBudget", "ProjectRequirements", "AccountID") VALUES ($1::text, $2::int, $3::text, $4::int);`,
    assignProject: 'UPDATE "Project" SET "FreelancerID"=$2::int, "ProjectStatus"=0 WHERE "ProjectID"=$1::int;',
    createAccount: `INSERT INTO "Account" ("AccountName", "AccountEmail", "Password", "TypeID", "AccountID") VALUES ($1::text, $2::text, $3::text, $4::int, $5::int);`
}

const getAccounts = (callback) => {
    pool.query(queries.getAccounts, (error, results) => {
        if (error) {
            console.log(error)
        }
        callback(results.rows)
    })
}

const getProjects = (callback) => {
    pool.query(queries.getProjects, (error, results) => {
        if (error) {
            console.log(error)
        }
        callback(results.rows)
    })
}

const createProject = (request, response) => {
    const {name, budget, requirements} = request.body
    const accountID = request.user["AccountID"]
    pool.query(queries.createProject, [name, budget, requirements, accountID], (error) => {
        console.log(error)
        response.redirect('/user')
    })
}

const assignProject = (projectId, freelancerId, callback) => {
    console.log(projectId, freelancerId)
    pool.query(queries.assignProject, [+projectId, +freelancerId], (error, results) => {
        if (error) {
            console.log(error)
        }
        callback()
    })
}

const createFreelancer = (request, response) => {
    const {name, email, password} = request.body
    getAccounts((users) => {
        if (users.find(u => u["AccountEmail"] === email)) response.redirect('/alert-email-used')
        else pool.query(queries.createAccount, [name, email.toLowerCase(), password, 2, users.length], (error) => {
            if (error) console.log(error)
            response.redirect('/login')
        })
    })
}

const createEmployer = (request, response) => {
    const {name, email, password} = request.body
    getAccounts((users) => {
        if (users.find(u => u["AccountEmail"] === email)) response.redirect('/alert-email-used')
        else pool.query(queries.createAccount, [name, email.toLowerCase(), password, 3, users.length], (error) => {
            if (error) console.log(error)
            response.redirect('/login')
        })
    })
}


module.exports = {
    getAccounts, getProjects, createProject, assignProject, createEmployer, createFreelancer
}

