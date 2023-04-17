const Web3 = require("web3");
const Transaction = require('ethereumjs-tx');
const EthConverter = require("/src/core/helpers/EthConverter");
const Validator = require("/src/core/validators/blockchain/EthValidator");
const AbstractCurrencyLib = require('/src/core/blockchain/AbstractCurrencyLib')

const PROVIDER_URL = process.env.PROVIDER_URL;
// let address = process.env.ETH_ADDRESS;
// let privateKey = process.env.ETH_PRIVKEY;

const GAS_LIMIT = 21000;
const GWEI = 10**9;

class EthLib extends AbstractCurrencyLib {  

    constructor(app) {
        let web3 = new Web3(new Web3.providers.HttpProvider(PROVIDER_URL));
        let converter = new EthConverter();
        let validator = new Validator();
        super(app, web3,validator,converter);
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
                let balance = await this.provider.eth.getBalance(address);
                balance = this.provider.utils.fromWei(balance);
                return resolve(balance);
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

    sendCurrency(to, amount){
        return new Promise(async(resolve, reject)=>{
            try{
                this.validator.validateAddress(to,"Tx Receiver");
                this.validator.validateNumber(amount,"sendCurrency amount");
                let txData = await this._formatTransactionParams(to,amount);
                let hash = await this._makeTransaction(txData);
                return resolve(hash);
            } catch(e) {
                reject(e);
            }
        })
    }

    _formatTransactionParams(to,value,data=""){
        return new Promise(async(resolve,reject)=>{
            try{
                this.validator.validateAddress(to);
                this.validator.validateNumber(value);
                this.validator.validateString(data);

                let privateKey = await this.getPrivateKey();
                this.validator.validateString(privateKey);

                let privKeyBuffer=Buffer.from(privateKey,'hex');
                let from = await this.getAddress();
                let nonce = await this.getNextNonce();
                this.validator.validateAddress(from);
                this.validator.validateNumber(nonce);

                let gasPrice = this.getGasPrice();
                this.validator.validateNumber(gasPrice);

                let gasLimit = this.getGasLimit();
                this.validator.validateNumber(gasLimit);

                value = this.fromDecimals(value);
                let txParams = {
                    "from":from,
                    "to":to,
                    "privateKey":privKeyBuffer,
                    "value":this.provider.utils.numberToHex(value),
                    "gasPrice":this.provider.utils.numberToHex(gasPrice),
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
                let nonce =await this.provider.eth.getTransactionCount(address);
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
                var raw = "0x"+tx.serialize().toString('hex');

                this.provider.eth.sendSignedTransaction(raw).on("receipt",(data)=>{
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
