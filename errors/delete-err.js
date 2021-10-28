class DeleteError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
    this.name = 'DeleteError';
  }
}

module.exports = DeleteError;
