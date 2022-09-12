// SPDX-License-Identifier: MIT

/// @title Interface for Main Contract

pragma solidity ^0.8.4;

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

interface IMain {
    struct Member {
        bool pathChosen;
        string name;
        uint256 level;
        bool DAO;
        uint256 tokenId;
    }

    struct Course {
        uint256 courseId;
        uint256 xp;
        string accoladeTitle;
        string badge;
    }

    function getMember(address memberAddress)
        external
        view
        returns (
            bool pathChosen,
            string memory name,
            uint256 level,
            bool DAO,
            uint256 tokenId
        );

    function getCourse(uint256 courseId)
        external
        view
        returns (
            uint256 xp,
            string memory accoladeTitle,
            string memory badge
        );

    function createTokenForMember(address _memberAddress, uint256 _tokenId) external;

    function updateFirstStep(address _memberAddress, bool _firstStepTaken) external;
}
