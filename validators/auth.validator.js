const validators = {};

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$/;

validators.registerValidator = [
  {
    field: 'name',
    rules: [
      { validator: 'notEmpty', message: 'Name is required' },
      { validator: 'isType', options: 'string', message: 'Name must be a string' },
      { validator: 'isLength', message: 'Name must be between 12 and 50 characters', options: { min: 12, max: 50 } }
    ]
  },
  {
    field: 'lastname',
    rules: [
      { validator: 'notEmpty', message: 'Lastname is required' },
      { validator: 'isType', options: 'string', message: 'Lastname must be a string' },
      { validator: 'isLength', message: 'Lastname must be between 12 and 50 characters', options: { min: 12, max: 50 } }
    ]
  },
  {
    field: 'username',
    rules: [
      { validator: 'notEmpty', message: 'Username is required' },
      { validator: 'isType', options: 'string', message: 'Username must be a string' },
      { validator: 'isLength', message: 'Username must be between 5 and 15 characters', options: { min: 5, max: 15 } },
    ]
  },
  {
    field: 'email',
    rules: [
      { validator: 'notEmpty', message: 'Email is required' },
      { validator: 'isType', options: 'string', message: 'Email must be a string' },
      { validator: 'isEmail', message: 'Email must be a valid email' }
    ]
  },
  {
    field: 'password',
    rules: [
      { validator: 'notEmpty', message: 'Password is required' },
      { validator: 'isType', options: 'string', message: 'Password must be a string' },
      { validator: 'isLength', message: 'Password must be between 8 and 32 characters', options: { min: 8, max: 32 } },
      { validator: 'matches', options: passwordRegex, message: 'Password must contain at least one number, one uppercase letter, one lowercase letter and be between 8 and 32 characters' },
    ]
  }
];

export default validators;
