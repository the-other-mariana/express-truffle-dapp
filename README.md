# Blockchain Decentralized Application

The following project is a small decentralized application that basically showcases the use of blockchain as a secondary data base alongside an offchain database with MongoDB. <br />

The usage of blockchain as a secondary database is the following: every time a user sings in in the login, after knowing the user is valid according to MongoDB registry, the hash of the login input is compared to blockchain's registry and only if this is validated, the user is able to access safely.

## Specifications

NodeJS version: `10.15.3`
`express` version: `4.17.1`
`express-handlebars` version: `3.1.0`
`express-session` version: `1.16.2`
`mongodb` version: `2.2.33`
`truffle-contract` version: `4.0.31`
	`web3` version: `1.2.1`
`ganache-cli` version: `6.7.0`

## Usage

