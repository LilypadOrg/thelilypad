// SPDX-License-Identifier: MIT

/// @title Interface for QueenE NFT Token

pragma solidity ^0.8.4;

interface ILilyPadTreasure {
    event DAOTreasureDeposit(address indexed sender, uint256 tokenId, uint256 value);

    event DAOTreasureWithdraw(address indexed payed, uint256 withdrawId, uint256 value);

    function depositToDAOTreasure(uint256 _tokenId) external payable;
}
