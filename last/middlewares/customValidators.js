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

  return user
    ? Promise.resolve('User is registered!')
    : Promise.reject('User is not registered!');
};

const isValidCategory = category => {
  CATEGORIES = [
    'advertising',
    'benefits',
    'car',
    'equipment',
    'fees',
    'home-office',
    'insurance',
    'interest',
    'Labor',
    'maintenance',
    'materials',
    'meals-and-entertainment',
    'office-supplies',
    'other',
    'professional-services',
    'rent',
    'taxes',
    'travel',
    'utilities',
  ];
  return CATEGORIES.includes(category);
};

module.exports = (req, res, next) => {
  req.customValidators = {
    doPasswordsMatch,
    isUsernameTaken,
    isEmailTaken,
    isRegisteredUser,
    isValidCategory,
  };

  next();
};
