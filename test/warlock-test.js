//const { BigNumber, ethers } = require("ethers");
//const keccak256 = require("keccak256");
const WARLOCK = artifacts.require("WARLOCK");
const truffleAssert = require("truffle-assertions");
const { ethers } = require("ethers");

function bytes32FromNumber(number) {
  return ethers.utils.hexZeroPad(ethers.utils.hexlify(number), 32);
}

function numberFromBytes32(bytes32) {
  return parseInt(Number(bytes32));
}

contract("KANJIDROPERC721AWithReceive", async accounts => {
  const markets = [
    {
      id: 0,
      value: 1000,
      consumers: [],
      uri: "",
      externalUrl: "",
      name: web3.utils.fromAscii("test de name un poil long").padEnd(66, "0"), //ethers.utils.formatBytes32String(
      purchasesQuantity: bytes32FromNumber(0),
      currentLimit: bytes32FromNumber(0),
      maxLimit: bytes32FromNumber(10),
    },
  ];

  before(async function () {
    this.warlock = await WARLOCK.new(); // we deploy contract
  });

  describe("", async function () {
    it("SUCCESS : set markets", async function () {
      await this.warlock.setMarkets(markets);
    });

    it("SUCCESS : add market", async function () {
      await this.warlock.addMarket(markets[0], {
        from: accounts[0],
      });
    });

    it("SUCCESS : get markets", async function () {
      const marketsReturned = await this.warlock.getMarkets();
      marketsReturned.forEach(market => {
        assert.equal(market.value, markets[0].value, "test");
      });
    });

    it("SUCCESS : update market", async function () {
      const newMarket = {
        id: 0,
        value: 1000,
        consumers: [],
        uri: "",
        externalUrl: "",
        name: web3.utils.fromAscii("my real market").padEnd(66, "0"), //ethers.utils.formatBytes32String(
        purchasesQuantity: bytes32FromNumber(0),
        currentLimit: bytes32FromNumber(0),
        maxLimit: bytes32FromNumber(10),
      };
      await this.warlock.updateMarket(newMarket, 0, {
        from: accounts[0],
      });
    });

    it("SUCCESS : remove market", async function () {
      await this.warlock.removeMarket(1, {
        from: accounts[0],
        //value: "200000000000000000",
      });
    });

    it("SUCCESS : get markets", async function () {
      const marketsReturned = await this.warlock.getMarkets();
      marketsReturned.forEach(market => {
        assert.equal(market.value, markets[0].value, "test");
      });
    });

    it("SUCCESS : buy in market", async function () {
      await this.warlock.buyInMarket(0, bytes32FromNumber(1), {
        from: accounts[1],
        value: "1000",
      });
    });

    it("SUCCESS : buy in market", async function () {
      await this.warlock.buyInMarket(0, bytes32FromNumber(2), {
        from: accounts[2],
        value: "2000",
      });
    });

    it("SUCCESS : get markets", async function () {
      const marketsReturned = await this.warlock.getMarkets();
      marketsReturned.forEach(market => {
        assert.equal(market.value, markets[0].value, "test");
      });
    });

    it("ERROR : buy too many in market", async function () {
      await truffleAssert.reverts(
        this.warlock.buyInMarket(0, bytes32FromNumber(10), {
          from: accounts[2],
          value: "10000",
        }),
        "Max quantity reached",
      );
    });

    it("ERROR : but with not enought money", async function () {
      await truffleAssert.reverts(
        this.warlock.buyInMarket(0, bytes32FromNumber(1), {
          from: accounts[2],
          value: "999",
        }),
        "Not enought value",
      );
    });

    it("ERROR : but with not enought money", async function () {
      await truffleAssert.reverts(
        this.warlock.buyInMarket(0, bytes32FromNumber(2), {
          from: accounts[2],
          value: "1000",
        }),
        "Not enought value",
      );
    });

    it("SUCCESS : get purchases consumer", async function () {
      const firstConsumerpurchases = await this.warlock.getPurchasesConsumer(accounts[1]);
      assert.equal(numberFromBytes32(firstConsumerpurchases[0].quantity), 1, "test");
      const secondConsumer = await this.warlock.getPurchasesConsumer(accounts[2]);
      assert.equal(numberFromBytes32(secondConsumer[0].quantity), 2, "test");
      assert.equal(
        secondConsumer[0].status,
        web3.utils.fromAscii("IN ORDER").padEnd(66, "0"),
        "IN ORDER",
      );
    });

    //CHANGE STATUS DELIVERY
  });
});
