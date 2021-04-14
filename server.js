const express = require('express')
const cors = require('cors')
const path = require('path')

const { sequelize, Sequelize } = require('./db/models')
require('./cron-job')

const tagRoute = require('./api/tags')
const resizeRoute = require('./api/resizes')
const mediaRoute = require('./api/medias')

const app = express()
app.use(cors())
app.use(express.json())

if(process.env.NODE_ENV !== 'production') {
  	require('dotenv').config()
}

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api/tags', tagRoute)
app.use('/api/resizes', resizeRoute)
app.use('/api/medias', mediaRoute)

// serve the static build files, when run in production
if(process.env.NODE_ENV === 'production') {
	app.use(express.static(path.resolve(__dirname, 'client', 'dist')))
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'))
	})
}

// global error handler
app.use((err, req, res, next) => {
	console.log(err)
	if(err instanceof Sequelize.ConnectionError) {
		return res.status(503).json({ message: 'Database connection error.' })
	}
	res.status(500).json({ message: 'Something went wrong.' })
})

app.listen(process.env.PORT, async err => {
	if(!err) console.log(`Server started on port ${process.env.PORT}`)

	try {
	  await sequelize.authenticate();
	  console.log('Connection has been established successfully.');
	} catch (error) {
	  console.error('Unable to connect to the database:', error);
	}
})
