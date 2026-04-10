require('dotenv').config();

const getRequiredEnv = (name) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is required to run login tests.`);
  }
  return value;
};

const VALID_USERNAME = getRequiredEnv('VALID_USERNAME');
const VALID_PASSWORD = getRequiredEnv('VALID_PASSWORD');
const OLD_PASSWORD = getRequiredEnv('OLD_PASSWORD');
const INVALID_USERNAME = process.env.INVALID_USERNAME || 'baduser';
const INVALID_PASSWORD = process.env.INVALID_PASSWORD || 'badpass';

const DEFAULT_LOGIN_DATA = {
  username: VALID_USERNAME,
  password: VALID_PASSWORD,
  role: 'admin',
  acceptTerms: true,
};

module.exports = {
  VALID_USERNAME,
  VALID_PASSWORD,
  OLD_PASSWORD,
  INVALID_USERNAME,
  INVALID_PASSWORD,
  DEFAULT_LOGIN_DATA,
};
