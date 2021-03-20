import { RaribleIntegrationError } from "./errors";
import { RINKEBY_CONSTS } from "./constants";
import { MAINNET_CONSTS } from "./constants";

/**
 * RaribleSDK
 */
class RaribleSDK {

  /**
   * @typedef { "rinkeby" | "mainnet" } network
   */

  /**
   *
   * @param {network} network
   */
  constructor(network= 'mainnet') {
    this.network = network;
    this.networkConsts = MAINNET_CONSTS;

    if(this.network === 'rinkeby') {
      this.networkConsts = RINKEBY_CONSTS;
    } else if (this.network !== 'mainnet') {
      throw new RaribleIntegrationError('Incorrect Network Specified');
    }
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

    // this.networkConsts.
    return { data: "Minted!" }
  }
}

export default RaribleSDK;
