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

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/draft-EIP712Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "base64-sol/base64.sol";
import "./interface/IPondSBT.sol";

error PondSBT__NotEnoughEth();

contract PondSBT is
    Initializable,
    ERC721sbUpgradeable,
    ERC721sbEnumerableUpgradeable,
    OwnableUpgradeable,
    EIP712Upgradeable,
    ERC721sbVotesUpgradeable,
    IPondSBT
{
    using CountersUpgradeable for CountersUpgradeable.Counter;

    CountersUpgradeable.Counter private _tokenIdCounter;

    ILilyPad public mainContract;

    //NFT Variables
    uint256 internal i_mintFee;

    //modifiers
    modifier onlyMinter() {
        require(msg.sender == address(mainContract), "Not Minter");
        _;
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(uint256 mintFee, ILilyPad mainContractAddress) public initializer {
        i_mintFee = mintFee;
        mainContract = mainContractAddress;

        __ERC721sb_init("Path of New Developers", "POND");
        __ERC721sbEnumerable_init();
        __Ownable_init();
        __EIP712_init("POND", "1");
        __ERC721sbVotes_init();
    }

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://";
    }

    function takeFirstSteps(address _member) public payable onlyMinter returns (uint256) {
        require(balanceOf(_member) == 0, "Steps already taken (token minted)");
        if (msg.value < i_mintFee) {
            revert PondSBT__NotEnoughEth();
        }
        //delegates vote to itself
        if (delegates(_member) == address(0)) _delegate(_member, _member);

        _tokenIdCounter.increment();

        _mint(_member, _tokenIdCounter.current());

        emit SoulBounded(_member, _tokenIdCounter.current());

        return _tokenIdCounter.current();
    }

    function safeMint(address to) public onlyMinter {
        _tokenIdCounter.increment();
        _safeMint(to, _tokenIdCounter.current());
    }

    // The following functions are overrides required by Solidity.
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721sbUpgradeable, ERC721sbEnumerableUpgradeable) {
        //delegates vote to itself
        if (delegates(to) == address(0)) _delegate(to, to);

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
        revert("One does not simply burns parts of your soul!");
        //super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721sbUpgradeable)
        returns (string memory)
    {
        return mainContract.constructTokenUri(tokenId, _baseURI());
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721sbUpgradeable, ERC721sbEnumerableUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
