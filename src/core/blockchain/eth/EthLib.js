const Web3 = require("web3");
const Transaction = require('ethereumjs-tx');
const EthConverter = require("/src/core/helpers/EthConverter");
const Validator = require("/src/core/validators/blockchain/EthValidator");

const PROVIDER_URL = process.env.PROVIDER_URL;
let address = process.env.ETH_ADDRESS;
let privateKey = process.env.ETH_PRIVKEY;

const GAS_LIMIT = 21000;
const GWEI = 10**9;

class EthLib {  

    constructor() {
        this.web3 = new Web3(new Web3.providers.HttpProvider(PROVIDER_URL));
        this.converter = new EthConverter();
        this.validator = new Validator();
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

    getBalance(address) {
        return new Promise(async (resolve, reject)=>{
            try{
                let balance = await this.web3.eth.getBalance(address);
                balance = this.web3.utils.fromWei(balance);
                return resolve(balance);
            } catch(e){
                return reject(e);
            }
        })  
    }

    getAddress() {
        return new Promise(async (resolve, reject)=>{
            try{
                return resolve(address);
            } catch(e){
                return reject(e);
            }
        })  
    }

    toDecimals(amount) {
        return this.converter.toDecimals(amount);
    }

    fromDecimals(amount){
        return this.converter.fromDecimals(amount);
    }

    getPrivateKey() {
        return new Promise(async (resolve, reject)=>{
            try{
                return resolve(privateKey);
            } catch(e){
                return reject(e);
            }
        })  
    }

    sendCurrency(to, amount){
        return new Promise(async(resolve, reject)=>{
            try{
                let txData = await this._formatTransactionParams(to,amount);
                let hash = await this._makeTransaction(txData);
                return resolve(hash);
            } catch(e) {
                reject(e);
            }
        })
    }

    _formatTransactionParams(to,value,data="0x"){
        return new Promise(async(resolve,reject)=>{
            try{
                let privateKey = await this.getPrivateKey();
                let privKeyBuffer = Buffer.from(privateKey,'hex');
                let from = await this.getAddress();
                let nonce = await this.getNextNonce();

                let gasPrice = await this.getAvgGasPrice();
                let gasLimit = this.getGasLimit();
                value = this.fromDecimals(value);
                let txParams = {
                    "from":from,
                    "to":to,
                    "privateKey":privKeyBuffer,
                    "value":this.web3.utils.numberToHex(value),
                    "gasPrice":this.web3.utils.numberToHex(gasPrice),
                    "gasLimit":gasLimit,
                    "nonce":nonce,
                    "data":data,
                };
                return resolve(txParams);
            }catch (e){
                return reject(e);
            }
        })
    }

    getNextNonce(){
        return new Promise(async(resolve,reject)=>{
            try{
                let address = await this.getAddress();
                let nonce =await this.web3.eth.getTransactionCount(address);
                return resolve(nonce);
            }catch (e){
                return reject(e)
            }
        });
    }

    _makeTransaction(txParams){
        return new Promise(async (resolve,reject)=>{
            try{
                let tx = new Transaction(txParams);
                console.log(tx);
                tx.sign(txParams.privateKey);
                var raw = "0x" + tx.serialize().toString('hex');

                this.web3.eth.sendSignedTransaction(raw).on("receipt",(data)=>{
                    console.log(data);
                    let transactionHash = data["transactionHash"];
                    return resolve(transactionHash);
                }).on("error",(e)=>{
                    console.error(e);
                    return reject(e);
                });

            }catch(e){
                return reject(e);
            }
        });
    }

    getAvgGasPrice() {
        return new Promise(async (resolve, reject)=>{
            try{
                return resolve(fetch("https://ethgasstation.info/api/ethgasAPI.json?")
                .then((response) => response.json())
                .then((data) => data.average * GWEI) );
            } catch(e){
                return reject(e);
            }
        })  
    }
    getGasLimit() {
        return GAS_LIMIT;
    }
}

module.exports = EthLib;
