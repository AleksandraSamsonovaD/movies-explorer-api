class IncorrectAuthError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
    this.name = 'IncorrectAuthError';
  }
}

module.exports = IncorrectAuthError;
