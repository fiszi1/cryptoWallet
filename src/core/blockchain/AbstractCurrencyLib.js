const Validator = require('/src/core/validators/Validator');
const staticValidator = new Validator();

class AbstractCurrencyLib{
    constructor(app, provider,validator,converter) {
        staticValidator.validateObject(provider,"provider");
        staticValidator.validateObject(validator,"validator");
        staticValidator.validateObject(converter,"converter");
        this.app = app;
        this.provider = provider;
        this.validator = validator;
        this.converter = converter;
    }

    getAddress(){
        return new Promise(async(resolve,reject)=>{
            try{
                let address = await this.getCredentials().getAddress();
                console.log("AbstractCurrencyLib getAddress",address)
                return resolve(address);
        }catch(e){
                return reject(e);
            }
        })
    };

    getCredentials(){
        return this.app.blockchain.credentials;
    }

    getPrivateKey(){
        return new Promise(async(resolve,reject)=>{
            try{
                let privKey = await this.getCredentials().getPrivateKey();
                console.log("AbstractCurrencyLib privKey",privKey)
                return resolve(privKey);
            }catch(e){
                return reject(e);
            }
        })
    }

    getCurrentBalance(){
        return new Promise(async(resolve,reject)=>{
            try{
                console.log("Abstract getCurrentBalance start");
                let address = await this.getAddress();
                console.log("Abstract getCurrentBalance middle",address);
                let balance =await this.getBalance(address);
                console.log("Abstract getCurrentBalance end",balance);
                return resolve(balance);
            }catch (e){
                return reject(e);
            }
        })
    }
    getBalance(address){
        return new Promise(async(resolve,reject)=>{
            try{
                throw("getBalance() not implemented")
            }catch (e){
                return reject(e);
            }
        })
    }

    sendCurrency(to,amount){
        return new Promise(async(resolve,reject)=>{
            try{
                throw("sendCurrency() not implemented")
            }catch (e){
                return reject(e);
            }
        });
    }

    toDecimals(amount){
        return this.converter.toDecimals(amount);
    }
    fromDecimals(amount){
        return this.converter.fromDecimals(amount);
    }
}

module.exports = AbstractCurrencyLib;