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
      let data = new FormData({});
      data.append("file", fs.createReadStream(fileURL));

      const axiosConfig = this.getAxiosConfig(pinataAPIKey, pinataAPISecret,
          data, `multipart/form-data; boundary= ${data._boundary}`);

      return await axios(axiosConfig);
    } catch (error) {
      throw new IPFSUploadError(error.message);
    }
  }

  /**
   * @typedef {{raribleURL: string|undefined, keyName: *|undefined, traitType: *|undefined, keyValue: *|undefined}} RaribleAttributes
   */

  /**
   * Add MetaData to IPFS
   * 2nd IPFS step after uploading an image and getting the hash
   *
   * Example result:
   * ```
   * {
   * "IpfsHash": "hsdfhlhkasfd",
   * "PinSize": 290,
   * "Timestamp": "2021-02-10T14:06:09.255Z"
   * }
   *```
   *
   * @param {string} pinataAPIKey
   * @param {string} pinataAPISecret
   * @param {string} nftName
   * @param {string} nftDescription
   * @param {string} imageIpfsHash
   * @param {RaribleAttributes} extraAttributes
   * @returns {Promise<*>}
   */
  async addMetaDataToIPFS(pinataAPIKey, pinataAPISecret, nftName, nftDescription, imageIpfsHash, extraAttributes) {
    try {
      let data = this.createMetaData(nftName, nftDescription, imageIpfsHash, extraAttributes);
      const axiosConfig = this.getAxiosConfig(pinataAPIKey, pinataAPISecret, data, 'application/json');
      return await axios(axiosConfig); // JSON.stringify(response.data)
    } catch (error) {
      throw new IPFSUploadError(error.message);
    }
  }

  /**
   * Format the metadata correctly for uploading
   * @param {string} nftName
   * @param {string} nftDescription
   * @param {IpfsHash} ipfsHash
   * @param {RaribleAttributes|undefined} extraAttributes
   * @returns {string}
   */
  createMetaData(nftName, nftDescription, ipfsHash, extraAttributes) {
    const {
      raribleURL,
      keyName,
      traitType,
      keyValue
    } = extraAttributes;

    return JSON.stringify({
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
    })
  }

  /**
   * Get Axios config
   *
   * @param {string} pinataAPIKEY
   * @param {string} pinataSECRETKEY
   * @param {*} data
   * @param {string} contentType
   * @returns {{headers: {pinata_api_key: *, pinata_secret_api_key: *, "Content-Type": string}, method: string, data: *, url: string}}
   */
  getAxiosConfig(pinataAPIKEY, pinataSECRETKEY, data, contentType) {
    return {
      method: 'post',
      url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
      headers: {
        'pinata_api_key': pinataAPIKEY,
        'pinata_secret_api_key': pinataSECRETKEY,
        'Content-Type': contentType
      },
      data: data
    };
  }

  /**
   * Get all items from rarible
   * Looks like it is paged by 50 items so will need to do multiple calls
   *
   * @returns {Promise<*>}
   */
  async getItems() {
    try {
      const axiosConfig = {
        method: 'get',
        url: `${this.networkConstants.RaribleURLBase}protocol/ethereum/nft/indexer/v1/items`
      };
      return await axios(axiosConfig);
    } catch(error) {
      throw new RaribleIntegrationError(error.message);
    }
  }

  /**
   * Get item meta by item id
   * @param {string} id
   * @returns {Promise<*>}
   */
  async getItemMeta(id) {
    try {
      const axiosConfig = {
        method: 'get',
        url: `${this.networkConstants.RaribleURLBase}protocol/ethereum/nft/indexer/v1/items/${id}/meta`
      };
      return await axios(axiosConfig);
    } catch(error) {
      throw new RaribleIntegrationError(error.message);
    }
  }

  /**
   * Get item data by item id
   * @param {string} id
   * @returns {Promise<*>}
   */
  async getItem(id) {
    try {
      const axiosConfig = {
        method: 'get',
        url: `${this.networkConstants.RaribleURLBase}protocol/ethereum/nft/indexer/v1/items/${id}`
      };
      return await axios(axiosConfig);
    } catch(error) {
      throw new RaribleIntegrationError(error.message);
    }
  }
}

export default RaribleSDK;
