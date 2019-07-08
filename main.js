const SHA256 = require('crypto-js/sha256');

class Block {

    constructor(index, data, timestamp, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return SHA256(this.index + this.timestamp + this.previousHash + JSON.stringify(this.data)).toString();
    }
}

class BlockChain {

    // initializes the chain with the genesis block
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        return new Block(0, { "name": "varun" }, '20/07/2019', '0');
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(block) {
        block.previousHash = this.getLatestBlock().hash;
        block.hash = block.calculateHash();
        this.chain.push(block);
    }
}

let coin = new BlockChain();

for (let i = 0; i < 20; i++) {
    var index = i + 1;
    coin.addBlock(new Block(index, { name: 'user' + index }, (index) + '/07/2019'));
}


console.log(JSON.stringify(coin.chain,null,4));
