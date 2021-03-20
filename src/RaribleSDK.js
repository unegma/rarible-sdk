import { RaribleIntegrationError, IPFSUploadError } from "./errors";
import { RINKEBY_CONSTS } from "./constants/constants";
import { MAINNET_CONSTS } from "./constants/constants"; // todo the actual values need finding and adding. Currently, users can pass in manually to the constructor
import axios from "axios";
import fs from "fs";
import FormData from "form-data";
const ERC721  = require("./constants/ERC721ABI.json");
const ERC1155  = require("./constants/ERC1155ABI.json");
const ABIS = {
  ERC721: ERC721,
  ERC1155: ERC1155,
}
/**
 * RaribleSDK
 */
class RaribleSDK {

  /**
   * @typedef { "rinkeby" | "mainnet" } network
   */

  /**
   * @type {{NFTTransferProxy: string, ERC721: string, ERC1155: string, ERC20TransferProxy: string, ExchangeContract: string}} NetworkConsts
   */

  /**
   * @type {{ERC721: *, ERC1155: *}} ABIS These will be JSON of the ABIs
   */

  /**
   * RaribleSDK
   *
   * @param {network} network - Rinkeyby by default
   * @param {{NetworkConstants}} networkConstants - Will currently use Rinkeby by Default, // todo need to find real ones for mainnet, but user can pass in manually for now
   * @param {{ABIS}} abis - An object currently containing ERC721 AND ERC1155 objects of JSON
   * @throws {RaribleIntegrationError} will throw an error if wrong network is supplied
   */
  constructor(network= 'rinkeby', networkConstants = RINKEBY_CONSTS, abis = ABIS) {
    this.network = network;
    this.networkConstants = networkConstants;
    this.abis = abis;

    if(this.network === 'rinkeby') {
      this.networkConstants = RINKEBY_CONSTS;
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

    // this.networkConstants.
    return { data: "Minted!" }
  }

  /**
   * @typedef {string} IpfsHash
   */

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
   * @returns {Promise<{IpfsHash: IpfsHash, PinSize: *, TimeStamp: *}>} // todo check
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

  /**
   * @typedef {{raribleURL: string|undefined, keyName: *|undefined, traitType: *|undefined, keyValue: *|undefined}} RaribleAttributes
   */

  /**
   * Format the metadata correctly for uploading
   * @param {string} nftName
   * @param {string} nftDescription
   * @param {IpfsHash} ipfsHash
   * @param {RaribleAttributes|undefined} extraAttributes
   * @returns {{image: string, external_url: *, name: *, description: *, attributes: [{value: *, key: *, trait_type: *}]}}
   */
  createMetaData(nftName, nftDescription, ipfsHash, extraAttributes) {
    const {
      raribleURL,
      keyName,
      traitType,
      keyValue
    } = extraAttributes;

    return {
      "name": nftName,
      "description": nftDescription,
      "image": `ipfs://ipfs/${ipfsHash}`,
      "external_url": raribleURL, /* This is the link to Rarible which we currently don't have, we can fill this in shortly */
      // the below section is not needed.
      "attributes": [
        {
          "key": keyName,
          "trait_type": traitType,
          "value": keyValue
        }
      ]
    }
  }
}

export default RaribleSDK;
