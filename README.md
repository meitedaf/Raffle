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
    - [Frontend Setup](#frontend-setup)
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

### Frontend Setup

This project now includes a simple frontend that allows users to interact with the raffle contract via a web interface.

1. Navigate to the `frontend` directory:

    ```sh
    cd frontend
    ```

2. Install the required dependencies:

    ```sh
    npm install
    ```

3. Start the frontend development server:

    ```sh
    npm start
    ```

4. Open your browser and navigate to `http://localhost:3000` to see the app.

The frontend interface will look like this:

<img width="566" alt="截屏2024-08-25 18 56 41" src="https://github.com/user-attachments/assets/141b03de-8a7f-46eb-9bfd-0e81320ea9ea">



This frontend allows users to:

- Connect their Ethereum wallet.
- View the entrance fee, contract balance, recent winner, raffle state, and current players.
- Enter the raffle by clicking the "Enter Raffle" button.

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
