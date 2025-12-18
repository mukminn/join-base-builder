// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title ETHVault
 * @notice Vault contract for depositing and withdrawing ETH on Base
 * @dev Users can deposit ETH and owner can withdraw
 */
contract ETHVault is Ownable, ReentrancyGuard {
    mapping(address => uint256) public balances;
    uint256 public totalDeposited;

    event Deposit(address indexed user, uint256 amount, uint256 timestamp);
    event Withdraw(address indexed user, uint256 amount, uint256 timestamp);
    event OwnerWithdraw(address indexed owner, uint256 amount, uint256 timestamp);

    constructor(address _owner) Ownable(_owner) {}

    /**
     * @notice Receive ETH directly
     */
    receive() external payable {
        deposit();
    }

    /**
     * @notice Deposit ETH to vault
     */
    function deposit() public payable nonReentrant {
        require(msg.value > 0, "ETHVault: Amount must be greater than 0");
        
        balances[msg.sender] += msg.value;
        totalDeposited += msg.value;

        emit Deposit(msg.sender, msg.value, block.timestamp);
    }

    /**
     * @notice User withdraw their deposited ETH
     * @param amount Amount to withdraw in wei
     */
    function withdraw(uint256 amount) external nonReentrant {
        require(amount > 0, "ETHVault: Amount must be greater than 0");
        require(balances[msg.sender] >= amount, "ETHVault: Insufficient balance");
        require(address(this).balance >= amount, "ETHVault: Insufficient contract balance");

        balances[msg.sender] -= amount;
        totalDeposited -= amount;

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "ETHVault: Transfer failed");

        emit Withdraw(msg.sender, amount, block.timestamp);
    }

    /**
     * @notice Owner withdraw all ETH from contract
     * @dev Only owner can call this function
     */
    function ownerWithdraw() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "ETHVault: No balance to withdraw");

        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "ETHVault: Owner withdraw failed");

        emit OwnerWithdraw(owner(), balance, block.timestamp);
    }

    /**
     * @notice Get user balance
     * @param user Address to check
     * @return User's deposited balance
     */
    function getBalance(address user) external view returns (uint256) {
        return balances[user];
    }

    /**
     * @notice Get contract total balance
     * @return Contract ETH balance
     */
    function getTotalBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
