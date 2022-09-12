// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "contracts/Soulbound/ERC721URIStorageSoulbound.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "base64-sol/base64.sol";
import "./Main.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/draft-ERC721VotesUpgradeable.sol";

error PondSBT__NotEnoughEth();

contract PondSBTV0 is ERC721URIStorageSoulbound {
    using Counters for Counters.Counter;
    address owner;

    address public mainContract;
    //Member public member;

    //NFT Variables
    uint256 internal i_mintFee;
    string[] internal i_tokenImageSVGs;
    string[] levelImageUris;
    Counters.Counter private _tokenIds;
    string private constant base64EncodedSvgPrefix = "data:image/svg+xml;base64,";

    constructor(
        uint256 mintFee,
        string[] memory tokenImageSVGs,
        address mainContractAddress
    ) ERC721Soulbound("Path of New Developers", "POND") {
        i_mintFee = mintFee;
        i_tokenImageSVGs = svgToImageURI(tokenImageSVGs);
        mainContract = address(mainContractAddress);

        //i_tokenImageSVGs = tokenImageSVGs;

        //test member

        // member.firstStep = true;
        // member.level = 0;
        // member.name = "Equious";
        // member.DAO = false;
    }

    function takeFirstSteps() public payable returns (uint256) {
        (bool firstStep, , , , ) = Main(mainContract).getMember(msg.sender);
        require(firstStep == false, "Steps already taken (token minted)");
        if (msg.value < i_mintFee) {
            revert PondSBT__NotEnoughEth();
        }
        uint256 newTokenId = _tokenIds.current();
        _mint(msg.sender, newTokenId);

        Main(mainContract).createTokenForMember(msg.sender, newTokenId);

        string memory sbtTokenURI = tokenURI(_tokenIds.current());
        _setTokenURI(newTokenId, sbtTokenURI);
        _tokenIds.increment();

        Main(mainContract).updateFirstStep(msg.sender, true);

        return newTokenId;
    }

    //What happens if someone burns a token, then wants a new one?

    // function claimSBT(string memory sbtTokenURI) internal returns (uint256) {
    //     _tokenIds.increment();

    //     return newTokenId;
    // }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "URI Query for nonexistent Token Id");

        // GetMember level from mainContract
        (, , uint256 level, , ) = Main(mainContract).getMember(msg.sender);
        string memory IMAGEURI = levelImageUris[level];

        return
            string(
                abi.encodePacked(
                    _baseURI(),
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name:"',
                                name(),
                                '", "description":"Your Path",',
                                '"attributes": [{"trait_type": "Level", "value": 0}], "image":"',
                                IMAGEURI,
                                '"}'
                            )
                        )
                    )
                )
            );
    }

    function _baseURI() internal pure override returns (string memory) {
        return "data:application/json;base64,";
    }

    function svgToImageURI(string[] memory svgs) public returns (string[] memory) {
        for (uint256 i = 0; i < svgs.length; i++) {
            string memory svgBase64Encoded = Base64.encode(bytes(abi.encodePacked(svgs[i])));
            string memory currentLevel = string(
                abi.encodePacked(base64EncodedSvgPrefix, svgBase64Encoded)
            );
            levelImageUris.push(currentLevel);
        }
        return levelImageUris;
    }
}
