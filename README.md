# Customs smart contracts

### Install library dependancies for local test

```bash
yarn
```

### Start local network with ganache

```bash
yarn ganache
```

### All available commands

The package.json file contains a set of scripts to help on the development phase. Below is a short description for each

- **"ganache"** run local node (development network) with ganache-cli
- **"migrate"** run migration on development network
- **"test"** run tests locally
- **"test:ci"** run tests in CI system
- **"lint:sol"** lint solidity code according to rules
- **"lint:js"** lint javascript code according to rules
- **"lint"** lint solidity code
- **"truffle test -- -g "name of test""** run specific test

### Solhint

[You can find rules and explanations here](https://github.com/protofire/solhint/blob/master/docs/rules.md)

# CONTRACTS

# WARLOCK

This contract is a marketplace contract, it allows to register different marketplaces under a specific structure

## STRUCTURE

```javascript
struct Market {
    uint256 id;
    uint256 value;
    Consumer[] consumers;
    string uri;
    string externalUrl;
    bytes32 name;
    bytes32 purchasesQuantity;
}
```

Once the marketplaces, anyone can buy the product from that marketplace.

Each purchase is recorded on the blockchain in a structure linked to a market:

```javascript
struct Purchase {
    uint256 market;
    uint256 value;
    address consumer;
    bytes32 quantity;
    bytes32 status; //shipping //waiting
}
```

And its status can be updated by the owner.

```javascript

```

Each buyer is registered on the blockchain in a linked structure:

```javascript
struct Consumer {
    uint256 totalPurchase;
    address addr;
    Purchase[] purchases;
}
```

## SETTER

You can add, update or delete markets.

```javascript
function setMarkets(Market[] calldata newMarkets) external onlyOwner {
    delete markets;
    for (uint256 i = 0; i < newMarkets.length; i++) {
      markets.push(newMarkets[i]);
    }
}
```

```javascript
function addMarket(Market calldata newMarket) external onlyOwner {
    markets.push(newMarket);
}
```

```javascript
function updateMarket(Market calldata newMarket, uint256 key) external onlyOwner {
    markets[key] = newMarket;
}
```

```javascript
function removeMarket(uint256 id) external onlyOwner {
    delete markets[id];
}
```

Products can be purchased by anyone in exchange for crypto

```javascript
function buyInMarket(uint256 marketId, bytes32 quantity) external payable {
    require(msg.value >= markets[marketId].value * asciiToInteger(quantity));
    require(
      asciiToInteger(markets[marketId].currentLimit) + asciiToInteger(quantity) <
        asciiToInteger(markets[marketId].maxLimit)
    );
    Purchase memory purchase = Purchase({
      market: marketId,
      quantity: quantity,
      value: msg.value,
      consumer: msg.sender,
      status: STATUS_IN_ORDER
    });
    purchases[msg.sender][consumers[msg.sender].totalPurchase] = purchase;
    consumers[msg.sender].purchases.push(purchase);
    consumers[msg.sender].totalPurchase++;
    if (consumers[msg.sender].addr != msg.sender) consumers[msg.sender].addr = msg.sender;
    if (existsInConsumers(msg.sender, markets[marketId].consumers) == false)
      markets[marketId].consumers.push(consumers[msg.sender]);
}
```

## GUETTER

```javascript
function getMarkets() external view returns (Market[] memory) {
    return markets;
}
```

```javascript
function getMarket(uint256 marketId) external view returns (Market memory) {
    return markets[marketId];
  }
```

```javascript
function getConsumer(address consumerAddress) external view returns (Consumer memory) {
    return consumers[consumerAddress];
  }
```

```javascript
function getMarketConsumers(uint256 marketId)
    external
    view
    returns (Consumer[] memory)
  {
    return markets[marketId].consumers;
  }
```

```javascript
function getPurchasesConsumer(address consumerAddress)
    external
    view
    returns (Purchase[] memory)
  {
    Purchase[] memory consumerPurcharses;
    for (uint256 i = 0; i < consumers[consumerAddress].totalPurchase; i++) {
      consumerPurcharses[i] = purchases[consumerAddress][i];
    }
    return consumerPurcharses;
  }
```
