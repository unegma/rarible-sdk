import { RaribleSDK } from "../src";
import chai from "chai";
const expect = chai.expect;

describe('Tests', () => {
  it('Should mint an NFT', async () => {
    const raribleSDK = new RaribleSDK();
    const result = await raribleSDK.mintNFT({}, 'ERC721');

    expect(result.data).to.equal('Minted!');
    console.log('Done');
  })
});
