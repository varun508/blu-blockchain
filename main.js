const SHA256 = require('crypto-js/sha256');

class Block {

    constructor(index, data, timestamp, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.index + this.timestamp + this.previousHash + JSON.stringify(this.data) + this.nonce).toString();
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
        return new Block(0, { "name": "varun" }, '20/07/2019', '0');
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

for (let i = 0; i < 20; i++) {
    var index = i + 1;
    coin.addBlock(new Block(index, { name: 'user' + index }, (index) + '/07/2019'));
}


// console.log(JSON.stringify(coin.chain, null, 4));

if (coin.isChainValid()) {
    console.log("The chain is valid")
} else {
    console.log("The chain isn't valid")
}

