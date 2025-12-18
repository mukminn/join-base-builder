const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleNFT", function () {
  let nft;
  let owner;
  let user1;

  beforeEach(async function () {
    [owner, user1] = await ethers.getSigners();

    const SimpleNFT = await ethers.getContractFactory("SimpleNFT");
    nft = await SimpleNFT.deploy();
    await nft.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await nft.owner()).to.equal(owner.address);
    });

    it("Should have correct name and symbol", async function () {
      expect(await nft.name()).to.equal("BaseBuildersNFT");
      expect(await nft.symbol()).to.equal("BBNFT");
    });
  });

  describe("Minting", function () {
    it("Should allow minting with correct payment", async function () {
      const mintPrice = ethers.parseEther("0.001");
      const tokenURI = "https://example.com/metadata.json";

      await expect(
        nft.connect(user1).mintNFT(tokenURI, { value: mintPrice })
      )
        .to.emit(nft, "NFTMinted")
        .withArgs(user1.address, 0, mintPrice);

      expect(await nft.balanceOf(user1.address)).to.equal(1);
    });

    it("Should reject minting with insufficient payment", async function () {
      const insufficientPrice = ethers.parseEther("0.0005");
      const tokenURI = "https://example.com/metadata.json";

      await expect(
        nft.connect(user1).mintNFT(tokenURI, { value: insufficientPrice })
      ).to.be.revertedWith("Insufficient payment");
    });

    it("Should generate fees on mint", async function () {
      const mintPrice = ethers.parseEther("0.001");
      const tokenURI = "https://example.com/metadata.json";

      await nft.connect(user1).mintNFT(tokenURI, { value: mintPrice });

      const totalFees = await nft.getTotalFees();
      expect(totalFees).to.equal(mintPrice);
    });

    it("Should allow batch minting", async function () {
      const tokenURIs = [
        "https://example.com/1.json",
        "https://example.com/2.json",
        "https://example.com/3.json"
      ];
      const totalPrice = ethers.parseEther("0.003");

      await nft.connect(user1).batchMint(tokenURIs, { value: totalPrice });

      expect(await nft.balanceOf(user1.address)).to.equal(3);
    });
  });

  describe("Token URI", function () {
    it("Should return correct token URI", async function () {
      const mintPrice = ethers.parseEther("0.001");
      const tokenURI = "https://example.com/metadata.json";

      await nft.connect(user1).mintNFT(tokenURI, { value: mintPrice });

      expect(await nft.tokenURI(0)).to.equal(tokenURI);
    });
  });
});
