import { RaribleIntegrationError, IPFSUploadError } from "./errors";
import { RINKEBY_CONSTS } from "./constants/constants";
import { MAINNET_CONSTS } from "./constants/constants"; // todo the actual values need finding and adding. Currently, users can pass in manually to the constructor
import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import Web3 from "web3";
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
   * @typedef { "ERC1155" | "ERC721" } ABIType
   */

  /**
   * @typedef {{tokenId: string|int|undefined, imageUri: string|undefined, creators: *|undefined, royalties: *|undefined, signatures: *|undefined}} Mint721Data
   */

  /**
   * Lazy mint an NFT (the item will not be created on Chain until it is bought)
   *
   * Need to pass in a web3 object (may add support for other providers too) e.g.:
   *
   * ```
   * // See here: https://github.com/ChainSafe/web3.js
   * var Web3 = require("web3");
   * var web3 = new Web3(
   *   new Web3.providers.HttpProvider(
   *   "https://mainnet.infura.io/v3/123456"
   *   )
   * );
   *```
   *
   * @param {Web3} web3 // todo we may want to add other providers here ethers maybe?
   * @param {string} address Your Ethereum Wallet Public Key Address
   * @param {Mint721Data} raribleOptions
   * @param {ABIType} type
   * @returns {Promise<{data: string}>}
   */
  async lazyMintNFT(web3, address, raribleOptions, type) {
    try {
      const {
        tokenId,
        imageUri,
        creators,
        royalties = [],
        signatures = ["0x"]
      } = raribleOptions;

      let contractAbi;

      switch (type) {
        case "ERC721":
          contractAbi = JSON.parse(ABIS.ERC721);
          break;
        case "ERC1155":
          contractAbi = JSON.parse(ABIS.ERC721);
          break;
      }

      const contract = new web3.eth.Contract(contractAbi, address);
      const raribleOptionsJSON = [
        tokenId,
        imageUri,
        [creators, royalties, signatures]
      ]

      let response = await contract.methods.mintAndTransfer(raribleOptionsJSON, address);
      return response;
    } catch(error) {
      throw new RaribleIntegrationError(error.message);
    }
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
