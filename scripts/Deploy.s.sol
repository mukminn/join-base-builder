// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {ETHVault} from "../contracts/ETHVault.sol";
import {NFTMint} from "../contracts/NFTMint.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        vm.startBroadcast(deployerPrivateKey);

        // Deploy ETHVault
        ETHVault ethVault = new ETHVault(deployer);
        console.log("ETHVault deployed at:", address(ethVault));

        // Deploy NFTMint
        NFTMint nftMint = new NFTMint(deployer);
        console.log("NFTMint deployed at:", address(nftMint));

        vm.stopBroadcast();
    }
}
