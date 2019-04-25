const path = require('path');
const fs = require('fs');
const UserEmailConfig = require(path.join(process.cwd(), '/config/email.js'));
const Handlebars = require('handlebars');
const nodemailer = require('nodemailer');

class EmailDispatcher
{
    constructor(event) {
        this.listeners = [];
        this.errors = false;

        this.manage(event);
    }

    when(event, closure) {
        this.listeners.push({ event, closure });
    }

    manage(event) {
        if(typeof UserEmailConfig === 'undefined' || null === UserEmailConfig) {
            this.errors = true;
            this.run();
            return;
        }
        let tpl = event.getTemplate();
        let pwd = process.cwd();
        let templates_folder = path.join(pwd, '/templates/');
        let template = path.join(templates_folder, `/${tpl}.html`);
        fs.access(template, (error) => {
            if(!error) {
                this.sendEmail( event, template );
                return;
            }
            this.errors = true;
            this.run();
        });
    }

    sendEmail( event, template_path ) {
        let to = event.getTo();
        let details = event.getDetails();
        fs.readFile(template_path, (err, data) => {
            if(err) {
                this.errors = true;
                this.run('done');
                return;
            }
            let template = EmailDispatcher.compileTemplate(data, details);
            this.writeEmail(to, template, details.subject || '');
        });
    }

    writeEmail(to, contents, subject) {
        let transporter = nodemailer.createTransport({
            host: UserEmailConfig.host,
            port: UserEmailConfig.port || 587,
            secure: UserEmailConfig.secure || false,
            auth: {
                user: UserEmailConfig.user,
                pass: UserEmailConfig.pass
            }
        });

        transporter.sendMail({
            from: UserEmailConfig.from,
            to,
            subject,
            html: contents,
            text: contents
        });

        this.run('done');
    }

    static compileTemplate(data, details) {
        return Handlebars.compile(data, details);
    }

    hasErrors() {
        if(this.errors) {
            return true;
        }
        return undefined;
    }

    run(event = 'done') {
        this.listeners.forEach(listener => {
            if(event === listener.event) {
                listener.closure(this.hasErrors());
            }
        });
    }
}

module.exports = EmailDispatcher;