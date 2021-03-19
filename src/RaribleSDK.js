import { RaribleIntegrationError } from "./errors";

/**
 * Base Utilities Class
 */
class RaribleSDK {

  /**
   * @typedef { "rinkeby" | "mainnet" } network
   */

  /**
   *
   * @param {network} network
   */
  constructor(network= "mainnet") {
    this.network = network;
  }
}

export default RaribleSDK;
