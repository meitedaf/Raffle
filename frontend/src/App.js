
// App.js
import React, { useState, useEffect } from "react";
import Web3 from "web3";

// 合约 ABI 和地址
const raffleABI = [
    { "inputs": [{ "internalType": "uint256", "name": "entranceFee", "type": "uint256" }, { "internalType": "uint256", "name": "interval", "type": "uint256" }, { "internalType": "address", "name": "vrfCoordinator", "type": "address" }, { "internalType": "bytes32", "name": "gasLane", "type": "bytes32" }, { "internalType": "uint256", "name": "subscriptionId", "type": "uint256" }, { "internalType": "uint32", "name": "callbackGasLimit", "type": "uint32" }], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [{ "internalType": "address", "name": "have", "type": "address" }, { "internalType": "address", "name": "want", "type": "address" }], "name": "OnlyCoordinatorCanFulfill", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "have", "type": "address" }, { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "coordinator", "type": "address" }], "name": "OnlyOwnerOrCoordinator", "type": "error" }, { "inputs": [], "name": "Raffle__NotEnoughEthSent", "type": "error" }, { "inputs": [], "name": "Raffle__RaffleNotOpen", "type": "error" }, { "inputs": [], "name": "Raffle__TransforFailed", "type": "error" }, { "inputs": [{ "internalType": "uint256", "name": "currentBalance", "type": "uint256" }, { "internalType": "uint256", "name": "numPlayers", "type": "uint256" }, { "internalType": "uint256", "name": "raffleState", "type": "uint256" }], "name": "Raffle__UpkeepNotNeeded", "type": "error" }, { "inputs": [], "name": "ZeroAddress", "type": "error" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "vrfCoordinator", "type": "address" }], "name": "CoordinatorSet", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "player", "type": "address" }], "name": "EnteredRaffle", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }], "name": "OwnershipTransferRequested", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "winner", "type": "address" }], "name": "PickedWinner", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "requestId", "type": "uint256" }], "name": "RequestedRaffleWinner", "type": "event" }, { "inputs": [], "name": "acceptOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes", "name": "", "type": "bytes" }], "name": "checkUpkeep", "outputs": [{ "internalType": "bool", "name": "upkeepNeeded", "type": "bool" }, { "internalType": "bytes", "name": "", "type": "bytes" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "enterRaffle", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "getEntranceFee", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getLastTimestamp", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getLengthOfPlayers", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "indexOfPlayers", "type": "uint256" }], "name": "getPlayer", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getRaffleState", "outputs": [{ "internalType": "enum Raffle.RaffleState", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getRecentWinner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes", "name": "", "type": "bytes" }], "name": "performUpkeep", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "requestId", "type": "uint256" }, { "internalType": "uint256[]", "name": "randomWords", "type": "uint256[]" }], "name": "rawFulfillRandomWords", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "s_vrfCoordinator", "outputs": [{ "internalType": "contract IVRFCoordinatorV2Plus", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_vrfCoordinator", "type": "address" }], "name": "setCoordinator", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }
];
const raffleAddress = "0x3e670fEd42c2eEdD6d2cfC10e03f8e5840b4865F"; // 部署的合约地址

function App() {
    // 应用状态
    const [web3, setWeb3] = useState(null);
    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState(null);
    const [entranceFee, setEntranceFee] = useState(null);
    const [players, setPlayers] = useState([]);
    const [recentWinner, setRecentWinner] = useState(null);
    const [raffleState, setRaffleState] = useState(null);
    const [balance, setBalance] = useState(null);

    useEffect(() => {
        console.log("useEffect triggered");
        async function loadWeb3() {
            if (window.ethereum) {
                try {
                    const web3 = new Web3(window.ethereum);
                    console.log("Web3 Initialized: ", web3);
                    setWeb3(web3);

                    const accounts = await web3.eth.requestAccounts();
                    console.log("Accounts: ", accounts);
                    setAccount(accounts[0]);

                    const raffleContract = new web3.eth.Contract(raffleABI, raffleAddress);
                    console.log("Contract: ", raffleContract);
                    setContract(raffleContract);

                    // 立即加载数据
                    fetchRaffleData(raffleContract, web3);
                } catch (error) {
                    console.error("Error initializing web3: ", error);
                }
            } else {
                console.error("Please install MetaMask!");
            }
        }
        loadWeb3();
    }, []);

    // 将 fetchRaffleData 移出 useEffect 依赖中并接受 contract 和 web3 作为参数
    async function fetchRaffleData(contract, web3) {
        console.log("Fetching raffle data...");
        try {
            const entranceFee = await contract.methods.getEntranceFee().call();
            setEntranceFee(web3.utils.fromWei(entranceFee, "ether"));

            const playerCount = await contract.methods.getLengthOfPlayers().call();
            let playersArray = [];
            for (let i = 0; i < playerCount; i++) {
                const player = await contract.methods.getPlayer(i).call();
                playersArray.push(player);
            }
            setPlayers(playersArray);

            const recentWinner = await contract.methods.getRecentWinner().call();
            setRecentWinner(recentWinner);

            const raffleState = await contract.methods.getRaffleState().call();
            console.log("Raffle State:", Number(raffleState));
            setRaffleState(Number(raffleState) === 0 ? "Open" : "Calculating");

            const contractBalance = await web3.eth.getBalance(contract.options.address);
            setBalance(web3.utils.fromWei(contractBalance, "ether"));
        } catch (error) {
            console.error("Error fetching raffle data: ", error);
        }
    }

    // 初始化 Web3 和合约
    // useEffect(() => {
    //     console.log("useEffect triggered");
    //     async function loadWeb3() {
    //         if (window.ethereum) {
    //             try {
    //                 const web3 = new Web3(window.ethereum);
    //                 console.log("Web3 Initialized: ", web3);
    //                 setWeb3(web3);

    //                 const accounts = await web3.eth.requestAccounts();
    //                 console.log("Accounts: ", accounts);
    //                 setAccount(accounts[0]);

    //                 const raffleContract = new web3.eth.Contract(raffleABI, raffleAddress);
    //                 console.log("Contract: ", raffleContract);
    //                 setContract(raffleContract);
    //             } catch (error) {
    //                 console.error("Error initializing web3: ", error);
    //             }
    //         } else {
    //             console.error("Please install MetaMask!");
    //         }
    //     }
    //     loadWeb3();
    // }, []);

    // // 加载合约状态：获取入场费用、玩家、上次获胜者等信息
    // useEffect(() => {
    //     console.log("Web3:", web3);
    //     console.log("Contract:", contract);
    //     console.log("Account:", account);

    //     if (contract && account && web3) {
    //         async function fetchRaffleData() {
    //             try {
    //                 const entranceFee = await contract.methods.getEntranceFee().call();
    //                 setEntranceFee(web3.utils.fromWei(entranceFee, "ether"));

    //                 const playerCount = await contract.methods.getLengthOfPlayers().call();
    //                 let playersArray = [];
    //                 for (let i = 0; i < playerCount; i++) {
    //                     const player = await contract.methods.getPlayer(i).call();
    //                     playersArray.push(player);
    //                 }
    //                 setPlayers(playersArray);

    //                 const recentWinner = await contract.methods.getRecentWinner().call();
    //                 setRecentWinner(recentWinner);

    //                 const raffleState = await contract.methods.getRaffleState().call();
    //                 console.log(raffleState);
    //                 setRaffleState(raffleState === 0 ? "Open" : "Calculating");

    //                 const contractBalance = await web3.eth.getBalance(contract.options.address);
    //                 setBalance(web3.utils.fromWei(contractBalance, "ether"));
    //             } catch (error) {
    //                 console.error("Error fetching raffle data: ", error);
    //             }
    //         }
    //         fetchRaffleData();
    //     }
    // }, [contract, account, web3]);




    // useEffect(() => {
    //     if (contract && account) {
    //         async function fetchRaffleData() {
    //             try {
    //                 const entranceFee = await contract.methods.getEntranceFee().call();
    //                 setEntranceFee(web3.utils.fromWei(entranceFee, "ether"));

    //                 const playerCount = await contract.methods.getLengthOfPlayers().call();
    //                 let playersArray = [];
    //                 for (let i = 0; i < playerCount; i++) {
    //                     const player = await contract.methods.getPlayer(i).call();
    //                     playersArray.push(player);
    //                 }
    //                 setPlayers(playersArray);

    //                 const recentWinner = await contract.methods.getRecentWinner().call();
    //                 setRecentWinner(recentWinner);

    //                 const raffleState = await contract.methods.getRaffleState().call();
    //                 setRaffleState(raffleState);

    //                 const contractBalance = await web3.eth.getBalance(raffleAddress);
    //                 setBalance(web3.utils.fromWei(contractBalance, "ether"));
    //             } catch (error) {
    //                 console.error("Error fetching raffle data: ", error);
    //             }
    //         }
    //         fetchRaffleData();
    //     }
    // }, [contract, account, web3]);

    // 用户进入 Raffle 合约
    const enterRaffle = async () => {
        if (contract && account) {
            try {
                await contract.methods.enterRaffle().send({
                    from: account,
                    value: web3.utils.toWei(entranceFee, "ether"),
                });
                alert("Successfully entered the raffle!");
                window.location.reload();
            } catch (error) {
                console.error("Error entering raffle: ", error);
            }
        }
    };

    return (
        <div className="App">
            <h1>Decentralized Raffle DApp</h1>
            <p>
                <strong>Connected Account:</strong> {account ? account : "Not connected"}
            </p>

            <div>
                <h2>Raffle Details</h2>
                <p>
                    <strong>Entrance Fee:</strong> {entranceFee ? `${entranceFee} ETH` : "Loading..."}
                </p>
                <p>
                    <strong>Contract Balance:</strong> {balance ? `${balance} ETH` : "Loading..."}
                </p>
                <p>
                    <strong>Recent Winner:</strong> {recentWinner ? recentWinner : "None yet"}
                </p>
                {/* <p>
                    <strong>Raffle State:</strong> {Number(raffleState) === 0 ? "Open" : "Calculating"}
                </p> */}
                <p>
                    <strong>Raffle State:</strong> {typeof raffleState === 'string' ? raffleState : Number(raffleState)}
                </p>
                <p>
                    <strong>Players:</strong>
                </p>
                <ul>
                    {players.length > 0 ? players.map((player, index) => <li key={index}>{player}</li>) : <p>No players yet</p>}
                </ul>
            </div>

            <div>
                <h2>Enter the Raffle</h2>
                <button onClick={enterRaffle}>Enter Raffle</button>
            </div>
        </div>
    );
}

export default App;