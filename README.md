# Rarible SDK
Utility functions for interacting with Rarible API

## Usage

`npm install rarible-sdk --save`

```
import { RaribleSDK } from "rarible-sdk";

// We first create an instance of the sdk which will use 'rinkeby' by default (can also use 'mainnet' // todo currently unfinished as need contract addresses) 
const raribleSDK = new RaribleSDK();

// We next have to upload an image to ipfs. This will return a hash which will we will then use to upload ALL the metadata to ipfs (2 calls altogether)
// you will currently need an account with pinata https://pinata.cloud/ // todo could add other services
// you will need to create a way of passing in a local path to the file // todo could add a cloud based url like aws s3
const imageIpfsUploadResponse = await raribleSDK.uploadImageToIPFS(PINATA_API_KEY, PINATA_API_SECRET, './tests/testData/beeplz.jpg');
const { IpfsHash } = imageIpfsUploadResponse;

// Next we have to use the hash generated above to post the metadata to ipfs
const ipfsMetaData = await raribleSDK.addMetaDataToIPFS(PINATA_API_KEY, PINATA_API_SECRET, 'My NFT Name', 'My NFT Description', 'ipfsHashFromUploadImageToIPFS);

// Finally we need to submit the data to Rarible. You will need to pass in a web3 object (see here: https://github.com/ChainSafe/web3.js) // todo could add other providers such as ethers
// todo I'm currently  not quite sure how to get the tokenId
const result = await raribleSDK.lazyMintNFT(web3, 'yourAddress', 'ERC721', tokenId, ipfsMetaData);

```

---

```
import { RaribleSDK } from "rarible-sdk";
const raribleSDK = new RaribleSDK('mainnet'); // THIS CURRENTLY ONLY WORKS WITH MAINNET (//todo need the correct url)

// Getting items
const raribleItems = await raribleSDK.getItems();

// Get Item by ID
// ID will likely take the format of a long number 0x000eb...  then a : then another long nubmer like 0x00ef..
// you can test with some example ids by calling getItems first and then seeing from there
const raribleItems = await raribleSDK.getItem('0x00eb:0x00');

// Get Item Meta by ID
const raribleItems = await raribleSDK.getItemMeta('0x00eb:0x00');

```

## Testing

Tests need to use: `--require @babel/register`
