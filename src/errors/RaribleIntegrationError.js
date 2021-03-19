class RaribleIntegrationError extends Error {
  /**
   * RaribleIntegrationError
   * @param {string} message
   */
  constructor (message) {
    super(message);
    this.name = 'RaribleIntegrationError';
  }
}

export default RaribleIntegrationError;
