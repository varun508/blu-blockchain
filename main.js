const SHA256 = require('crypto-js/sha256');

class Transaction {

    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block {

    constructor(transactions, timestamp, previousHash = '') {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.timestamp + this.previousHash + JSON.stringify(this.transactions) + this.nonce).toString();
    }

    mineBlock(difficulty) {
        const challenge = Array(difficulty + 1).join("0");
        while (this.hash.substring(0, difficulty) !== challenge) {
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Block mined with hash: " + this.hash);
    }
}

class BlockChain {

    // initializes the chain with the genesis block
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }


    createGenesisBlock() {
        return new Block([], '20/07/2019', '0');
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress) {
        let block = new Block(this.pendingTransactions, Date.now());
        block.mineBlock(this.difficulty);

        console.log("Block successfully mined...");

        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    getBalanceofAddress(address) {
        let balance = 0;

        for (const block of this.chain) {
            console.log(JSON.stringify(block.transactions));

            for (const transaction of block.transactions) {
                if (transaction.toAddress === address) {
                    balance += transaction.amount;
                }

                if (transaction.fromAddress === address) {
                    balance -= transaction.amount;
                }
            }
        }

        return balance;
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }
}

let coin = new BlockChain();


coin.createGenesisBlock(new Transaction('address1', 'address2', 100))
coin.createGenesisBlock(new Transaction('address2', 'address1', 50))

console.log("\nStarting the miner..");
coin.minePendingTransactions('varuns-address')


console.log("\nStarting the miner again..");
coin.minePendingTransactions('varuns-address')

console.log('\nBalance of varun is ' + coin.getBalanceofAddress('varuns-address'));

