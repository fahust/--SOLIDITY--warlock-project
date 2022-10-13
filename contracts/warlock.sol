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

  struct Market {
    uint256 id;
    uint256 value;
    bytes32 name;
    bytes32 purchasesQuantity;
  }

  struct Purchase {
    uint256 market;
    uint256 value;
    bytes32 quantity;
  }

  struct Consumer {
    uint256 totalPurchase;
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

  /// @notice supprimé un marché du tableau des marché
  /// @param id clé du tableau de marché a supprimé
  function removeMarket(uint256 id) external onlyOwner {
    delete markets[id];
  }

  /// @notice acheter un produit du marché
  /// @param marketId clé du marché dont vous voulez acheter le produit
  /// @param quantity quantité de produit que vous voulez acheter
  function buyInMarket(uint256 marketId, bytes32 quantity) external payable {
    require(msg.value >= markets[marketId].value * asciiToInteger(quantity));
    purchases[msg.sender][consumers[msg.sender].totalPurchase] = Purchase({
      market: marketId,
      quantity: quantity,
      value: msg.value
    });
    consumers[msg.sender].totalPurchase++;
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

  ///@notice retourne les achats d'un consomateur
  ///@param consumerAddress addresse wallet du consomateur qui doit être retourner
  ///@return consumerPurcharses retourne les achats du consomateur correspondant
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

  function asciiToInteger(bytes32 x) public pure returns (uint256) {
    uint256 y;
    for (uint256 i = 0; i < 32; i++) {
      uint256 c = (uint256(x) >> (i * 8)) & 0xff;
      if (48 <= c && c <= 57) y += (c - 48) * 10**i;
      else break;
    }
    return y;
  }

  //rajouter un sbt dont les valeurs augmente avec le nbr d'achat
}
