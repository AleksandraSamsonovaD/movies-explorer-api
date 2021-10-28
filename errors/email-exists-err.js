class EmailExistsError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
    this.name = 'EmailExistsError';
  }
}

module.exports = EmailExistsError;
