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

  /**
   * @typedef { "ERC1155" | "ERC721" } type
   */

  /**
   *
   * @param {Object} raribleOptions
   * @param {type} type
   * @returns {Promise<{data: string}>}
   */
  async mintNFT(raribleOptions, type) {

    return { data: "Minted!" }
  }
}

export default RaribleSDK;
