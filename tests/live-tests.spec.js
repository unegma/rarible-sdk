import { RaribleSDK } from "../src";
import chai from "chai";
const expect = chai.expect;
require('dotenv').config();

const {
  PINATA_API_KEY,
  PINATA_API_SECRET,
  EXAMPLE_IMAGE_PATH
} = process.env;

/**
 * WARNING, THESE TESTS WILL RUN A LIVE TEST IF .env CONTAINS LIVE API KEYS
 */
describe('Tests', () => {

  it('Should upload an image to IPFS and get a hash back', async () => {
    const raribleSDK = new RaribleSDK();
    const result = await raribleSDK.uploadImageToIPFS(PINATA_API_KEY, PINATA_API_SECRET, EXAMPLE_IMAGE_PATH);

    expect(result.data).to.equal('Minted!');
    console.log('Done');
  })
});
