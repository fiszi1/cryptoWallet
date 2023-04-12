const EthLib = require("/src/core/blockchain/eth/EthLib");
const ERC20_ABI = require("./erc20_abi");
const Erc20Converter = require("/src/core/helpers/Erc20Converter");

const GAS_LIMIT = 300000;
const contractAddress = process.env.ERC20_CONTRACT_ADDRESS;

class Erc20Lib extends EthLib {
    constructor() {
        super();
        this.setContract();
        this.converter = new Erc20Converter();
    }

    composeContract() {
        return new this.provider.eth.Contract(ERC20_ABI, this.getContractAddress());
    }

    getContractAddress() {
        return contractAddress;
    }
    
    setContract() {
        this.contract = this.composeContract();
    }

    getContract() {
        return this.contract;
    }

    getGasLimit() {
        return GAS_LIMIT;
    }

    toDecimals(amount) {
        return this.converter.toDecimals(amount);
    }

    fromDecimals(amount){
        return this.converter.fromDecimals(amount);
    }


    getBalance(address){
        return new Promise(async(resolve, reject) => {
            try{
                this.validator.validateAddress(address);
                let balance = await this.getContract().methods.balanceOf(address).call();
                balance = this.toDecimals(balance);
                return resolve(balance);
            } catch(e) {
                return reject(e);
            }
        })
    }

    getCurrentBalance() {
        return new Promise(async (resolve, reject)=>{
            try{
                let address = await this.getAddress();
                let balance = await this.getBalance(address);
                return resolve(balance);
            } catch(e){
                return reject(e);
            }
        })  
    }

    sendCurrency(to, amount){
        return new Promise(async(resolve, reject)=>{
            try{
                amount = this.fromDecimals(amount);
                let data = this.getContract().methods.transfer(to, amount).encodeABI();
                let txData = await this._formatTransactionParams(this.getContractAddress(),"0", data);
                let hash = await this._makeTransaction(txData);
                return resolve(hash);
            } catch(e) {
                reject(e);
            }
        })
    }
}

module.exports = Erc20Lib;