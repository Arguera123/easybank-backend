import httpErrors from 'http-errors';

const validationFunctions = {
  notEmpty: (value) => value !== undefined && value !== null && value !== '',
  isType: (value, expectedType) => typeof value === expectedType,
  isLength: (value, { min, max }) => value.length >= min && value.length <= max,
  isEmail: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  isMongoId: (value) => /^[0-9a-fA-F]{24}$/.test(value),
  matches: (value, regex) => regex.test(value),
};

function sanitizeInput(data) {
  if (typeof data !== 'object' || data === null) return data;

  const sanitizedData = {};
  for (const key in data) {
    if (!key.startsWith('$')) { 
      sanitizedData[key] = typeof data[key] === 'object' 
        ? sanitizeInput(data[key])
        : data[key];
    }
  }
  return sanitizedData;
}

export const validathor = (rules) => {
  return (req, res, next) => {
    req.body = sanitizeInput(req.body);

    const errors = [];

    rules.forEach(({ field, rules }) => {
      const value = req.body[field];

      rules.forEach(({ validator, options, message }) => {
        if (validator === 'isType' && !validationFunctions[validator](value, options)) {
          errors.push({ field, message });
        } else if (validator !== 'isType' && !validationFunctions[validator](value, options)) {
          errors.push({ field, message });
        }
      });
    });
    console.error(errors);
    if (errors.length > 0) throw httpErrors(400, errors);

    next();
  }  
}
