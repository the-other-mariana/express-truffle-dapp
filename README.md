# Blockchain Decentralized Application

The following project is a small decentralized application that basically showcases the use of blockchain as a secondary data base alongside an offchain database with MongoDB. <br />

The usage of blockchain as a secondary database is the following: every time a user sings in in the login, after knowing the user is valid according to MongoDB registry, the hash of the login input is compared to blockchain's registry and only if this is validated, the user is able to access safely.

## Specifications

NodeJS version: `10.15.3`<br />
`express` version: `4.17.1`<br />
`express-handlebars` version: `3.1.0`<br />
`express-session` version: `1.16.2`<br />
`mongodb` version: `2.2.33`<br />
`truffle-contract` version: `4.0.31`<br />
	`web3` version: `1.2.1`<br />
`ganache-cli` version: `6.7.0`<br />

## Usage

After installing all dependencies, the first thing to do is download [Ganache Quickstart](https://www.trufflesuite.com/docs/ganache/quickstart) for desktop version. Once installed, turn on your Ganache environment (click on Quickstart). <br />

Turn on MongoDB service. Search for `services` inside your computer. Right click on MongoDB Server and choose Start.<br />

![alt text](https://github.com/the-other-mariana/express-truffle-dapp/blob/master/screen_caps/services.png?raw=true)<br />

Go to Windows Powershell, and enter to the project's folder. Once there, type: `truffle console --network ganache` to enter Truffle Console. Then, type `migrate --compile-all --reset` to compile the Smart contracts (do this everytime you change a contract). This also delets any registry in the blockchain. Finally, type `.exit` exit the console. <br />

Now, start the server. Type `npm start` on your Powershell. This is equivalent to typing `node ./bin/www`. On this file, you will see the port for the project is `3000`. <br />

You will see first the login page. On the bottom, the MongoDB registry of users will be displayed. In this case, the users will start in zero, like below.<br />

![alt text](https://github.com/the-other-mariana/express-truffle-dapp/blob/master/screen_caps/login-no-users.png?raw=true)<br />

Whenever you reset all contracts, you should click on `Restart DB` to empty the MongoDB registry just as the Ganache one. They should have the same amount of users.<br />

If you click on `Register`, you will be able to type the username and password of a new user, like below.<br />

![alt text](https://github.com/the-other-mariana/express-truffle-dapp/blob/master/screen_caps/register-user.png?raw=true)<br />

When you confirm the new user, you get redirected to the login page, where you will be able to see the new user's info down below. All this is just for proof of concept.<br />

![alt text](https://github.com/the-other-mariana/express-truffle-dapp/blob/master/screen_caps/login-1-user.png?raw=true)<br />

If you sign in as the new user, you will enter the main page, given the validation using the blockchain has registry.<br />

![alt text](https://github.com/the-other-mariana/express-truffle-dapp/blob/master/screen_caps/main-mariana.png?raw=true)<br />

Here, you can choose to see the Transaction Information by clicking on `Auth` button. This will take you to the following page, which shows the corresponding user registration information that was stored when the blockchain added the user.<br />

![alt text](https://github.com/the-other-mariana/express-truffle-dapp/blob/master/screen_caps/audit-mariana.png?raw=true)<br />

This info should coincide with the Ganache Quickstart info. If you click on the transaction by recognizing the hash, you will see the info:<br />

![alt text](https://github.com/the-other-mariana/express-truffle-dapp/blob/master/screen_caps/ganache-tx.png?raw=true)<br />

You can also click on the `Register` button and add another user again. Users displayed on the bottom parts are updated using `Ajax` calls every 3 seconds.<br />

Finally, you can access the Blockchain Market where you will be able to sell and buy items. Access looks like the following: <br />

![alt text](https://github.com/the-other-mariana/express-truffle-dapp/blob/master/screen_caps/market.png?raw=true)<br />

To stop the server, go to Powershell and type `Ctrl + C`.
