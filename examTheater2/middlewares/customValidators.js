const doPasswordsMatch = (value, req) => {
  if (value !== req.body.rePassword) {
    throw new Error('Password confirmation does not match password');
  }

  return true;
};

const isUsernameTaken = async (username, req) => {
  const existingUsername = await req.dbServices.user.getByUsername(username);

  return existingUsername
    ? Promise.reject('Username already exists!')
    : Promise.resolve('Username does not exist!');
};

const isEmailTaken = async (email, req) => {
  const existingEmail = await req.dbServices.user.getByEmail(email);

  return existingEmail
    ? Promise.reject('Email already exists!')
    : Promise.resolve('Email does not exist!');
};

const isRegisteredUser = async (username, req) => {
  const user = await req.dbServices.user.getByUsername(username);
  console.log(
    '🚀 ~ file: customValidators.js ~ line 27 ~ isRegisteredUser ~ user',
    user
  );

  return user
    ? Promise.resolve('User is registered!')
    : Promise.reject('User is not registered!');
};

const isTitleUnique = async (title, req) => {
  const play = await req.dbServices.custom.getByTitle(title);

  return play
    ? Promise.reject('Play exist!')
    : Promise.resolve('Title is free!');
};

module.exports = (req, res, next) => {
  req.customValidators = {
    doPasswordsMatch,
    isUsernameTaken,
    isEmailTaken,
    isRegisteredUser,
    isTitleUnique,
  };

  next();
};
