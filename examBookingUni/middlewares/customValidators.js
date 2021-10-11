const doPasswordsMatch = (value, req) => {
	if (value !== req.body.rePassword) {
		throw new Error('Password confirmation does not match password')
	}

	return true
}

const isRegisteredUser = async (value, req) => {

	const user = await req.dbServices.user.getByUsername(value)
	if (!user) {
		throw new Error('User is not registered!')
	}

	return true
}

const isUsernameTaken = async (username, req) => {
	const existingUsername = await req.dbServices.user.getByUsername(username)

	return existingUsername
		? Promise.reject('Username already exists!')
		: Promise.resolve('Username does not exist!')
}

const isEmailTaken = async (email, req) => {
	const existingEmail = await req.dbServices.user.getByEmail(email)

	return existingEmail
		? Promise.reject('Email already exists!')
		: Promise.resolve('Email does not exist!')
}

const isValidEmail = async (email, req) => {
	// const existingEmail = await req.dbServices.user.getByEmail(email)
	const pattern = /^[A-Za-z0-9.@]+$/
	const t = pattern.test(email)
  console.log("🚀 ~ file: customValidators.js ~ line 39 ~ isValidEmail ~ t", t)
	return pattern.test(email)
		? Promise.resolve('Email is ok!')
		: Promise.reject('Email is gaden!')
}

const isRegisteredUser_ = async (email, req) => {
	const user = await req.dbServices.user.getByEmail(email)

	return user
		? Promise.resolve('User is registered!')
		: Promise.resolve('User is not registered!')
}



module.exports = (req, res, next) => {
	req.customValidators = {
		doPasswordsMatch,
		isUsernameTaken,
		isEmailTaken,
		isRegisteredUser,
		isValidEmail,
	}

	next()
}