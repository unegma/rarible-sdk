# Rarible SDK
Utility functions for interacting with Rarible API

## Usage

`npm install rarible-sdk --save`

```
import { RaribleSDK } from "rarible-sdk";
const rarible = new RaribleSDK();
const raribleTestnet = new RaribleSDK('rinkeby');

...
const = raribleOptions = {};
rarible.mintNFT(raribleOptions, 'ERC721');
rarible.mintNFT(raribleOptions, 'ERC1155');
```

## Testing

Tests need to use: `--require @babel/register`
