class DefaultError extends Error {
  constructor() {
    super('На сервере произошла ошибка');
    this.statusCode = 500;
    this.name = 'DefaultError';
  }
}

module.exports = DefaultError;
