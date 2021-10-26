const doPasswordsMatch = (value, req) => {
  if (value !== req.body.rePassword) {
    throw new Error("Password confirmation does not match password");
  }

  return true;
};

// midleware to check for registered user in db

const isRegisteredUser = async (value, req) => {
  const normalizedUsername = value.toLocaleLowerCase();
  const user = await req.dbServices.user.getByUsername(normalizedUsername);
  if (!user) {
    throw new Error("User is not registered!");
  }

  return true;
};

const isUsernameTaken = async (value, req) => {
  const normalizedUsername = value.toLocaleLowerCase();
  const user = await req.dbServices.user.getByUsername(normalizedUsername);
  return user ? true : false;
};

// const isUsernameTaken = async (username, req) => {
// 	const existingUsername = await req.dbServices.user.getByUsername(username)

// 	return existingUsername
// 		? Promise.reject('Username already exists!')
// 		: Promise.resolve('Username does not exist!')
// }

const isEmailTaken = async (email, req) => {
  const existingEmail = await req.dbServices.user.getByEmail(email);

  return existingEmail
    ? Promise.reject("Email already exists!")
    : Promise.resolve("Email does not exist!");
};

// const isRegisteredUser = async (email, req) => {
// 	const user = await req.dbServices.user.getByEmail(email)

// 	return user
// 		? Promise.resolve('User is registered!')
// 		: Promise.resolve('User is not registered!')
// }

module.exports = (req, res, next) => {
  req.customValidators = {
    doPasswordsMatch,
    isUsernameTaken,
    isEmailTaken,
    isRegisteredUser,
  };

  next();
};
