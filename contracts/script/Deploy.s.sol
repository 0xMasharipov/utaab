// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Script, console2} from "forge-std/Script.sol";
import {UtaabCertificate} from "../src/UtaabCertificate.sol";

contract Deploy is Script {
    function run() external {
        address admin = vm.envAddress("ADMIN_ADDR");
        address issuer = vm.envAddress("ISSUER_ADDR");
        uint256 pk = vm.envUint("DEPLOYER_PK");

        vm.startBroadcast(pk);
        UtaabCertificate cert = new UtaabCertificate(admin, issuer);
        vm.stopBroadcast();

        console2.log("UtaabCertificate deployed at:", address(cert));
        console2.log("Admin :", admin);
        console2.log("Issuer:", issuer);
    }
}
