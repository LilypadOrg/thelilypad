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
    error TechNotFound(uint256 techId);
    error NotAFrog(address _address);

    event EventSubmited(address owner, uint256 eventId, uint256 eventTypeId, bytes eventName);

    event EventCompleted(address member, uint256 eventId, string eventName);
    event BadgeEarned(address member, uint256 eventId, uint256 techId, uint256 level);
    event BadgesEarned(address member, uint256[] eventId, uint256 techId, uint256 level);

    event LevelReached(address member, uint256 currentXp, uint256 level);

    event MemberBurned(address member);

    struct Level {
        uint256 level;
        uint256 xpInit;
        uint256 xpFin;
        bytes image;
    }

    struct TechBadge {
        uint256 techId;
        uint256 level;
        bytes badge;
    }

    struct EventBadge {
        uint256 eventId;
        bytes badge;
    }

    struct Technology {
        uint256 techId;
        bytes techName;
    }

    struct Accolade {
        uint256 eventId;
        uint256 techId;
        uint256 level;
        bytes badge;
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

    struct Event {
        uint256 id;
        uint256 eventTypeId;
        bytes eventName;
        uint256 level;
        uint256 xp;
        uint256[] technologies;
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

    function getMember(
        address memberAddress
    )
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

    function getEvent(
        uint256 eventId
    ) external view returns (uint256 eventTypeId, uint256 xp, Technology[] memory eventTechs);

    function completedEvent(address _member, uint256 _eventId) external view returns (bool);

    function badgeEarned(
        address _member,
        uint256 _eventId,
        uint256 _techId,
        uint256 _level
    ) external view returns (bool);

    function constructTokenUri(
        uint256 _tokenId,
        string memory _baseUri
    ) external view returns (string memory);

    function burnBabeBurn(address member) external;
}
