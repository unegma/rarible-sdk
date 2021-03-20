import { RaribleSDK } from "../src";
import chai from "chai";
const expect = chai.expect;

describe('Tests', () => {

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
