class IncorrectDataError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
    this.name = 'IncorrectDataError';
  }
}

module.exports = IncorrectDataError;
