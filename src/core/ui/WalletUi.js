const Renderer = require("./Renderer");
const EventSetter = require("./EventSetter");


class WalletUi {

    constructor(app) {
        this.app = app;
        this.renderer = new Renderer(app);
        this.eventSetter = new EventSetter(app);
        this.eventSetter.setEventListeners();
    }

    prepareUi() {
        this.renderer.renderUi();
    }

}

module.exports = WalletUi;