const express = require('express');
const bodyParser = require('body-parser');
const routes = require('../config/Routes');
const EventQueue = require('./EventQueue');
const port = process.env.PORT || 9987;

class ServerHandler {
    constructor() {
        this.express = new express();
        this.express.use(bodyParser.json({ urlencoded: true }));
        this.queue = new EventQueue();
        this.init();
    }

    init() {
        routes(this.express, this.queue);
        this.up();
    }

    up() {
        this.express.listen(port, () => console.log(`Up on *:${port}`));
    }
}

module.exports = ServerHandler;