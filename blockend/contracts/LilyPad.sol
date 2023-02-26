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
import {EnumerableSet} from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "base64-sol/base64.sol";

import "./interface/ILilyPad.sol";
import "./interface/IPondSBT.sol";

contract LilyPad is Initializable, OwnableUpgradeable, ILilyPad {
    using StringsUpgradeable for uint256;

    //art Variables
    uint256 maxLevel;

    address public safeCaller;
    IPondSBT public sbtAddress;

    mapping(uint256 => Level) private levels;
    mapping(uint256 => EventType) private eventTypes;

    mapping(address => Member) private addressToMember;
    mapping(address => uint256[]) private memberJourneys;

    mapping(uint256 => Journey) private journeys;
    mapping(uint256 => JourneyNode[]) private journeyNodes;

    mapping(address => uint256) private addressToTokenId;
    mapping(uint256 => address) private tokenIdToAddress;

    //event variables
    mapping(uint256 => Event) private eventIdToEvent;
    mapping(uint256 => mapping(bytes => Accolade)) private eventAccoladeTitleToAccolade;

    /**
     *@notice initialize proxy
     *IN
     *@param _levels: initial level list
     *@param _eventTypes: initial event types list
     *OUT
     */
    function initialize(
        Level[] memory _levels,
        EventType[] memory _eventTypes,
        address _safeCaller
    ) public initializer {
        for (uint256 idx = 0; idx < _levels.length; idx++) {
            levels[_levels[idx].level] = _levels[idx];
            maxLevel = (maxLevel < _levels[idx].level) ? _levels[idx].level : maxLevel;
        }

        for (uint256 idx = 0; idx < _eventTypes.length; idx++) {
            eventTypes[_eventTypes[idx].id] = _eventTypes[idx];
        }
        __Ownable_init();

        safeCaller = _safeCaller;
    }

    function updateSafeCaller(address _newSafeCaller) external onlyOwner {
        safeCaller = _newSafeCaller;
    }

    function setSbtAddress(IPondSBT _newSbtAddress) external onlyOwner {
        sbtAddress = _newSbtAddress;
    }

    //MODIFIERS
    modifier onlyMember() {
        isPathChosen(msg.sender);
        _;
    }

    modifier onlySafeCaller(bytes32 message, bytes memory sig) {
        isSafeCaller(message, sig);
        _;
    }

    function isPathChosen(address _memberAddress) internal view {
        require(addressToMember[_memberAddress].pathChosen, "Path not Chosen");
    }

    function isSafeCaller(bytes32 message, bytes memory sig) internal view {
        require(recoverSigner(message, sig) == safeCaller, "I don't take orders from you");
    }

    function getAccoladesStr(Accolade[] memory _accolades) internal pure returns (string memory) {
        string memory _string;
        for (uint256 idx = 0; idx < _accolades.length; idx++) {
            _string = string(
                abi.encodePacked(
                    _string,
                    _accolades[idx].eventId.toString(),
                    _accolades[idx].title,
                    _accolades[idx].badge
                )
            );
        }

        return _string;
    }

    //LEVEL FUNCTIONS

    /**
     *@notice Create Level
     *IN
     *@param _levels: array with new levels to create. If level already exists, update it
     *OUT
     */
    function createLevel(Level[] calldata _levels) public onlyOwner {
        for (uint256 idx = 0; idx < _levels.length; idx++) {
            if (levels[_levels[idx].level].level == 0) {
                levels[_levels[idx].level] = _levels[idx];
                maxLevel = (maxLevel < _levels[idx].level) ? _levels[idx].level : maxLevel;
            } else {
                levels[_levels[idx].level].xpInit = _levels[idx].xpInit;
                levels[_levels[idx].level].xpFin = _levels[idx].xpFin;
                levels[_levels[idx].level].image = _levels[idx].image;
            }
        }
    }

    /**
     *@notice Get Level by Id
     *IN
     *@param _levelId: Level Id to search for
     *OUT
     */
    function getLevel(uint256 _levelId) public view returns (Level memory) {
        return levels[_levelId];
    }

    //EVENT TYPE FUNCTIONS
    /**
     *@notice Create Event Type
     *IN
     *@param _eventTypes: array with new event types to create. If type already exists, update it
     *OUT
     */
    function createEventType(EventType[] calldata _eventTypes) public onlyOwner {
        for (uint256 idx = 0; idx < _eventTypes.length; idx++) {
            if (eventTypes[_eventTypes[idx].id].id == 0) {
                eventTypes[_eventTypes[idx].id] = _eventTypes[idx];
            } else {
                eventTypes[_eventTypes[idx].id].name = _eventTypes[idx].name;
            }
        }
    }

    /**
     *@notice Get Event Type by Id
     *IN
     *@param _eventTypeId: Event Type Id to search for
     *OUT
     */
    function getEventType(uint256 _eventTypeId) public view returns (EventType memory) {
        return eventTypes[_eventTypeId];
    }

    //COURSE FUNCTIONS

    /**
     *@notice Submite a Course or Event to be featured in the Lilypad Platform
     *IN
     *@param _eventTypeId: event type id
     *@param _eventName: event name byteslike
     *@param _xp: xp given by course completion
     *@param _accolades: list of accolades of the event
     *@param _sig: signatura from safeCaller
     *OUT
     */
    function submitEvent(
        uint256 _eventId,
        uint256 _eventTypeId,
        bytes memory _eventName,
        uint256 _xp,
        Accolade[] memory _accolades,
        bytes memory _sig
    )
        public
        onlySafeCaller(
            prefixed(
                keccak256(
                    abi.encodePacked(
                        _eventId,
                        _eventTypeId,
                        _eventName,
                        _xp,
                        getAccoladesStr(_accolades)
                    )
                )
            ),
            _sig
        )
    {
        require(eventIdToEvent[_eventId].id <= 0, "Event already created");

        eventIdToEvent[_eventId].id = _eventId;
        eventIdToEvent[_eventId].eventTypeId = _eventTypeId;
        eventIdToEvent[_eventId].xp = _xp;
        eventIdToEvent[_eventId].eventName = _eventName;

        for (uint256 idx = 0; idx < _accolades.length; idx++) {
            eventIdToEvent[_eventId].accolades.push(
                Accolade({
                    eventId: _eventId,
                    title: _accolades[idx].title,
                    badge: _accolades[idx].badge
                })
            );
            eventAccoladeTitleToAccolade[_eventId][_accolades[idx].title] = Accolade({
                eventId: _eventId,
                title: _accolades[idx].title,
                badge: _accolades[idx].badge
            });
        }

        emit EventSubmited(msg.sender, _eventId, _eventTypeId, _eventName);
    }

    /**
     *@notice Retrieve event object by its id
     *IN
     *@param _id: event id
     *OUT
     *@return eventTypeId type of event
     *@return xp given by course completion or event participation
     *@return accolades list of accolades of the event
     */
    function getEvent(
        uint256 _id
    ) public view returns (uint256 eventTypeId, uint256 xp, Accolade[] memory accolades) {
        Event memory _event = eventIdToEvent[_id];

        return (_event.eventTypeId, _event.xp, _event.accolades);
    }

    /**
     *@dev The update clear the accolades list and recreate with the accolades passed to the function
     *@notice Update event attributes with given id
     *IN
     *@param _id: event id
     *@param _eventTypeId: event type id
     *@param _xp: xp given by event completion or event participation
     *@param _accolades: list of accolades of event
     *@param _sig: safeCaller signature
     *OUT
     */
    function updateEvent(
        uint256 _id,
        uint256 _eventTypeId,
        bytes memory _eventName,
        uint256 _xp,
        Accolade[] memory _accolades,
        bytes memory _sig
    )
        public
        onlySafeCaller(
            prefixed(
                keccak256(abi.encodePacked(_id, _eventTypeId, _xp, getAccoladesStr(_accolades)))
            ),
            _sig
        )
    {
        eventIdToEvent[_id].xp = _xp;
        eventIdToEvent[_id].eventTypeId = _eventTypeId;
        eventIdToEvent[_id].eventName = _eventName;

        delete eventIdToEvent[_id].accolades;

        for (uint256 idx = 0; idx < _accolades.length; idx++) {
            if (_accolades[idx].eventId != _id) revert("Invalid event id in accolade!");

            eventIdToEvent[_id].accolades.push(
                Accolade({
                    eventId: _accolades[idx].eventId,
                    title: _accolades[idx].title,
                    badge: _accolades[idx].badge
                })
            );

            eventAccoladeTitleToAccolade[_accolades[idx].eventId][
                _accolades[idx].title
            ] = Accolade({
                eventId: _accolades[idx].eventId,
                title: _accolades[idx].title,
                badge: _accolades[idx].badge
            });
        }

        //emit EventUpdated(msg.sender, _id, _eventTypeId, _eventName, _xp, _accolades);
    }

    // MEMBER FUNCTIONS
    /**
     *@notice Return member object associated to given address
     *IN
     *@param _memberAddress: member address
     *OUT
     */
    function getMember(
        address _memberAddress
    )
        public
        view
        override
        returns (
            bool pathChosen,
            uint256 xp,
            uint256 level,
            bool DAO,
            uint256 tokenId,
            uint256[] memory completedEvents,
            Accolade[] memory badges
        )
    {
        return (
            addressToMember[_memberAddress].pathChosen,
            addressToMember[_memberAddress].xp,
            getMemberLevel(_memberAddress),
            addressToMember[_memberAddress].DAO,
            addressToMember[_memberAddress].tokenId,
            addressToMember[_memberAddress].completedEvents,
            addressToMember[_memberAddress].badges
        );
    }

    /**
     *@notice Insert new Member that chosen to follow The Path
     *@dev in the _badges accolade object there is no need to send the badge data. Just eventId and accoladeTitle
     *IN
     *@param _initialXp: member initial xp
     *@param _completedEvents: array of complete events ids
     *@param _badges: array of courses ids with earned badges
     *OUT
     */
    function createMember(
        uint256 _initialXp,
        uint256[] memory _completedEvents,
        Accolade[] memory _badges,
        bytes memory _sig
    )
        public
        onlySafeCaller(
            prefixed(
                keccak256(abi.encodePacked(_initialXp, _completedEvents, getAccoladesStr(_badges)))
            ),
            _sig
        )
    {
        _createMember(msg.sender, _initialXp, _completedEvents, _badges);
    }

    // MEMBER FUNCTIONS
    /**
     *@notice Insert new Member that chosen to follow The Path
     *@dev in the _badges accolade object there is no need to send the badge data. Just eventId and accoladeTitle
     *IN
     *@param _initialXp: member initial xp
     *@param _completedEvents: array of complete events ids
     *@param _badges: array of accolades , byteslike, earned by member
     *OUT
     */
    function _createMember(
        address _memberAddress,
        uint256 _initialXp,
        uint256[] memory _completedEvents,
        Accolade[] memory _badges
    ) internal {
        require(!addressToMember[_memberAddress].pathChosen, "Path Already Chosen");

        addressToMember[_memberAddress].pathChosen = true;
        addressToMember[_memberAddress].xp = _initialXp;
        addressToMember[_memberAddress].DAO = false;
        addressToMember[_memberAddress].tokenId = 0;
        for (uint256 idx = 0; idx < _completedEvents.length; idx++) {
            addressToMember[_memberAddress].completedEvents.push(_completedEvents[idx]);
        }

        for (uint256 idx = 0; idx < _badges.length; idx++) {
            addressToMember[_memberAddress].badges.push(_badges[idx]);
        }

        updateJourney(_memberAddress);
    }

    /**
     *@notice Update all of Member data
     *IN
     *@param _memberAddress: member address
     *@param _dao: dao?
     *@param _xp: xp owned by member
     *@param _completedEvents: array of complete courses ids
     *@param _badges: array of courses ids with earned badges
     *OUT
     */
    function updateMember(
        address _memberAddress,
        bool _dao,
        uint256 _xp,
        uint256[] memory _completedEvents,
        Accolade[] memory _badges,
        bytes memory _sig
    )
        public
        onlySafeCaller(
            prefixed(
                keccak256(
                    abi.encodePacked(
                        _memberAddress,
                        _dao,
                        _xp,
                        _completedEvents,
                        getAccoladesStr(_badges)
                    )
                )
            ),
            _sig
        )
    {
        if (!addressToMember[_memberAddress].pathChosen) {
            _createMember(_memberAddress, _xp, _completedEvents, _badges);
        } else {
            addressToMember[_memberAddress].pathChosen = addressToMember[_memberAddress].pathChosen;
            addressToMember[_memberAddress].xp = _xp;
            addressToMember[_memberAddress].DAO = _dao;
            addressToMember[_memberAddress].tokenId = addressToMember[_memberAddress].tokenId;

            delete addressToMember[_memberAddress].completedEvents;

            for (uint256 idx = 0; idx < _completedEvents.length; idx++) {
                addressToMember[_memberAddress].completedEvents.push(_completedEvents[idx]);
            }

            for (uint256 idx = 0; idx < _completedEvents.length; idx++) {
                if (!completedEvent(_memberAddress, _completedEvents[idx]))
                    _completeEvent(_memberAddress, _completedEvents[idx], false);
            }

            for (uint256 idx = 0; idx < _badges.length; idx++) {
                if (!badgeEarned(_memberAddress, _badges[idx].eventId, _badges[idx].title)) {
                    _awardBadge(_memberAddress, _badges[idx], false);
                }
            }

            updateJourney(_memberAddress);
        }
    }

    /**
     *@notice Update member XP. Require member created for given address
     *IN
     *@param _member: member address
     *@param _currentXp: member current xp
     *OUT
     */
    function levelMember(
        address _member,
        uint256 _currentXp,
        bytes memory _sig
    ) public onlySafeCaller(prefixed(keccak256(abi.encodePacked(_member, _currentXp))), _sig) {
        require(addressToMember[_member].pathChosen, "Path not chosen!");

        addressToMember[msg.sender].xp = _currentXp;
    }

    /**
     *@notice update Member event completion
     *IN
     *@param _member: member address
     *@param _eventId: id of completed event
     *OUT
     */
    function completeEvent(
        address _member,
        uint256 _eventId,
        bytes memory _sig
    ) public onlySafeCaller(prefixed(keccak256(abi.encodePacked(_member, _eventId))), _sig) {
        //TODO: make it batch prepared
        require(addressToMember[_member].pathChosen, "Path not chosen!");
        if (!completedEvent(_member, _eventId)) _completeEvent(_member, _eventId, true);

        //for (uint256 idx = 0; idx < _eventsId.length; idx++) {
        //    if (!completedEvent(_member, _eventsId[idx]))
        //        _completeEvent(_member, _eventsId[idx], false);
        //}

        //update journeys
        //updateJourney(_member);
    }

    /**
     *@notice update Member event completion
     *@dev this function dont check if course was already completed, since it is checked on the public function. Be aware!
     *@dev _update journey variable serves for batch update when we dont want to update journey every single course completion
     *IN
     *@param _member: member address
     *@param _eventId: id of event
     *OUT
     */
    function _completeEvent(address _member, uint256 _eventId, bool _updateJourney) internal {
        //check member current level
        uint256 currentLevel = getMemberLevel(_member);
        addressToMember[_member].completedEvents.push(_eventId);
        addressToMember[_member].xp += eventIdToEvent[_eventId].xp;
        //update journeys
        if (_updateJourney) updateJourney(_member);

        emit EventCompleted(
            _member,
            _eventId,
            string(abi.encodePacked(eventIdToEvent[_eventId].eventName))
        );
        //check member new level
        uint256 newLevel = getMemberLevel(_member);

        if (newLevel > currentLevel)
            emit LevelReached(_member, addressToMember[_member].xp, newLevel);
    }

    /**
     *@notice Award badge to member for course completion or event participation.
     *@dev in the _badges accolade object there is no need to send the badge image data. Just eventId and accoladeTitle
     *IN
     *@param _member: member address
     *@param _badges: id of event
     *OUT
     */
    function awardBadge(
        address _member,
        Accolade[] memory _badges,
        bytes memory _sig
    )
        public
        onlySafeCaller(
            prefixed(keccak256(abi.encodePacked(_member, getAccoladesStr(_badges)))),
            _sig
        )
    {
        for (uint256 idx = 0; idx < _badges.length; idx++) {
            if (!badgeEarned(_member, _badges[idx].eventId, _badges[idx].title))
                _awardBadge(_member, _badges[idx], true);
        }
    }

    /**
     *@notice Award badge to member for course completion or event participation.
     *@dev this function dont check if badge was already earned, since it is checked on the public function. Be aware!
     *@dev _update journey variable serves for batch update when we dont want to update journey every single badge award
     *IN
     *@param _member: member address
     *@param _accolade: accolade object
     *OUT
     */
    function _awardBadge(address _member, Accolade memory _accolade, bool _updateJourney) internal {
        addressToMember[_member].badges.push(
            Accolade({
                eventId: _accolade.eventId,
                title: _accolade.title,
                //get the current badge art for immutability purpose
                badge: eventAccoladeTitleToAccolade[_accolade.eventId][_accolade.title].badge
            })
        );

        //update journeys
        if (_updateJourney) updateJourney(_member);

        emit BadgeEarned(
            _member,
            _accolade.eventId,
            _accolade.title,
            string(abi.encodePacked(_accolade.title))
        );
    }

    /**
     *@notice Check if course was completed
     *IN
     *@param _member: member address
     *@param _eventId: id of event
     *OUT
     *@return bool: if event was already completed
     */
    function completedEvent(address _member, uint256 _eventId) public view returns (bool) {
        for (uint256 idx = 0; idx < addressToMember[_member].completedEvents.length; idx++) {
            if (addressToMember[_member].completedEvents[idx] == _eventId) return true;
        }

        return false;
    }

    /**
     *@notice Check if badge was already earned
     *IN
     *@param _member: member address
     *@param _eventId: id of event
     *OUT
     *@return bool: if badge was already completed
     */
    function badgeEarned(
        address _member,
        uint256 _eventId,
        bytes memory _accoladeTitle
    ) public view returns (bool) {
        for (uint256 idx = 0; idx < addressToMember[_member].badges.length; idx++) {
            if (
                addressToMember[_member].badges[idx].eventId == _eventId &&
                keccak256(addressToMember[_member].badges[idx].title) == keccak256(_accoladeTitle)
            ) return true;
        }

        return false;
    }

    /**
     *@notice Check if all badges of event were already earned
     *IN
     *@param _member: member address
     *@param _eventId: id of event
     *OUT
     *@return bool: if all badges were already earned
     */
    function allBadgesEarned(address _member, uint256 _eventId) internal view returns (bool) {
        Accolade[] memory _accolades = eventIdToEvent[_eventId].accolades;

        for (uint256 idx = 0; idx < _accolades.length; idx++) {
            if (!badgeEarned(_member, _eventId, _accolades[idx].title)) return false;
        }
        return true;
    }

    /**
     *@notice Mint SBT
     *IN
     *@param _memberAddress: member address
     *OUT
     */
    function mintTokenForMember(address _memberAddress) public payable {
        require(addressToMember[_memberAddress].tokenId == 0, "SBT already defined!");

        try sbtAddress.takeFirstSteps{value: msg.value}(_memberAddress) returns (uint256 tokenId) {
            addressToMember[_memberAddress].tokenId = tokenId;
            tokenIdToAddress[tokenId] = _memberAddress;
        } catch Error(string memory err) {
            revert(err);
        }
    }

    /**
     *@notice Return member object associated to given SBT tokenId
     *IN
     *@param _tokenId: tokenId to look up
     *OUT
     *memberAddress: address of the member
     *pathChosen: if member chosed the path
     *name: name of the member
     *level: level of member
     *DAO: if member participate in DAO
     *tokenId: tokenId owned by the member
     *completedEvents: array of completed events by the member
     *badges: array of badges earned by the member
     */
    function getMemberByTokenId(
        uint256 _tokenId
    )
        public
        view
        returns (
            address memberAddress,
            bool pathChosen,
            uint256 xp,
            uint256 level,
            bool DAO,
            uint256 tokenId,
            uint256[] memory completedEvents,
            Accolade[] memory badges
        )
    {
        Member memory _member = addressToMember[tokenIdToAddress[_tokenId]];
        return (
            tokenIdToAddress[_tokenId],
            _member.pathChosen,
            _member.xp,
            getMemberLevel(tokenIdToAddress[_tokenId]),
            _member.DAO,
            _member.tokenId,
            _member.completedEvents,
            _member.badges
        );
    }

    /**
     *@notice Return SBT tokenId owned by member associated to given address
     *IN
     *@param _memberAddress: tokenId owned by member associated to given address
     *OUT
     *@return uint256: tokenId found (0 equals no token)
     */
    function getTokenId(address _memberAddress) public view returns (uint256) {
        return addressToMember[_memberAddress].tokenId;
    }

    /**
     *@notice Get current Member Level
     *IN
     *@param _memberAddress: tokenId owned by member associated to given address
     *OUT
     *@return uint256: member level
     */
    function getMemberLevel(address _memberAddress) public view returns (uint256) {
        for (uint256 idx = 1; idx <= maxLevel; idx++) {
            if (
                addressToMember[_memberAddress].xp >= levels[idx].xpInit &&
                addressToMember[_memberAddress].xp <= levels[idx].xpFin
            ) {
                return levels[idx].level;
            }
        }
        return 0;
    }

    //JOURNEY FUNCTIONS
    function createJourney(
        uint256 _journeyId,
        bytes memory _name,
        bool _badgeObligatory,
        uint256[] memory _eventId
    ) external onlyMember returns (Journey memory) {
        (bool _journeyExists, Journey memory _journeyFound) = journeyExists(msg.sender, _eventId);

        if (_journeyExists) return _journeyFound;
        else {
            journeys[_journeyId] = Journey({
                id: _journeyId,
                member: msg.sender,
                name: _name,
                done: false,
                badgeObligatory: _badgeObligatory
            });

            for (uint256 nodeIdx = 0; nodeIdx < _eventId.length; nodeIdx++) {
                bool journeyStepCompleted;
                if (journeys[_journeyId].badgeObligatory)
                    journeyStepCompleted = allBadgesEarned(msg.sender, _eventId[nodeIdx]);
                else journeyStepCompleted = completedEvent(msg.sender, _eventId[nodeIdx]);

                journeyNodes[_journeyId].push(
                    JourneyNode({
                        step: nodeIdx + 1,
                        eventId: _eventId[nodeIdx],
                        done: completedEvent(msg.sender, _eventId[nodeIdx])
                    })
                );
            }

            journeys[_journeyId].done = journeyCompleted(_journeyId);

            return journeys[_journeyId];
        }
    }

    function updateJourney(
        uint256 _journeyId,
        bytes memory _name,
        bool _badgeObligatory,
        uint256[] memory _eventsId
    ) external onlyMember returns (Journey memory) {
        require(journeys[_journeyId].member != address(0), "Journey not found");
        require(journeys[_journeyId].member == msg.sender, "Journey not found");

        delete journeyNodes[_journeyId];

        journeys[_journeyId].name = _name;
        journeys[_journeyId].badgeObligatory = _badgeObligatory;

        for (uint256 nodeIdx = 0; nodeIdx < _eventsId.length; nodeIdx++) {
            bool journeyStepCompleted;
            if (journeys[_journeyId].badgeObligatory)
                journeyStepCompleted = allBadgesEarned(msg.sender, _eventsId[nodeIdx]);
            else journeyStepCompleted = completedEvent(msg.sender, _eventsId[nodeIdx]);

            journeyNodes[_journeyId].push(
                JourneyNode({
                    step: nodeIdx + 1,
                    eventId: _eventsId[nodeIdx],
                    done: journeyStepCompleted
                })
            );
        }

        journeys[_journeyId].done = journeyCompleted(_journeyId);

        return journeys[_journeyId];
    }

    function abandonJourney(uint256 _journeyId) public onlyMember returns (Journey memory) {
        require(journeys[_journeyId].member != address(0), "Journey not found");
        require(journeys[_journeyId].member == msg.sender, "Journey not found");

        delete journeyNodes[_journeyId];

        journeys[_journeyId].done = true;

        return journeys[_journeyId];
    }

    function journeyExists(
        address _memberAddress,
        uint256[] memory _eventsId
    ) private view returns (bool exists, Journey memory journey) {
        Journey memory _journey;
        for (
            uint256 journeyIdx = 0;
            journeyIdx < memberJourneys[_memberAddress].length;
            journeyIdx++
        ) {
            bool _same = true;
            uint256 journeyId = memberJourneys[_memberAddress][journeyIdx];
            for (uint256 nodeIdx = 0; nodeIdx < journeyNodes[journeyId].length; nodeIdx++) {
                if (_eventsId[nodeIdx] != journeyNodes[journeyId][nodeIdx].eventId) {
                    _same = false;
                    continue;
                }
                _journey = journeys[journeyId];
            }
            if (_same) {
                return (true, _journey);
            }
        }

        return (false, _journey);
    }

    function journeyCompleted(uint256 _journeyId) private view returns (bool) {
        for (uint256 nodeIdx = 0; nodeIdx < journeyNodes[_journeyId].length; nodeIdx++) {
            if (!journeyNodes[_journeyId][nodeIdx].done) return false;
        }

        return true;
    }

    function updateJourney(address _memberAddress) internal {
        for (
            uint256 journeyIdx = 0;
            journeyIdx < memberJourneys[_memberAddress].length;
            journeyIdx++
        ) {
            uint256 journeyId = memberJourneys[_memberAddress][journeyIdx];

            if (journeys[journeyId].done) continue;

            bool havePendingSteps;

            for (uint256 nodeIdx = 0; nodeIdx < journeyNodes[journeyId].length; nodeIdx++) {
                if (!journeyNodes[journeyId][nodeIdx].done)
                    if (journeys[journeyId].badgeObligatory)
                        journeyNodes[journeyId][nodeIdx].done = allBadgesEarned(
                            _memberAddress,
                            journeyNodes[journeyId][nodeIdx].eventId
                        );
                    else
                        journeyNodes[journeyId][nodeIdx].done = completedEvent(
                            _memberAddress,
                            journeyNodes[journeyId][nodeIdx].eventId
                        );

                if (!journeyNodes[journeyId][nodeIdx].done) havePendingSteps = true;
            }

            if (!havePendingSteps) journeys[journeyId].done = true;
        }
    }

    /**
     *@notice Burn member records. Only SBT contract can call it after execute the token burn
     *IN
     *@param member: address of member to burn
     *OUT
     */
    function burnBabyBurn(address member) external override {
        require(
            msg.sender == address(sbtAddress),
            "LilyPad::Only SBT Contract can call menbership burn"
        );

        addressToMember[member].pathChosen = false;
        addressToMember[member].xp = 0;
        addressToMember[member].tokenId = 0;

        delete addressToMember[member].completedEvents;
        delete addressToMember[member].badges;

        emit MemberBurned(member);
    }

    function constructTokenUri(
        uint256 _tokenId,
        string memory _baseUri
    ) external view override returns (string memory) {
        (
            address _memberAddress,
            ,
            ,
            ,
            ,
            ,
            uint256[] memory _completedEvents,
            Accolade[] memory _badges
        ) = getMemberByTokenId(_tokenId);
        require(_tokenId > 0, "Invalid Member/Token data");

        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name":"PondSBT ',
                                _tokenId.toString(),
                                '", "description":"Part of the Soul of ',
                                StringsUpgradeable.toHexString(uint160(_memberAddress), 20),
                                '","image": "',
                                string(
                                    abi.encodePacked(
                                        _baseUri,
                                        levels[getMemberLevel(_memberAddress)].image
                                    )
                                ),
                                '",',
                                buildAttributes(getMemberLevel(_memberAddress), _completedEvents),
                                ",",
                                buildBadges(_badges, _baseUri),
                                "}"
                            )
                        )
                    )
                )
            );
    }

    function buildAttributes(
        uint256 _level,
        uint256[] memory _completedEvents
    ) internal view returns (string memory) {
        string memory _attributes = '"attributes": [';
        _attributes = string(
            abi.encodePacked(
                _attributes,
                '{ "trait_type":"Level", "value": ',
                _level.toString(),
                "}"
            )
        );
        for (uint256 idx = 0; idx < _completedEvents.length; idx++) {
            _attributes = string(abi.encodePacked(_attributes, ',{ "trait_type":"'));

            _attributes = string(
                abi.encodePacked(
                    _attributes,
                    eventTypes[eventIdToEvent[_completedEvents[idx]].eventTypeId].name
                )
            );

            _attributes = string(abi.encodePacked(_attributes, '", "value": "'));
            _attributes = string(
                abi.encodePacked(_attributes, eventIdToEvent[_completedEvents[idx]].eventName)
            );
            _attributes = string(abi.encodePacked(_attributes, '"}'));
        }

        _attributes = string(abi.encodePacked(_attributes, "]"));

        return _attributes;
    }

    function buildBadges(
        Accolade[] memory _badges,
        string memory _baseUri
    ) internal pure returns (string memory) {
        string memory _badgesUri = '"badges": [';
        for (uint256 idx = 0; idx < _badges.length; idx++) {
            if (idx > 0) _badgesUri = string(abi.encodePacked(_badgesUri, ',{ "trait_type":"'));
            else _badgesUri = string(abi.encodePacked(_badgesUri, '{ "trait_type":"BADGE"'));

            _badgesUri = string(abi.encodePacked(_badgesUri, ', "value": "'));
            _badgesUri = string(abi.encodePacked(_badgesUri, _badges[idx].title));
            _badgesUri = string(abi.encodePacked(_badgesUri, '", "image": "'));
            _badgesUri = string(abi.encodePacked(_badgesUri, _baseUri, _badges[idx].badge));

            _badgesUri = string(abi.encodePacked(_badgesUri, '"}'));
        }

        _badgesUri = string(abi.encodePacked(_badgesUri, "]"));

        return _badgesUri;
    }

    //SECURITY FUNCTIONS

    // Builds a prefixed hash to mimic the behavior of eth_sign.
    function prefixed(bytes32 _hash) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", _hash));
    }

    function splitSignature(bytes memory _sig) internal pure returns (uint8, bytes32, bytes32) {
        require(_sig.length == 65);

        bytes32 r;
        bytes32 s;
        uint8 v;

        assembly {
            // first 32 bytes, after the length prefix
            r := mload(add(_sig, 32))
            // second 32 bytes
            s := mload(add(_sig, 64))
            // final byte (first byte of the next 32 bytes)
            v := byte(0, mload(add(_sig, 96)))
        }

        return (v, r, s);
    }

    function recoverSigner(bytes32 _message, bytes memory _sig) internal pure returns (address) {
        uint8 v;
        bytes32 r;
        bytes32 s;

        (v, r, s) = splitSignature(_sig);

        return ecrecover(_message, v, r, s);
    }
}
