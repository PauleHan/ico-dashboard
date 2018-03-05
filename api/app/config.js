import {config} from "dotenv";
import path from "path";

const { name, version } = require('../package.json');
config();

const env = process.env.NODE_ENV;
const conf = {
  name, version, env,
  baseRoute: '/api',
  url: process.env.URL,
  filesDir: process.env.FILES_SAVE_PATH,
  filesPublicDir: process.env.FILES_PUBLIC_PATH,
  db: {
    uri: process.env.DB_URI,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS
  },
  cors: {},
  morgan: {
    format: 'dev',
    options: {
      skip: () => env === 'test'
    }
  },
  google: {
    key: process.env.GOOGLE_API_KEY,
    recaptcha: {
      privateKey: process.env.GOOGLE_RECAPTCHA_PRIVATE_KEY,
      publicKey: process.env.GOOGLE_RECAPTCHA_PUBLIC_KEY
    },
  },
  captcha:{
    expireTime: process.env.CAPTCHA_TTL
  },
  joi: {
    abortEarly: false,
    allowUnknown: true,
    noDefaults: true
  },
  web3: {
    httpProvider: process.env.WEB3_HTTP_PROVIDER,
    httpProviderScan: process.env.WEB3_HTTP_PROVIDER_SCAN,
    waitDelay: 1000,
    gas: parseInt(process.env.GAS_VALUE, 10) || 90000
  },
  cron: {
    socket: {
      host: 'http://localhost',
      port: '3000'
    },
  },
  contracts: {
    ModuleTradeProposals: process.env.CONTRACT_MODULE_TRADE_PROPOSALS,
    MTRCToken: process.env.CONTRACT_MTRC_TOKEN,
    ModultradeStorage: process.env.CONTRACT_MODULE_TRADE_STORAGE,
    Modultrade: process.env.CONTRACT_MODULE_TRADE
  },
  oracle: {
    account: process.env.ORACLE_WALLET_ADDRESS,
    pk: process.env.ORACLE_WALLET_PK
  },
  fee: {
    account: process.env.FEE_WALLET_ADDRESS
  },
  mail: {
    emergencyEmails: 'andrii.lytvynov@nordwhale.com,alexey.kosinski@nordwhale.com',
    transport: null,
    production: {
      config: {
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: false, // use SSL
        tls: { ciphers: 'SSLv3' },
        auth: {
          user: process.env.MAIL_LOGIN,
          pass: process.env.MAIL_PASS
        }
      },
      contact: {
        from: process.env.MAIL_LOGIN
      }
    },
    development: {
      config: {
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: true, // use SSL
        auth: {
          user: process.env.MAIL_LOGIN,
          pass: process.env.MAIL_PASS
        }
      },
      contact: {
        from: process.env.MAIL_LOGIN
      }
    }
  }
};
conf.mail.transport = env === 'prod' ? conf.mail.production : conf.mail.development;
export default conf;
