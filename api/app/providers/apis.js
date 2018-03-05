import GooglGeoCoder from 'node-geocoder';
import GooglePlaces from 'googleplaces';
import config from '../config';
import {
  CURRENCY_BTC, CURRENCY_ETH, CURRENCY_USD, LANGUAGE_EN,
} from '../constants';
import request from 'request';
import logger from '../helpers/logger';
import {HttpNotFoundError} from '../helpers/errors';

class ApisProvider {
  async getPlaceByLatLng(user, language = LANGUAGE_EN) {

    if (!user.lat || !user.lng) return;

    const options = {
      provider: 'google',
      httpAdapter: 'https',
      apiKey: config.google.key,
      formatter: null,
    };
    const geocoder = GooglGeoCoder(options);

    return new Promise((resolve, reject) => {
      geocoder.reverse({address: user.lat, lon: user.lng},
        (error, response) => {
          if (error) {
            reject(error);
          } else {
            resolve(response);
          }
        });
    });
  }

  async getPlaceByString(user, language = LANGUAGE_EN) {

    if (!user.address) return;

    const options = {
      provider: 'google',
      httpAdapter: 'https',
      apiKey: config.google.key,
      formatter: null,
    };
    const geocoder = GooglGeoCoder(options);

    return new Promise((resolve, reject) => {
      geocoder.geocode(user.address, (error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });
    });
  }

  async googleAutoComplete(user) {
    if (!user.address) return;
    const googleApi = new GooglePlaces(config.google.key, 'json');
    return new Promise((resolve, reject) => {
      googleApi.placeAutocomplete({input: user.address, types: '(cities)'},
        function(error, response) {
          if (error) {
            reject(error);
          } else {
            resolve(response);
          }
        });
    });
  }

  async getExchangeRate(cryptoCurrency, exchangeCurrency) {

    const mapToCoinMarketValue = () => {
      switch (cryptoCurrency) {
        case CURRENCY_ETH:
          return 'ethereum';
          break;
        case CURRENCY_BTC:
          return 'bitcoin';
          break;
        default:
          throw new HttpNotFoundError();
      }
    };

    const getUrl = () => `https://api.coinmarketcap.com/v1/ticker/${mapToCoinMarketValue(
      cryptoCurrency)}/?convert=${exchangeCurrency}`;

    return new Promise((resolve, reject) => {
      request.get({
          url: getUrl(),
          headers: {
            'Content-Type': 'application/json',
          },
        }, (error, response, body) => {
          logger.info('error', error);
          logger.info('body', body);
          try {
            const data = JSON.parse(body)[0];
            resolve({
              [exchangeCurrency]: data[`price_${exchangeCurrency.toLowerCase()}`],
              [CURRENCY_USD]: data[`price_${CURRENCY_USD.toLowerCase()}`],
              [CURRENCY_BTC]: data[`price_${CURRENCY_BTC.toLowerCase()}`],
            });
          } catch (e) {
            logger.info(e);
          }
          reject();
        },
      );
    });
  }

}

export default new ApisProvider();
