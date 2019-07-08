class Block{
    
    constructor(index, data, timestamp, previousHash=''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
    }
}