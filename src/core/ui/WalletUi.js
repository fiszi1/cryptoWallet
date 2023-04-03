const Renderer = require("./Renderer");
const EventSetter = require("./EventSetter");


class WalletUi {

    constructor(app) {
        this.app = app;
        this.renderer = new Renderer(app);
        this.eventSetter = new EventSetter(app);
    }

    prepareUi() {
        this.renderer.renderUi();
        this.eventSetter.setEventListeners();
    }

}

module.exports = WalletUi;