//const { BigNumber, ethers } = require("ethers");
//const keccak256 = require("keccak256");
const WARLOCK = artifacts.require("WARLOCK");

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

contract("KANJIDROPERC721AWithReceive", async accounts => {
  let tokens = {};
  accounts.forEach((element, key) => {
    tokens[key] = element;
  });

  /*const kanjiAddressFeesBeneficiaries = accounts[6];
  const accountBeneficiaries1 = accounts[7];
  const accountBeneficiaries2 = accounts[8];
  const senderRoyalties = accounts[9];
  const cloneAccounts = [];
  const cloneAccountsValue = [];
  const countRoyalties = 2;*/
  console.log(web3.utils.fromAscii);
  const markets = [
    {
      id: 0,
      value: 1021,
      consumers: [],
      uri: "",
      externalUrl: "",
      name: web3.utils.fromAscii("test de name un poil long").padEnd(66, "0"), //web3.fromAscii("test"),
      purchasesQuantity: web3.utils.fromAscii("0").padEnd(66, "0"),
    },
  ];
  //ethers.utils.formatBytes32String(

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
        //value: "200000000000000000",
      });
    });

    it("SUCCESS : get markets", async function () {
      const markets = await this.warlock.getMarkets();
      console.log(markets);
    });
  });
});
