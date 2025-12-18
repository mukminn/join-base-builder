const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FeeGenerator", function () {
  let feeGenerator;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    const FeeGenerator = await ethers.getContractFactory("FeeGenerator");
    feeGenerator = await FeeGenerator.deploy();
    await feeGenerator.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await feeGenerator.owner()).to.equal(owner.address);
    });

    it("Should start with zero fees", async function () {
      expect(await feeGenerator.totalFeesGenerated()).to.equal(0);
    });
  });

  describe("Deposit", function () {
    it("Should allow deposit with minimum amount", async function () {
      const depositAmount = ethers.parseEther("0.001");
      await expect(feeGenerator.connect(user1).deposit({ value: depositAmount }))
        .to.emit(feeGenerator, "Deposit");

      const balance = await feeGenerator.getBalance();
      expect(balance).to.be.gt(0);
    });

    it("Should reject deposit below minimum", async function () {
      const depositAmount = ethers.parseEther("0.0005");
      await expect(
        feeGenerator.connect(user1).deposit({ value: depositAmount })
      ).to.be.revertedWith("Minimum deposit is 0.001 ETH");
    });

    it("Should generate fees on deposit", async function () {
      const depositAmount = ethers.parseEther("0.01");
      await feeGenerator.connect(user1).deposit({ value: depositAmount });

      const totalFees = await feeGenerator.getTotalFees();
      expect(totalFees).to.be.gt(0);
    });
  });

  describe("Withdraw", function () {
    beforeEach(async function () {
      // Setup: user1 deposits some ETH
      await feeGenerator.connect(user1).deposit({ 
        value: ethers.parseEther("0.01") 
      });
    });

    it("Should allow withdraw", async function () {
      const withdrawAmount = ethers.parseEther("0.005");
      await expect(feeGenerator.connect(user1).withdraw(withdrawAmount))
        .to.emit(feeGenerator, "Withdraw");
    });

    it("Should reject withdraw with insufficient balance", async function () {
      const withdrawAmount = ethers.parseEther("0.1");
      await expect(
        feeGenerator.connect(user1).withdraw(withdrawAmount)
      ).to.be.revertedWith("Insufficient balance");
    });

    it("Should generate fees on withdraw", async function () {
      const initialFees = await feeGenerator.getTotalFees();
      const withdrawAmount = ethers.parseEther("0.005");
      
      await feeGenerator.connect(user1).withdraw(withdrawAmount);
      
      const finalFees = await feeGenerator.getTotalFees();
      expect(finalFees).to.be.gt(initialFees);
    });
  });

  describe("Stats", function () {
    it("Should return correct stats", async function () {
      await feeGenerator.connect(user1).deposit({ 
        value: ethers.parseEther("0.01") 
      });

      const stats = await feeGenerator.getStats();
      expect(stats[0]).to.be.gt(0); // totalFeesGenerated
      expect(stats[1]).to.be.gt(0); // totalDeposits
    });
  });
});
