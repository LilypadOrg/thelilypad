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

import "./IPondSBT.sol";

interface ILilyPad {
    event EventSubmited(address owner, uint256 eventId, uint256 eventTypeId, bytes eventName);

    event EventCompleted(address member, uint256 eventId, string eventName);
    event BadgeEarned(address member, uint256 eventId, bytes badgeIdentifier, string badgeName);

    struct Level {
        uint256 level;
        uint256 xpInit;
        uint256 xpFin;
        bytes image;
    }

    struct Member {
        bool pathChosen;
        uint256 xp;
        bool DAO;
        uint256 tokenId;
        uint256[] completedEvents;
        Accolade[] badges;
    }

    struct EventType {
        uint256 id;
        bytes name;
    }

    struct Accolade {
        uint256 eventId;
        bytes title;
        bytes badge;
    }

    struct Event {
        uint256 id;
        uint256 eventTypeId;
        bytes eventName;
        uint256 xp;
        Accolade[] accolades;
    }

    struct Journey {
        uint256 id;
        address member;
        bytes name;
        bool done;
        bool badgeObligatory;
    }

    struct JourneyNode {
        uint256 step;
        uint256 eventId;
        bool done;
    }

    function getMember(address memberAddress)
        external
        view
        returns (
            bool pathChosen,
            uint256 xp,
            uint256 level,
            bool DAO,
            uint256 tokenId,
            uint256[] memory completedEvents,
            Accolade[] memory badges
        );

    function getEvent(uint256 eventId)
        external
        view
        returns (
            uint256 eventTypeId,
            uint256 xp,
            Accolade[] memory accolades
        );

    function mintTokenForMember(address _memberAddress, IPondSBT _sbtAddress) external payable;

    function updateFirstStep(
        address _memberAddress,
        bool _firstStepTaken,
        bytes memory _sig
    ) external;

    function constructTokenUri(uint256 _tokenId, string memory _baseUri)
        external
        view
        returns (string memory);
}
