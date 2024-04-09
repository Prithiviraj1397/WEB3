const router = require('express').Router();
var { Web3 } = require('web3');
var Tx = require('ethereumjs-tx').Transaction;
var web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545/');

router.get('/createAddress', async (req, res) => {
    console.log('ok')
    const address = await web3.eth.accounts.create()
    console.log("🚀 ~ file: web3.js:7 ~ router.get ~ address:", address)
    res.json({
        status: true,
        address
    })
})
router.get('/getCurrentBlockNumber', async (req, res) => {
    let LastestBlock = await web3.eth.getBlockNumber()
    LastestBlock = Number(LastestBlock)
    res.json({
        status: true,
        LastestBlock
    })
})
router.post('/getAllTransactionFromBlock', async (req, res) => {
    blkNum = req.body.block;
    let block = await web3.eth.getBlock(blkNum);
    let result = [];
    for (let i = 0; i < block.transactions.length; i++) {
        let transaction = await web3.eth.getTransaction(block.transactions[i])
        if (transaction.input.length == 138) {//138 for to beb20 token transaction
            let toAddress = transaction.input
            toAddress = '0x' + toAddress.substring(34, 74);
            let obj = {
                type: 'BEB20 TOKEN',
                hash: block.transactions[i],
                from: transaction.from,
                to: toAddress,
                contractAddress: transaction.to
            }
            result.push(obj)
        } else {
            let obj = {
                type: 'ADDRESS',
                hash: block.transactions[i],
                from: transaction.from,
                to: transaction.to,
            }
            result.push(obj)
        }
    }
    res.json({
        status: true,
        result
    })

})
router.post('/getBNBBalance', async (req, res) => {
    const walletAddress = req.body.address;
    let balance = await web3.eth.getBalance(walletAddress);
    balance = web3.utils.fromWei(balance, 'ether');
    res.json({
        status: true,
        address: req.body.address,
        balance
    })
})
router.post('/getTokenbalance', async (req, res) => {
    try {
        const tokenAddress = req.body.tokenAddress;
        const address = req.body.address;
        const abiJson = [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_to", "type": "address" }, { "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "burnFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" }], "name": "decreaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" }], "name": "increaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_to", "type": "address" }, { "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "mint", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }];
        const contract = new web3.eth.Contract(abiJson, tokenAddress);
        let balance = await contract.methods.balanceOf(address).call();
        balance = web3.utils.fromWei(balance, 'ether');
        res.json({
            status: true,
            balance
        })
    } catch (error) {
        if (error.innerError) {
            if (error.name === 'Eip838ExecutionError' && error.data) {
                const revertReason = web3.utils.decodeRevertReason(error.data);
                console.error('Revert Reason:', revertReason);
            }
        }
        // Handle the contract execution error here
        console.error('Error executing contract function:', error.message);
    }
    // note that this number includes the decimal places (in case of BUSD, that's 18 decimal places)
})
router.post('/sendBNB', async (req, res) => {
    const from = req.body.from;
    const to = req.body.to;
    let value = req.body.value;
    value = web3.utils.toWei(value, 'ether')
    const privateKey = req.body.privateKey;
    let gas = await web3.eth.getGasPrice()
    const txObject = {
        from: from,
        to: to,
        value: value,
        gasPrice: Number(gas),
        gasLimit: 21000
    }
    const createTransaction = await web3.eth.accounts.signTransaction(txObject, privateKey).catch(err => {
        console.log("🚀 ~ file: web3.js:105 ~ router.post ~ err:", err)
    })
    web3.eth.sendSignedTransaction(createTransaction.rawTransaction).on('transactionHash', (hash) => {
        console.log('Transaction hash:', hash);
        res.json({
            status: true,
            hash
        })
    }).on('error', (error) => {
        console.error('Error sending transaction:', error);
    });

})

module.exports = router;