const NogginNotification = require('../classes/NogginNotification');
module.exports = (router, queue) => {
    router.get('/', (req, res) => {
        res.status(200).send('Notification Server');
    });
    router.get('/_/admin/handle', (req, res) => {
        // TODO: validate origin IP is localhost/internal IPv4 address
        queue.get();
        res.sendStatus(200);
    });
    router.post('/notifications/email/dispatch', (req, res) => {
        let to = req.body.to;
        let details = req.body.details;
        let template = req.body.template;
        let event = new NogginNotification( `email`, to, details, template );
        queue.push( event );
        res.sendStatus(200);
    });
};