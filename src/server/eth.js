const Web3 = require('web3');

const ASSET_ID = process.env.ASSET_ID; // Which asset is being sent from the faucet
const DROP_SIZE = process.env.DROP_SIZE || "200000000000000000";
const PK = process.env.PRIVATE_KEY; // The private key that holds the given assets to supply the faucet
const RPC_URL = process.env.RPC_URL || "https://subnets.avax.network/dexalot/testnet/rpc";
const CAPTCHA_SECRET = process.env.CAPTCHA_SECRET;

// init web 3 with target evm node
let rpcUrl = RPC_URL;
let web3 = new Web3(rpcUrl);

// Create the web3 account from the faucet private key
let account = web3.eth.accounts.privateKeyToAccount(PK);

const CONFIG = {
    ASSET_ID: ASSET_ID,
    DROP_SIZE: DROP_SIZE,
    PK: PK,
    RPC_URL: RPC_URL,
    CAPTCHA_SECRET: CAPTCHA_SECRET,
    FAUCET_ADDRESS: account.address
  };

// Get balance
web3.eth.getBalance(account.address).then(res => {
    console.log();
    console.log("Asset:\t\t",ASSET_ID);
    console.log("Balance:\t",res);
    console.log("Droplet:\t",DROP_SIZE);
    console.log("Address:\t",account.address);
});


// !!! Receiver is given in 0x format
async function sendGasToken(receiver){
    let latestTx = await web3.eth.getTransactionCount(account.address, 'latest');

    const txConfig = {
        from: account.address,
        gas: "21000",
        to: receiver,
        value: DROP_SIZE,
        data: "",
        nonce: latestTx,
    };

    let signedTx = await account.signTransaction(txConfig);
    let err, receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    if(!err) return receipt;
    console.log(err);
    throw err;
}

module.exports = {
    sendGasToken,
    web3,
    CONFIG
};
