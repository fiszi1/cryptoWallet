import "./styles/styles.css";

const CURRENCY = "ETH";
const WalletUi = require('./core/ui/WalletUi');
const BlockchainService = require("./core/blockchain/BlockchainService");
const HttpService = require('/src/core/services/HttpService');

class Application {

    constructor() {
        this.setCurrency(CURRENCY);
        this.httpService = new HttpService(this);
        this.walletUi = new WalletUi(this);
        this.blockchain = new BlockchainService(this);
    }

    prepareUi() {
        this.walletUi.prepareUi();
    }

    changeCurrency(currency){
        this.setCurrency(currency);
        this.prepareUi();
    }

    getCurrency(){
        return this.currency;
    }

    
    setCurrency(currency){
        this.currency = currency;
    }


    getAddress() {
        return new Promise(async (resolve, reject)=>{
            try{
                let address = await this.blockchain.getAddress();
                return resolve(address);
            } catch(e){
                return reject(e);
            }
        })  
    }

    getCurrentBalance(){
        return new Promise(async(resolve,reject)=>{
            try{
                let balance =await this.blockchain.getCurrentBalance();
                return resolve(balance);
            }catch (e){
                return reject(e);
            }
        })
    }


    sendCurrency(to, amount) {
        return new Promise(async (resolve, reject)=>{
            try{
                let result = await this.blockchain.sendCurrency(to, amount);
                return resolve(result);
            } catch(e){
                return reject(e);
            }
        })  
    }

    generateMnemonic(){
        return new Promise(async(resolve,reject)=>{
            try{
                let result =await this.blockchain.generateMnemonic();
                return resolve(result);
            }catch (e){
                return reject(e);
            }
        })
    }

    importMnemonic(mnemonic){
        return new Promise(async(resolve,reject)=>{
            try{
                let result =await this.blockchain.importMnemonic(mnemonic);
                app.prepareUi();
                return resolve(result);
            }catch (e){
                return reject(e);
            }
        })
    }

}

const app = new Application();
// app.prepareUi();

alert("Please insert mnemonic");