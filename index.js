const Alexa = require('alexa-sdk');
const fetch = require('node-fetch');

const APP_ID = undefined;
const languageStrings = {
  'en': {
    translation: {
      SKILL_NAME: 'Deep Onion',
      HELP_MESSAGE: 'You can say tell me the deep onion price, or, you can say exit... What can I help you with?',
      HELP_REPROMPT: 'What can I help you with?',
      GET_PRICE_MESSAGE: 'The current price of Deep Onion is ',
      GET_VOLUME_MESSAGE: 'The current 24 hour volume for Deep Onion is ',
      STOP_MESSAGE: 'Goodbye!',
    },
  }
};

/**
 * getDeepOnionDataFromApi
 * fetch the current deep onion
 * price from coinmarketcap
 * @return {String}
 */
 const getDeepOnionDataFromApi = function (keyToFetch) {
  return fetch('https://api.coinmarketcap.com/v1/ticker/deeponion/')
    .then(response => response.json())
    .then(data => Math.round(data[0][`${keyToFetch}`] * 100) / 100)
    .catch(error => error);
 }

/**
 * Alexa handlers
 * @type {Object}
 */
const handlers = {
  'LaunchRequest': function () {
    this.emit('GetCurrentPrice');
  },
  'Unhandled': function () {
    this.emit('HELP_REPROMPT')
  },
  'CurrentPrice': function () {
    this.emit('GetCurrentPrice');
  },
  'CurrentVolume': function () {
    this.emit('GetCurrentVolume');
  },
  'GetCurrentPrice': function () {
    getDeepOnionDataFromApi('price_usd')
      .then(price => this.emit(':tellWithCard', `${this.t('GET_PRICE_MESSAGE')} ${price} dollars`, this.t('SKILL_NAME'), price));
  },
  'GetCurrentVolume': function () {
    getDeepOnionDataFromApi('24h_volume_usd')
      .then(volume => this.emit(':tellWithCard', `${this.t('GET_VOLUME_MESSAGE')} ${volume} dollars`, this.t('SKILL_NAME'), volume));
  },
  'AMAZON.HelpIntent': function () {
    const speechOutput = this.t('HELP_MESSAGE');
    const rePromptMessage = this.t('HELP_MESSAGE');

    this.emit(':ask', speechOutput, rePromptMessage);
  },
  'AMAZON.CancelIntent': function () {
    this.emit(':tell', this.t('STOP_MESSAGE'));
  },
  'AMAZON.StopIntent': function () {
    this.emit(':tell', this.t('STOP_MESSAGE'));
  }
};

exports.handler = function (event, context) {
  const alexa = Alexa.handler(event, context);

  alexa.APP_ID = APP_ID;
  alexa.resources = languageStrings;

  alexa.registerHandlers(handlers);
  alexa.execute();
};
