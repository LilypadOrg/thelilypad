// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./Main.sol";

contract MainV2 is Main, Initializable {
    uint256 public newVariable;

    function intializeNewVariable(uint256 _newVariable) public initializer {
        newVariable = _newVariable;
    }
}
