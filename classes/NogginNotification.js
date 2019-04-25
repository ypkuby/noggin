class NogginNotification
{
    constructor( type, to, details, template ) {
        this.type = '';
        this.to = '';
        this.details = {};
        this.template = '';
        this.setType(type);
        this.setTo(to);
        this.setDetails(details);
        this.setTemplate(template);
    }

    getType() {
        return this.type;
    }

    setType(type = '') {
        this.type = type;
        return this;
    }

    getTo() {
        return this.to;
    }

    setTo(to = '') {
        this.to = to;
        return this;
    }

    getDetails() {
        return this.details;
    }

    setDetails(details = {}) {
        this.details = details;
        return this;
    }

    getTemplate() {
        return this.template;
    }

    setTemplate(template = '') {
        this.template = template;
        return this;
    }

}

module.exports = NogginNotification;