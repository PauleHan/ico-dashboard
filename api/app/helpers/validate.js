import Joi from "joi";
import ReCaptcha from "recaptcha2";
import appConfig from '../config/constants';

export const validateFields = async (req, res, next) => {
    let err = {};
    
    if (!req.body.full_name) {
        Object.assign(err, {'full_name': 'Full name cannot be blank'});
    }
    
    if (!req.body.email) {
        Object.assign(err, {'email': 'Email cannot be blank'});
    }
    
    if (!req.body.password) {
        Object.assign(err, {'password': 'Password cannot be blank'});
    }
    
    if (!req.body.service_terms || !req.body.token_sale_conditions) {
        Object.assign(err, {'checkboxes': 'Please agree to the ToS and Token Sale Conditions'});
    }
    
    if (req.body.password && req.body.password.length < 6) {
        Object.assign(err, {'password': 'Min password length are 6 characters'});
    }
    
    if (req.body.password !== req.body.password_repeat) {
        Object.assign(err, {'password_repeat': 'Password mismatch'});
    }
    
    if (req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
        Object.assign(err, {'recaptcha': 'Captcha is required'});
    } else {
        try {
            const result = await recaptcha(req.body['g-recaptcha-response']);
            if (!result) {
                Object.assign(err, {'recaptcha': 'Captcha you entered is wrong or expired'});
            }
        } catch (e) {
            Object.assign(err, {'recaptcha': 'Captcha you entered is wrong or expired'});
        }
    }
    
    return err;
}

const recaptcha = async (key) => {
  const r = new ReCaptcha({
    siteKey: appConfig.google.recaptcha.publicKey,
    secretKey: appConfig.google.recaptcha.privateKey
  });
  return new Promise((resolve, reject) => { 
    r.validate(key).then(resolve).catch(reject);
  })
};