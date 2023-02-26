// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

/// @title The Lilypad SBT

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

import {ERC721sbUpgradeable} from "./Soulbound-upgradeable/ERC721sbUpgradeable.sol";
import {ERC721sbURIStorageUpgradeable} from "./Soulbound-upgradeable/ERC721sbURIStorageUpgradeable.sol";

import {ERC721sbEnumerableUpgradeable} from "./Soulbound-upgradeable/ERC721sbEnumerableUpgradeable.sol";
import {ERC721sbVotesUpgradeable} from "./Soulbound-upgradeable/extensions/ERC721sbVotesUpgradeable.sol";
import {ILilyPad} from "./interface/ILilyPad.sol";
import {IPondSBT} from "./interface/IPondSBT.sol";
import {ILilyPadTreasure} from "./interface/ILilyPadTreasure.sol";
import {ERC721sbBurnableUpgradeable} from "./Soulbound-upgradeable/extensions/ERC721sbBurnableUpgradeable.sol";

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/draft-EIP712Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";
import {AddressUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "base64-sol/base64.sol";

error PondSBT__NotEnoughEth();

contract PondSBT is
    Initializable,
    ERC721sbUpgradeable,
    ERC721sbEnumerableUpgradeable,
    ERC721sbBurnableUpgradeable,
    OwnableUpgradeable,
    EIP712Upgradeable,
    ERC721sbVotesUpgradeable,
    IPondSBT
{
    using CountersUpgradeable for CountersUpgradeable.Counter;
    using StringsUpgradeable for uint256;

    CountersUpgradeable.Counter private _tokenIdCounter;

    ILilyPad public mainContract;
    ILilyPadTreasure public lilyPadTreasure;

    //NFT Variables
    uint256 public i_mintFee;
    uint256 public devPerc;

    //modifiers
    modifier onlyMinter() {
        require(msg.sender == address(mainContract), "Not Minter");
        _;
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        uint256 mintFee,
        uint256 _devPerc,
        ILilyPad mainContractAddress
    ) public initializer {
        _setMintFee(mintFee);
        devPerc = _devPerc;
        mainContract = mainContractAddress;
        __ERC721sb_init("Path of New Developers", "POND");
        __ERC721sbEnumerable_init();
        __Ownable_init();
        __EIP712_init("POND", "1");
        __ERC721sbVotes_init();
    }

    /*
     * @dev set new mint fee
     */
    function setMintFee(uint256 newMintFee) external onlyOwner {
        _setMintFee(newMintFee);
    }

    function setTreasureAddress(ILilyPadTreasure _lilyPadTreasure) external onlyOwner {
        lilyPadTreasure = _lilyPadTreasure;
    }

    function takeFirstSteps(address _member) public payable onlyMinter returns (uint256) {
        require(balanceOf(_member) == 0, "Steps already taken (token minted)");
        if (msg.value < i_mintFee) {
            revert PondSBT__NotEnoughEth();
        }
        //delegates vote to itself
        if (delegates(_member) == address(0)) _delegate(_member, _member);

        _tokenIdCounter.increment();

        uint256 tokenId = _tokenIdCounter.current();

        _mint(_member, tokenId);

        emit SoulBounded(_member, tokenId);
        uint256 _devsAmount;

        if (devPerc > 0) {
            _devsAmount = (msg.value / 100) * devPerc;

            AddressUpgradeable.sendValue(payable(owner()), _devsAmount);
        }
        //send rest to treasure
        AddressUpgradeable.sendValue(payable(address(lilyPadTreasure)), msg.value - _devsAmount);

        return _tokenIdCounter.current();
    }

    function safeMint(address to) public onlyMinter {
        _tokenIdCounter.increment();
        _safeMint(to, _tokenIdCounter.current());
    }

    function burn(uint256 tokenId) public virtual override(ERC721sbBurnableUpgradeable) {
        super.burn(tokenId);
        //updates membership data
        mainContract.burnBabyBurn(msg.sender);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721sbUpgradeable) returns (string memory) {
        return mainContract.constructTokenUri(tokenId, _baseURI());
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721sbUpgradeable, ERC721sbEnumerableUpgradeable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    /*
     * @dev set new mint fee
     */
    function _setMintFee(uint256 newMintFee) private {
        emit MintFeeUpdated(i_mintFee, newMintFee);

        i_mintFee = newMintFee;
    }

    // The following functions are overrides required by Solidity.
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721sbUpgradeable, ERC721sbEnumerableUpgradeable) {
        //delegates vote to itself
        if (delegates(to) == address(0) && to != address(0)) _delegate(to, to);

        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721sbUpgradeable, ERC721sbVotesUpgradeable) {
        super._afterTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721sbUpgradeable) {
        //revert("One does not simply burns parts of your soul!");
        super._burn(tokenId);
    }

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://";
    }
}
