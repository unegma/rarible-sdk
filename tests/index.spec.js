import { RaribleSDK } from "../src";
import chai from "chai";
const expect = chai.expect;
require('dotenv').config();

const {
  PINATA_API_KEY,
  PINATA_API_SECRET
} = process.env;

describe('Tests', () => {
  it('Should mint an NFT', async () => {
    const raribleSDK = new RaribleSDK();
    const result = await raribleSDK.lazyMintNFT({}, 'ERC721');

    expect(result.data).to.equal('Minted!');
    console.log('Done');
  })

  // it('Should upload an image to IPFS and get a hash back', async () => {
  //   const raribleSDK = new RaribleSDK();
  // })

  it('Should create MetaData in the correct Format', () => {
    const raribleSDK = new RaribleSDK();
    const result = raribleSDK.createMetaData('testName','testDescription','12334', {});

    expect(result).to.deep.equal({
      "attributes": [
        {
          "key": undefined,
          "trait_type": undefined,
          "value": undefined,
        }
      ],
      "description": "testDescription",
      "external_url": undefined,
      "image": "ipfs://ipfs/12334",
      "name": "testName"
    });
  })
});
