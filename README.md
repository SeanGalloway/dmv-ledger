# DMV Ledger

Final project for CS 764 at Old Dominion University.
This system is implemented as a [React](https://reactjs.org) web application that interacts with a local ethereum blockchain.

## Setup

Requirements: 
* Yarn, 
* Truffle, 
* Node 12 (cannot be version 13 or higher. See [NVM](https://github.com/nvm-sh/nvm) for a tool to help switching temporarily between versions).

1. Use a testnet, or run a local Ethereum blockchain with Ganache or Truffle.
1. Modify the "develop" section of /truffle-config.js to contain the correct connection parameters for the this blockchain.
1. From a terminal in the project, run `truffle migrate --network develop --reset`

## Run
1. Change to the "client" directory.
1. run `yarn install`
1. Run `yarn start`
1. If a browser tab does not open automatically, navigate to localhost:3000 or 127.0.0.1:3000.
