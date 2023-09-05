const express = require('express')
const bodyParser = require('body-parser')
const sequelize = require('./database/sequelize')
require('./models/associations')

const contractsRouter = require('./routes/contracts')
const jobsRouter = require('./routes/jobs')
const balanceRouter = require('./routes/balance')

const app = express()

app.use(bodyParser.json())
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

app.use('/contracts', contractsRouter)
app.use('/jobs', jobsRouter)
app.use('/balances', balanceRouter)

module.exports = app