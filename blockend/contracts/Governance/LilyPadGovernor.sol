// SPDX-License-Identifier: MIT
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

import "@openzeppelin/contracts-upgradeable/governance/GovernorUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorSettingsUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/governance/compatibility/GovernorCompatibilityBravoUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorVotesUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorVotesQuorumFractionUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorTimelockControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "../interface/IMain.sol";
import "../interface/ILilyPad.sol";

contract LilyPadGovernor is
    Initializable,
    GovernorUpgradeable,
    GovernorSettingsUpgradeable,
    GovernorCompatibilityBravoUpgradeable,
    GovernorVotesUpgradeable,
    GovernorVotesQuorumFractionUpgradeable,
    GovernorTimelockControlUpgradeable
{
    event ProposalVetoed(uint256 id);
    event ResignedPower(address vetoer);

    ILilyPad public mainContract;
    address public vetoer;

    uint256 public levelThreshold;

    bool public powerless;

    modifier onlyWorthy() {
        isWorthy(msg.sender);
        _;
    }

    function isWorthy(address member) internal view {
        (, , uint256 level, bool isDAO, , , ) = mainContract.getMember(member);

        require(level >= levelThreshold, "Get your Level Higher! Contribute More!");
        require(isDAO, "What you did wrong now? You're blocked!");
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        IVotesUpgradeable _token,
        TimelockControllerUpgradeable _timelock,
        uint256 _votingDelay,
        uint256 _votingPeriod,
        uint256 _levelThreshold,
        ILilyPad _mainContract,
        address _vetoer
    ) public initializer {
        __Governor_init("LilyPadGovernor");
        __GovernorSettings_init(
            _votingDelay /* 6545 blocks (~1 day) */,
            _votingPeriod /* 45818 blocks (~1 week) */,
            1 /*Threshold to participate */
        );
        __GovernorCompatibilityBravo_init();
        __GovernorVotes_init(_token);
        __GovernorVotesQuorumFraction_init(10); /* 10% quorum on snapshot */
        __GovernorTimelockControl_init(_timelock);

        mainContract = _mainContract;
        vetoer = _vetoer;
        levelThreshold = _levelThreshold;
    }

    /**
     * @notice Set a new level threshold for proposals.
     * @param _levelThreshold The new level Threshold
     */
    function setLevelThreshold(uint256 _levelThreshold) external onlyGovernance {
        require(_levelThreshold != levelThreshold, "LilyPadGovernor::Current Value!");

        levelThreshold = _levelThreshold;
    }

    // The following functions are overrides required by Solidity.
    function votingDelay()
        public
        view
        override(IGovernorUpgradeable, GovernorSettingsUpgradeable)
        returns (uint256)
    {
        return super.votingDelay();
    }

    function votingPeriod()
        public
        view
        override(IGovernorUpgradeable, GovernorSettingsUpgradeable)
        returns (uint256)
    {
        return super.votingPeriod();
    }

    function quorum(
        uint256 blockNumber
    )
        public
        view
        override(IGovernorUpgradeable, GovernorVotesQuorumFractionUpgradeable)
        returns (uint256)
    {
        return super.quorum(blockNumber);
    }

    function state(
        uint256 proposalId
    )
        public
        view
        override(GovernorUpgradeable, IGovernorUpgradeable, GovernorTimelockControlUpgradeable)
        returns (ProposalState)
    {
        return super.state(proposalId);
    }

    function propose(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description
    )
        public
        override(GovernorUpgradeable, GovernorCompatibilityBravoUpgradeable, IGovernorUpgradeable)
        onlyWorthy
        returns (uint256)
    {
        return super.propose(targets, values, calldatas, description);
    }

    function proposalThreshold()
        public
        view
        override(GovernorUpgradeable, GovernorSettingsUpgradeable)
        returns (uint256)
    {
        return super.proposalThreshold();
    }

    function _execute(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(GovernorUpgradeable, GovernorTimelockControlUpgradeable) {
        super._execute(proposalId, targets, values, calldatas, descriptionHash);
    }

    function _cancel(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(GovernorUpgradeable, GovernorTimelockControlUpgradeable) returns (uint256) {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }

    function _executor()
        internal
        view
        override(GovernorUpgradeable, GovernorTimelockControlUpgradeable)
        returns (address)
    {
        return super._executor();
    }

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(GovernorUpgradeable, IERC165Upgradeable, GovernorTimelockControlUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    /**
     * @notice Vetoes a proposal only if sender is the vetoer and the proposal has not been executed.
     * @param proposalId The id of the proposal to veto
     */
    function veto(uint256 proposalId, bytes32 descriptionHash) external {
        require(vetoer != address(0), "LilyPadDAO::veto: veto power burned");
        require(msg.sender == vetoer, "LilyPadDAO::veto: only vetoer");
        require(
            state(proposalId) != ProposalState.Executed,
            "LilyPadDAO::veto: cannot veto executed proposal"
        );
        require(!powerless, "LilyPadDAO::veto: Veto power obsolete");

        (
            address[] memory targets,
            uint256[] memory values, //string[] memory signatures,
            ,
            bytes[] memory calldatas
        ) = getActions(proposalId);

        _cancel(targets, values, calldatas, descriptionHash);

        emit ProposalVetoed(proposalId);
    }

    /**
     * @notice Vetoer resign its power.
     */
    function resignPower() external {
        require(vetoer != address(0), "LilyPadDAO: veto power burned");
        require(msg.sender == vetoer, "LilyPadDAO: only vetoer can resign");
        require(!powerless, "LilyPadDAO: already resigned");

        powerless = true;

        emit ResignedPower(msg.sender);
    }
}
