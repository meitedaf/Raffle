# Provably Random Raffle Contracts

This project implements a Raffle smart contract using Solidity and Foundry. The Raffle contract allows users to enter a raffle by sending a specified amount of ether. A Chainlink VRF (Verifiable Random Function) is used to randomly select a winner.

## Table of Contents

- [Provably Random Raffle Contracts](#provably-random-raffle-contracts)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Compile the Contracts](#compile-the-contracts)
    - [Deploy the Contracts](#deploy-the-contracts)
    - [Interact with the Contracts](#interact-with-the-contracts)
    - [Testing](#testing)
  - [Contributing](#contributing)
  - [License](#license)
  - [Acknowledgements](#acknowledgements)

## Features

- Users can enter the raffle by sending a fixed amount of ether.
- Uses Chainlink VRF to randomly select a winner.
- Winner is awarded the entire balance of the contract.
- Supports automation via Chainlink Keepers.

## Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/meitedaf/Raffle.git
    cd Raffle
    ```

2. Install Foundry and required dependencies:

    ```sh
    make install
    ```

3. Set up your environment variables in a `.env` file:

    ```plaintext
    SEPOLIA_RPC_URL=<your-sepolia-rpc-url>
    PRIVATE_KEY=<your-private-key>
    ETHERSCAN_API_KEY=<your-etherscan-api-key>
    ```

## Usage

### Compile the Contracts

Compile the contracts using Foundry:

    ```sh
    forge build
    ```

### Deploy the Contracts

To deploy the contracts to the Sepolia test network:

    ```sh
    make deploy-sepolia
    ```

### Interact with the Contracts

You can interact with the deployed contract using the `Interactions.s.sol` script or directly through Etherscan.

### Testing

To run the tests:

    ```sh
    forge test
    ```

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

## Acknowledgements

- [Chainlink](https://chain.link/)
- [Foundry](https://getfoundry.sh/)
- [Ethereum](https://ethereum.org/)