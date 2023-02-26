// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

/// @title The LilyPad Backbone

/**********************************************************************
 * ░░░░██████████████████ ██████████████████ ██████████████████ ░░░░░ *
 * ░░░░███ ██████████ ███ ██████████████████ ███ ██████████ ███ ░░░░░ *
 * ░░░░███ ██      ██ ███ ██████████████████ ███ ██      ██ ███ ░░░░░ *
 * ░░░░███ ██      ██ ███ ██████████████████ ███ ██      ██ ███ ░░░░░ *
 * ░░░░███ ██████████ ███ ██████████████████ ███ ██████████ ███ ░░░░░ *
 * ░░░░██████████████████ ██████████████████ ██████████████████ ░░░░░ *
 * ░░░░░████████████████████  ██████████  ███████████████████░░░░░░░░ *
 * ░░░░░████████████████████  ██████████  ███████████████████░░░░░░░░ *
 * ░░░███████████████████████████████████████████████████████████░░░░ *
 * ░░█████████████   █████████████████████████████████████████████░░░ *
 * ░███████████████   █████████████████████████████████████████████░░ *
 * ░░███████████████                              ████████████████░░░ *
 * ░░░███████████████████████████████████████████████████████████░░░░ *
 **********************************************************************/

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";
import {ReentrancyGuardUpgradeable} from "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import {EnumerableSet} from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import {AddressUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "base64-sol/base64.sol";

import "./interface/ILilyPadTreasure.sol";

contract LilyPadTreasure is
    ILilyPadTreasure,
    Initializable,
    ReentrancyGuardUpgradeable,
    OwnableUpgradeable,
    PausableUpgradeable
{
    uint256 private nextWithdraw;
    uint256 private daoBalance;
    address public dao;

    modifier onlyDao() {
        isDao();
        _;
    }

    function isDao() internal view {
        require(msg.sender == dao, "Not DAO");
    }

    function initialize(address _dao) public initializer {
        __ReentrancyGuard_init();
        __Ownable_init();
        __Pausable_init();

        dao = _dao;

        //_registerInterface(type(IRoyalTower).interfaceId);
        nextWithdraw = 1;
    }

    /**
     * @notice DAO Treasure Balance.
     */
    function daoTreasure() external view returns (uint256) {
        return daoBalance;
    }

    // fallback function
    fallback() external payable {
        _depositToDAOTreasure(msg.sender, 0, msg.value);
    }

    // receive function
    receive() external payable {
        _depositToDAOTreasure(msg.sender, 0, msg.value);
    }

    /**
     * @notice receive ETH to enrich DAO treasure.
     */
    function depositToDAOTreasure(uint256 _queeneAuctionId) external payable nonReentrant {
        _depositToDAOTreasure(msg.sender, _queeneAuctionId, msg.value);
    }

    /**
     * @notice receive ETH to enrich palace treasure.
     */
    function _depositToDAOTreasure(address _sender, uint256 _tokenId, uint256 amount) private {
        require(amount > 0, "invalid amount");

        daoBalance += amount;

        emit DAOTreasureDeposit(_sender, _tokenId, amount);
    }

    /**
     * @notice withdraw balance for Propose fund.
     */
    function withdrawFromTreasure(
        uint256 _amount,
        address payable _funded
    ) external nonReentrant whenNotPaused onlyDao {
        _withdrawFromTreasure(_funded, _amount);
    }

    /**
     * @notice withdraw balance for Palace Maintenance.
     */
    function _withdrawFromTreasure(address payable to, uint256 _amount) private {
        require(_amount <= daoBalance, "Not enough balance on treasure!");

        AddressUpgradeable.sendValue(to, _amount);

        daoBalance -= _amount;

        emit DAOTreasureWithdraw(to, nextWithdraw++, _amount);
    }
}
