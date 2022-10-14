//const { BigNumber, ethers } = require("ethers");
//const keccak256 = require("keccak256");
const WARLOCK = artifacts.require("WARLOCK");
const truffleAssert = require("truffle-assertions");
const { ethers } = require("ethers");

/**
 * LIST OF ACCOUNTS IN TEST :
 * const kanji_Account = accounts[0];
 * const brand_Account = accounts[1];
 * const brand_client_account = accounts[2];
 * const brand_client_account2 = accounts[3];
 * const accountBrandsRoyalties1 = accounts[4];
 * const accountBrandsRoyalties2 = accounts[5];
 * const kanjiAddressFeesBeneficiaries = accounts[6];
 * const accountBrandBeneficiaries1 = accounts[7];
 * const accountBrandBeneficiaries2 = accounts[8];
 * const senderRoyalties = accounts[9];
 */

function generateBytes32FromNumber(number) {
  return ethers.utils.hexZeroPad(ethers.utils.hexlify(number), 32);
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
      purchasesQuantity: generateBytes32FromNumber(0),
      currentLimit: generateBytes32FromNumber(0),
      maxLimit: generateBytes32FromNumber(10),
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
        purchasesQuantity: generateBytes32FromNumber(0),
        currentLimit: generateBytes32FromNumber(0),
        maxLimit: generateBytes32FromNumber(10),
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
      await this.warlock.buyInMarket(0, generateBytes32FromNumber(1), {
        from: accounts[1],
        value: "1000",
      });
    });

    it("SUCCESS : buy in market", async function () {
      await this.warlock.buyInMarket(0, generateBytes32FromNumber(2), {
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
        this.warlock.buyInMarket(0, generateBytes32FromNumber(10), {
          from: accounts[2],
          value: "10000",
        }),
        "Max quantity reached",
      );
    });

    it("ERROR : but with not enought money", async function () {
      await truffleAssert.reverts(
        this.warlock.buyInMarket(0, generateBytes32FromNumber(1), {
          from: accounts[2],
          value: "999",
        }),
        "Not enought value",
      );
    });

    it("ERROR : but with not enought money", async function () {
      await truffleAssert.reverts(
        this.warlock.buyInMarket(0, generateBytes32FromNumber(2), {
          from: accounts[2],
          value: "1000",
        }),
        "Not enought value",
      );
    });

    it("SUCCESS : get purchases consumer", async function () {
      /*const firstConsumer = await this.warlock.getPurchasesConsumer(accounts[0]);
      console.log(firstConsumer)*/
      const secondConsumer = await this.warlock.getPurchasesConsumer(accounts[1]);
      console.log(secondConsumer)
    });

    //getPurchasesConsumer
  });
});
