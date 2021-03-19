# Rarible SDK
Utility functions for interacting with Rarible API

## Usage

`npm install @unegma/rarible-sdk --save`

```

const rarible = new RaribleSDK();
const raribleTestnet = new RaribleSDK('rinkeby');

...
const = raribleOptions = {};
rarible.mintNFT(raribleOptions, 'ERC721');
rarible.mintNFT(raribleOptions, 'ERC1155');
```
