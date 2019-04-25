const EmailDispatcher = require('./EmailDispatcher');

class EventQueue
{
    constructor() {
        this.events = [];
        this.finished = [];
    }

    cleanup() {
        this.finished = [];
        return this;
    }

    push( event ) {
        this.events.push(event);
        return this;
    }

    get() {
        this.events.forEach(event => {
            if( event.getType() === 'email' ) {
                let ed = new EmailDispatcher(event);
                ed.when('done', (error) => {
                    if(!error) {
                        this.finished.push(event);
                    }
                    else {
                        console.warn(`Error`, error);
                    }
                })
            }
        });
    }
}

module.exports = EventQueue;