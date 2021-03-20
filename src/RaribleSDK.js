import { RaribleIntegrationError, IPFSUploadError } from "./errors";
import { RINKEBY_CONSTS } from "./constants/constants";
import { MAINNET_CONSTS } from "./constants/constants";
import axios from "axios";
import fs from "fs";
import FormData from "form-data";
const ERC721  = require("./constants/ERC721ABI.json");
const ERC1155  = require("./constants/ERC1155ABI.json");

/**
 * RaribleSDK
 */
class RaribleSDK {

  /**
   * @typedef { "rinkeby" | "mainnet" } network
   */

  /**
   * RaribleSDK
   * @param {network} network
   * @throws {RaribleIntegrationError} will throw an error if wrong network is supplied
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
   * Lazy mint an NFT (the item will not be created on Chain until it is bought)
   *
   * @param {Object} raribleOptions
   * @param {type} type
   * @returns {Promise<{data: string}>}
   */
  async lazyMintNFT(raribleOptions, type) {

    // this.networkConsts.
    return { data: "Minted!" }
  }

  /**
   * Upload an image to IPFS
   * // todo add implementation for infura?
   * // todo add ability to supply a URL
   * Currently this is using Pinata and local files only
   *
   * Will return IPFS CID
   * ```
   * {
   *   IpfsHash: // This is the IPFS multi-hash provided back for your content,
   *   PinSize: // This is how large (in bytes) the content you just pinned is,
   *   Timestamp: // This is the timestamp for your content pinning (represented in ISO 8601 format)
   * }
   *```
   *
   * @param {string} pinataAPIKey
   * @param {string} pinataAPISecret
   * @param {string} fileURL
   * @throws {IPFSUploadError} will throw an error if can't upload to IPFS
   * @returns {Promise<{IpfsHash: string, PinSize: *, TimeStamp: *}>} // todo check
   */
  async uploadImageToIPFS(pinataAPIKey, pinataAPISecret, fileURL) {
    try {
      const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
      let data = new FormData({});
      data.append("file", fs.createReadStream(fileURL));

      const response = await axios.post(url, data, {
        headers: {
          "Content-Type": `multipart/form-data; boundary= ${data._boundary}`,
          pinata_api_key: pinataAPIKey,
          pinata_secret_api_key: pinataAPISecret,
        }
      });
      return response;
    } catch (error) {
      throw new IPFSUploadError(error.message);
    }
  }
}

export default RaribleSDK;
