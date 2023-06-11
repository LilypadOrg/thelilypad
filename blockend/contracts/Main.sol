// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/utils/Counters.sol";
import "./interface/IMain.sol";

contract Main is IMain {
    using Counters for Counters.Counter;
    address owner;

    //mapping(address => bool) public pathChosen;
    mapping(address => Member) public addressToMember;
    mapping(address => uint256) public addressToTokenId;
    mapping(uint256 => address) public tokenIdToAddress;
    mapping(uint256 => Course) public courseIdToCourse;

    //COURSE FUNCTIONS

    //needs to yet consider SVG conversion - this is currently handled on the SBT contract
    function submitCourse(uint256 xp, string memory accoladeTitle, string memory badgeSVG) public {
        uint256 courseId = 1;
        Course memory course = Course({
            courseId: courseId,
            xp: xp,
            accoladeTitle: accoladeTitle,
            badge: badgeSVG
        });

        courseIdToCourse[courseId] = course;
        courseId++;
    }

    function getCourse(
        uint256 id
    ) public view returns (uint256 xp, string memory accoladeTitle, string memory badge) {
        Course memory course = courseIdToCourse[id];
        return (course.xp, course.accoladeTitle, course.badge);
    }

    // MEMBER FUNCTIONS
    function createMember(string memory name) public {
        require(!addressToMember[msg.sender].pathChosen, "Path Already Chosen");

        Member memory member = Member({
            pathChosen: true,
            name: name,
            level: 0,
            DAO: false,
            tokenId: 0
        });
        addressToMember[msg.sender] = member;
    }

    function levelMember() public {
        addressToMember[msg.sender].level = addressToMember[msg.sender].level + 1;
    }

    // ! there should be some checks here !!!!
    function updateFirstStep(address _memberAddress, bool _firstStepTaken) public {
        addressToMember[_memberAddress].pathChosen = _firstStepTaken;
    }

    // ! there should be some checks here !!!!
    function createTokenForMember(address _memberAddress, uint256 _tokenId) public {
        require(addressToMember[_memberAddress].tokenId == 0, "SBT already defined!");
        addressToMember[msg.sender].tokenId = _tokenId;
    }

    // added argument to get memberAddress
    function getMember(
        address memberAddress
    )
        public
        view
        override
        returns (bool pathChosen, string memory name, uint256 level, bool DAO, uint256 tokenId)
    {
        Member memory member = addressToMember[memberAddress];
        return (member.pathChosen, member.name, member.level, member.DAO, member.tokenId);
    }

    // added argument to get memberAddress
    function getMemberByTokenId(
        uint256 _tokenId
    )
        public
        view
        returns (
            address memberAddress,
            bool pathChosen,
            string memory name,
            uint256 level,
            bool DAO,
            uint256 tokenId
        )
    {
        Member memory member = addressToMember[tokenIdToAddress[_tokenId]];
        return (
            tokenIdToAddress[_tokenId],
            member.pathChosen,
            member.name,
            member.level,
            member.DAO,
            member.tokenId
        );
    }

    // Get TokenId from address
    function getTokenId(address member) public view returns (uint256) {
        return addressToMember[member].tokenId;
    }

    //set course properties
    function updateCourse(
        uint256 id,
        uint256 xp,
        string memory accoladeTitle,
        string memory badgeSVG
    ) public {
        Course memory course = courseIdToCourse[id];
        course = Course({courseId: id, xp: xp, accoladeTitle: accoladeTitle, badge: badgeSVG});
        courseIdToCourse[id] = course;
    }

    function updateMember(address _member, string memory name, bool dao, uint256 level) public {
        Member memory member = addressToMember[_member];
        member = Member({
            pathChosen: member.pathChosen,
            name: name,
            level: level,
            DAO: dao,
            tokenId: addressToTokenId[_member]
        });
        addressToMember[_member] = member;
    }
}
