// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Test, console} from "forge-std/Test.sol";
import {Raffle} from "src/Raffle.sol";
import {DeployRaffle} from "script/DeployRaffle.s.sol";
import {HelperConfig, CodeConstants} from "script/HelperConfig.s.sol";
import {Vm} from "forge-std/Vm.sol";
import {VRFCoordinatorV2_5Mock} from "@chainlink/contracts/src/v0.8/vrf/mocks/VRFCoordinatorV2_5Mock.sol";

contract RaffleTest is Test, CodeConstants {
    /** Events */
    event EnteredRaffle(address indexed player);
    event PickedWinner(address indexed winner);
    event RequestedRaffleWinner(uint256 indexed requestId);

    Raffle raffle;
    HelperConfig helperConfig;

    address public PLAYER = makeAddr("players");
    uint256 public constant START_USER_BALANCE = 10 ether;
    uint256 public entranceFee;
    uint256 public interval;
    address public vrfCoordinator;
    bytes32 public gasLane;
    uint256 public subscriptionId;
    uint32 public callbackGasLimit;

    function setUp() external {
        DeployRaffle deployer = new DeployRaffle();
        (raffle, helperConfig) = deployer.deployContract();
        HelperConfig.NetworkConfig memory config = helperConfig.getConfig();
        entranceFee = config.entranceFee;
        interval = config.interval;
        vrfCoordinator = config.vrfCoordinator;
        gasLane = config.gasLane;
        callbackGasLimit = config.callbackGasLimit;
        subscriptionId = config.subscriptionId;
    }

    modifier fundPlayer() {
        vm.prank(PLAYER);
        vm.deal(PLAYER, START_USER_BALANCE);
        _;
    }

    modifier enterRaffle() {
        vm.prank(PLAYER);
        vm.deal(PLAYER, START_USER_BALANCE);
        raffle.enterRaffle{value: entranceFee}();
        _;
    }

    modifier timePassed() {
        vm.warp(block.timestamp + interval + 1);
        vm.roll(block.number + 1);
        _;
    }

    /*//////////////////////////////////////////////////////////////
                              ENTER RAFFLE
    //////////////////////////////////////////////////////////////*/

    function testRaffleInitializesInOpenState() public view {
        assert(raffle.getRaffleState() == Raffle.RaffleState.OPEN);
    }

    function testRaffleRevertsWhenYouDontPayEnough() public fundPlayer {
        vm.expectRevert(Raffle.Raffle__NotEnoughEthSent.selector);
        raffle.enterRaffle{value: 0.00001 ether}();
    }

    function testRaffleRecordsPlayerWhenTheyEnter() public enterRaffle {
        assert(raffle.getPlayer(0) == PLAYER);
    }

    function testEnteringRaffleEmitsEvent() public fundPlayer {
        vm.expectEmit(true, false, false, false, address(raffle));
        emit EnteredRaffle(PLAYER);
        raffle.enterRaffle{value: entranceFee}();
    }

    function testDontAllowPlayersEnterWhileRaffleIsCalculating()
        public
        enterRaffle
        timePassed
    {
        raffle.performUpkeep(""); // There is no Chainlink automation yet, have to execute the function manually
        vm.expectRevert(Raffle.Raffle__RaffleNotOpen.selector);
        vm.prank(PLAYER);
        raffle.enterRaffle{value: entranceFee}();
    }

    /*//////////////////////////////////////////////////////////////
                              CHECK UPKEEP
    //////////////////////////////////////////////////////////////*/
    function testCheckUpkeepReturnFalseIfItHasNoBalance() public timePassed {
        // Act
        (bool upkeepNeeded, ) = raffle.checkUpkeep("");
        // Assert
        assert(!upkeepNeeded);
    }

    function testCheckUpkeepReturnFalseIfRaffleNotOpen()
        public
        enterRaffle
        timePassed
    {
        // Arrange
        raffle.performUpkeep("");
        Raffle.RaffleState raffleState = raffle.getRaffleState();
        // Act
        (bool upkeepNeeded, ) = raffle.checkUpkeep("");
        // Assert
        assert(raffleState == Raffle.RaffleState.CALCUALTING);
        assert(!upkeepNeeded);
    }

    //testCheckUpkeepReturnFalseIfEnoughTimeHasntPassed
    function testCheckUpkeepReturnFalseIfEnoughTimeHasntPassed()
        public
        enterRaffle
    {
        // Act
        (bool upkeepNeeded, ) = raffle.checkUpkeep("");
        // Assert
        assert(!upkeepNeeded);
    }

    //testCheckUpkeepReturnTrueWhenParametersAreGood
    function testCheckUpkeepReturnTrueWhenParametersAreGood()
        public
        enterRaffle
        timePassed
    {
        // Act
        (bool upkeepNeeded, ) = raffle.checkUpkeep("");
        // Assert
        assert(upkeepNeeded);
    }

    /*//////////////////////////////////////////////////////////////
                             PERFORM UPKEEP
    //////////////////////////////////////////////////////////////*/
    function testPerformUpkeepCanOnlyRunIfCheckUPkeepIsTrue()
        public
        enterRaffle
        timePassed
    {
        // Act / Assert
        raffle.performUpkeep(""); //No expectNotRevert in foundry, so if it going on, the test pass
    }

    function testPerformUpkeepRevertsIfCheckUPkeepIsFalse() public {
        uint256 currentBalance = 0;
        uint256 numPlayers = 0;
        uint256 raffleState = 0;
        vm.expectRevert(
            abi.encodeWithSelector(
                Raffle.Raffle__UpkeepNotNeeded.selector,
                currentBalance,
                numPlayers,
                raffleState
            )
        );
        raffle.performUpkeep("");
    }

    // Test the output of an event (like Chainlink listen to event data)
    function testPerformUpkeepUpdatesRaffleStateAndEmitsRequestId()
        public
        enterRaffle
        timePassed
    {
        // Act    get requestId from event
        vm.recordLogs();
        raffle.performUpkeep(""); // emit requestId
        Vm.Log[] memory entries = vm.getRecordedLogs(); // capital V
        bytes32 requestId = entries[1].topics[1]; // the first event is in the requestRandomWords function, the zeorth topic refers the entire event, the first event refers requestId

        Raffle.RaffleState raffleState = raffle.getRaffleState();
        // Assert
        assert(uint256(requestId) > 0);
        assert(uint256(raffleState) == 1);
    }

    /*//////////////////////////////////////////////////////////////
                           FULFILL RANDOMWORDS
    //////////////////////////////////////////////////////////////*/
    modifier skipFolk() {
        if (block.chainid != DEFAULT_ANVIL_ID) {
            return;
        }
        _;
    }

    function testFulfillRandomWordsCanOnlyBeCalledAfterPerformUpkeep(
        uint256 randomRequestId
    ) public enterRaffle timePassed skipFolk {
        vm.expectRevert(VRFCoordinatorV2_5Mock.InvalidRequest.selector);
        VRFCoordinatorV2_5Mock(vrfCoordinator).fulfillRandomWords(
            randomRequestId,
            address(raffle)
        );
    }

    function testFulfillRandomWordsPicksAWinnerResetsAndSendMoney()
        public
        enterRaffle
        timePassed
        skipFolk
    {
        // Arrange
        uint256 startingIndex = 1;
        uint256 additionalEntrants = 3;
        address expectedWinner = address(1);
        for (
            uint256 i = startingIndex;
            i < startingIndex + additionalEntrants;
            i++
        ) {
            // address player = makeAddr("i");
            address newPlayer = address(uint160(i));
            hoax(newPlayer, START_USER_BALANCE);
            raffle.enterRaffle{value: entranceFee}();
        }
        uint256 startingTimestamp = raffle.getLastTimestamp();
        uint256 winnerStartingBalance = expectedWinner.balance;

        // Act
        vm.recordLogs();
        raffle.performUpkeep(""); // emit requestId
        Vm.Log[] memory entries = vm.getRecordedLogs(); // capital V
        bytes32 requestId = entries[1].topics[1];
        console.log("Request ID: ", uint256(requestId));
        // pretend to be Chainlink VRF to get random number & pick winner
        VRFCoordinatorV2_5Mock(vrfCoordinator).fulfillRandomWords(
            uint256(requestId),
            address(raffle)
        );

        // Assert
        uint256 raffleState = uint256(raffle.getRaffleState());
        address recentWinner = raffle.getRecentWinner();
        uint256 endingTimestamp = raffle.getLastTimestamp();
        uint256 winnerBalance = recentWinner.balance;
        uint256 prize = entranceFee * (additionalEntrants + 1);

        assert(uint256(raffleState) == 0);
        assert(recentWinner == expectedWinner);
        assert(startingTimestamp < endingTimestamp);
        assert(winnerBalance == winnerStartingBalance + prize);
        assert(address(raffle).balance == 0);
    }
}
