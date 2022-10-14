// SPDX-License-Identifier: MIT

// Into the Metaverse NFTs are governed by the following terms and conditions: https://a.did.as/into_the_metaverse_tc

pragma solidity ^0.8.6;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WARLOCK is Ownable {
  Market[] public markets;
  mapping(address => Consumer) private consumers;
  mapping(address => mapping(uint256 => Purchase)) private purchases;

  bytes32 public constant STATUS_IN_ORDER = bytes32("IN ORDER");
  bytes32 public constant STATUS_IN_DELIVERY = bytes32("IN DELIVERY");

  struct Market {
    uint256 id;
    uint256 value;
    address[] consumers;
    string uri;
    string externalUrl;
    bytes32 name;
    bytes32 purchasesQuantity;
    bytes32 currentLimit;
    bytes32 maxLimit;
  }

  struct Purchase {
    uint256 market;
    uint256 value;
    address consumer;
    bytes32 quantity;
    bytes32 status; //shipping //waiting
  }

  struct Consumer {
    uint256 totalPurchase;
    address addr;
  }

  constructor() {}

  /// @notice mettre a jour le tableau des marché, perds toutes les valeur précédement enregistrer
  /// @param newMarkets nouveau tableau de marché
  function setMarkets(Market[] calldata newMarkets) external onlyOwner {
    delete markets;
    for (uint256 i = 0; i < newMarkets.length; i++) {
      markets.push(newMarkets[i]);
    }
  }

  /// @notice ajouter un marché au tableau des marché
  /// @param newMarket structure du marché a ajouter
  function addMarket(Market calldata newMarket) external onlyOwner {
    markets.push(newMarket);
  }

  /// @notice mettre a jour un marché au tableau des marché
  /// @param newMarket structure du marché a mêttre a jour
  /// @param key clé du tableau de marché a supprimé
  function updateMarket(Market calldata newMarket, uint256 key) external onlyOwner {
    markets[key] = newMarket;
  }

  /// @notice supprimé un marché du tableau des marché
  /// @param key clé du tableau de marché a supprimé
  function removeMarket(uint256 key) external onlyOwner {
    markets[key] = markets[markets.length - 1];
    markets.pop();
  }

  /// @notice acheter un produit du marché
  /// @param marketId clé du marché dont vous voulez acheter le produit
  /// @param quantity quantité de produit que vous voulez acheter
  function buyInMarket(uint256 marketId, bytes32 quantity) external payable {
    require(
      msg.value >= markets[marketId].value * uint256(quantity),
      "Not enought value"
    );
    require(
      uint256(markets[marketId].currentLimit) + uint256(quantity) <
        uint256(markets[marketId].maxLimit),
      "Max quantity reached"
    );
    Purchase memory purchase = Purchase({
      market: marketId,
      quantity: quantity,
      value: msg.value,
      consumer: msg.sender,
      status: STATUS_IN_ORDER
    });
    purchases[msg.sender][consumers[msg.sender].totalPurchase] = purchase;
    consumers[msg.sender].totalPurchase++;
    if (consumers[msg.sender].addr != msg.sender) consumers[msg.sender].addr = msg.sender;
    if (existsInConsumers(msg.sender, markets[marketId].consumers) == false)
      markets[marketId].consumers.push(msg.sender);
  }

  ///@notice récupère tout les marché storé
  ///@return markets tableau des marché
  function getMarkets() external view returns (Market[] memory) {
    return markets;
  }

  ///@notice récupère un marché
  ///@param marketId clé du tableau de marché a récupéré
  ///@return market marché que l'ont veux retourné
  function getMarket(uint256 marketId) external view returns (Market memory) {
    return markets[marketId];
  }

  ///@notice retourne un consomateur
  ///@param consumerAddress addresse wallet du consomateur qui doit être retourner
  ///@return consumer retourne le consomateur correspondant
  function getConsumer(address consumerAddress) external view returns (Consumer memory) {
    return consumers[consumerAddress];
  }

  ///@notice retourne un tableau de consomateur ayant acheter un produit d'un marché
  ///@param marketId addresse wallet du consomateur qui doit être retourner
  ///@return consumers retourne les consomateurs correspondant
  function getMarketConsumers(uint256 marketId) external view returns (address[] memory) {
    return markets[marketId].consumers;
  }

  ///@notice retourne les achats d'un consomateur
  ///@param consumerAddress addresse wallet du consomateur qui doit être retourner
  ///@return consumerPurcharses retourne les achats du consomateur correspondant
  function getPurchasesConsumer(address consumerAddress)
    external
    view
    returns (Purchase[] memory)
  {
    Purchase[] memory consumerPurcharses = new Purchase[](consumers[consumerAddress].totalPurchase);
    for (uint256 i = 0; i < consumers[consumerAddress].totalPurchase; i++) {
      consumerPurcharses[i] = purchases[consumerAddress][i];
    }
    return consumerPurcharses;
  }

  function existsInConsumers(address addr, address[] memory consumersArr)
    public
    pure
    returns (bool)
  {
    for (uint256 i = 0; i < consumersArr.length; i++) {
      if (consumersArr[i] == addr) {
        return true;
      }
    }

    return false;
  }

  //rajouter un sbt dont les valeurs augmente avec le nbr d'achat
}
