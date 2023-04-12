const WalletAddressValidator = require('wallet-address-validator');
const AbstractCurrencyValidator = require("./AbstractCurrencyValidator");

const BTC = "BTC";

class BtcValidator extends AbstractCurrencyValidator{
    validateAddress(address){
        this.validateString(address,"BTC Address");
        WalletAddressValidator.validate(address,BTC);
    };
}

module.exports = BtcValidator;