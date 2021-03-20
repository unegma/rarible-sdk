class IPFSUploadError extends Error {
  /**
   * IPFSUploadError
   * @param {string} message
   */
  constructor (message) {
    super(message);
    this.name = 'IPFSUploadError';
  }
}

export default IPFSUploadError;
