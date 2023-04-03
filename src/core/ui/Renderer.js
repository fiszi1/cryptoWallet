class Renderer {
    
    constructor(app) {
        this.app = app;
    }

    renderCurrency() {
        let elements = document.getElementsByClassName("currency_symbol");
        for(var i=0; i < elements.length; i++) {
            let element = elements[i];
            element.innerHTML = this.app.getCurrency();
        }
     }
 
     renderBalance() {
         let element = document.getElementById("balance");
         this.app.getCurrentBalance().then((balance) => {
             element.innerHTML = balance;  
         });
     }

     renderAddress() {
        let element = document.getElementById("address");
        this.app.getAddress().then((address)=>{
            element.innerHTML = address;
        })
        
     }

     renderUi() {
        this.renderCurrency();
        this.renderBalance();
        this.renderAddress();
    }
}

module.exports = Renderer;