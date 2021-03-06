const mongoose = require('mongoose')

// change the connect string ->
module.exports = (app) => new Promise((resolve, reject) => {
	mongoose.connect('mongodb+srv://admin:091276@freecluster.o4maq.mongodb.net/bookingUni', {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		autoIndex: true,
		useCreateIndex: true,
		useFindAndModify: false,	
	})

	const db = mongoose.connection

	db.on('error', err => {
		console.log(`Database error: ${err.message}`)
		reject(err.message)
	})
	db.on('open', () => {
		console.log(`Database connected`)
		resolve()
	})
})