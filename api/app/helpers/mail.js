import fs from 'fs';
import Path from 'path';
import Handlebars from 'handlebars';
import NodeMailer from 'nodemailer';
import config from '../config';
import logger from './logger';
import translationHelper from './translationHelper';
import {LANGUAGE_EN} from '../constants';

class Mail {
  constructor() {
    this.transporter = NodeMailer.createTransport(config.mail.transport.config);
  }

  getTemplate(templateName, data) {
    const templatePath = Path.resolve(__dirname, `../emails/${data.language || LANGUAGE_EN}`, `${templateName}.html`);
    return Handlebars.compile(fs.readFileSync(templatePath, 'utf8'));
  }

  getLayoutTemplate() {
    return Handlebars.compile(fs.readFileSync(Path.resolve(__dirname, `../emails`, 'layout.html'), 'utf8'));
  }

  getHtml(templateName, data) {
    const layout = this.getLayoutTemplate();
    const template = this.getTemplate(templateName, {url: config.url, ...data});
    return layout({content: template(data)});
  }

  send(templateName, data, subjectTitle) { console.log(data);
    const subject = translationHelper(data.language, subjectTitle || templateName);
    const html = this.getHtml(templateName, {imgUrl: config.imgUrl + '/files', ...data});
    const fromToData = config.mail.transport.contact;
    fromToData.to = data.email;
    fromToData.attachments = [{
        filename: 'header-img.png',
        path: Path.resolve(__dirname, '../emails/img', 'header-img.png'),
        cid: 'header-img'
    }];
    this.transporter.sendMail({...fromToData, subject, html}, (...args) => {
      logger.info(args);
    });
  }

  sendVerifyInvestorEmail(data) {
    try {
      return this.send('verification-investor', data);
    } catch (e) {
      logger.info(e);
    }
  };

  sendRegistrationEmail(data) {
    try {
      return this.send('register', data);
    } catch (e) {
      logger.info(e);
    }
  };

  sendResetPasswordEmail(data) {
    try {
      return this.send('reset-password', data);
    }
    catch (e) {
      logger.info(e);
    }
  };

}

export default new Mail();