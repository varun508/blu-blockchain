const SHA256 = require('crypto-js/sha256');

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
        this.difficulty = 4;
    }

    createGenesisBlock() {
        return new Block({ "name": "varun" }, '20/07/2019', '0');
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(block) {
        block.previousHash = this.getLatestBlock().hash;
        block.mineBlock(this.difficulty);
        this.chain.push(block);
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
