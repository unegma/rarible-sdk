import { RaribleSDK } from "../src";
import chai from "chai";
import Web3 from "web3";

const expect = chai.expect;
require('dotenv').config();

const {
  PINATA_API_KEY,
  PINATA_API_SECRET,
  EXAMPLE_IMAGE_PATH,
  INFURA_APP_KEY,
  INFURA_ENDPOINT,
  EXAMPLE_ITEM_ID
} = process.env;

/**
 * !! WARNING, THESE TESTS WILL RUN A LIVE TEST IF .env CONTAINS LIVE API KEYS !!
 *
 * remember to use: `--require @babel/register`
 */

const web3 = new Web3(
    new Web3.providers.WebsocketProvider(
        `${INFURA_ENDPOINT}${INFURA_APP_KEY}`,
        {
          timeout: 30000, // ms

          clientConfig: {
            // Useful if requests are large
            maxReceivedFrameSize: 100000000, // bytes - default: 1MiB
            maxReceivedMessageSize: 100000000, // bytes - default: 8MiB

            // Useful to keep a connection alive
            keepalive: true,
            keepaliveInterval: 60000, // ms
          },

          // Enable auto reconnection
          reconnect: {
            auto: true,
            delay: 5000, // ms
            maxAttempts: 5,
            onTimeout: false,
          },
        }
    )
);

it('Should mint an NFT', async () => {
  const raribleSDK = new RaribleSDK();
  const result = await raribleSDK.lazyMintNFT(web3, 'ERC721');

  console.log('Done');
})

it('Should upload an image to IPFS and get a hash back', async () => {
  const raribleSDK = new RaribleSDK();
  const result = await raribleSDK.uploadImageToIPFS(PINATA_API_KEY, PINATA_API_SECRET, EXAMPLE_IMAGE_PATH);

  console.log('Done');
})

it('Should upload an image to IPFS and get a hash back and then upload the metadata', async () => {
  const raribleSDK = new RaribleSDK('rinkeyby');
  const imageIpfsUploadResponse = await raribleSDK.uploadImageToIPFS(PINATA_API_KEY, PINATA_API_SECRET, './tests/testData/beeplz.jpg');
  const { IpfsHash } = imageIpfsUploadResponse;

  const ipfsMetaData = await raribleSDK.addMetaDataToIPFS(PINATA_API_KEY, PINATA_API_SECRET, 'My NFT Name', 'My NFT Description', IpfsHash, {});

  console.log('Done');
})

it('Should get items', async () => {
  const raribleSDK = new RaribleSDK('mainnet');
  let items = await raribleSDK.getItems();

  console.log('Done');
})

it('Should get item  by id', async () => {
  const raribleSDK = new RaribleSDK('mainnet');
  let item = await raribleSDK.getItem(EXAMPLE_ITEM_ID);

  console.log('Done');
})

it('Should get item meta by id', async () => {
  const raribleSDK = new RaribleSDK('mainnet');
  let item = await raribleSDK.getItem(EXAMPLE_ITEM_ID);

  console.log('Done');
})
