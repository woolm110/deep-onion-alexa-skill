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
const getDeepOnionDataFromApi = function () {
  return fetch('https://api.coinmarketcap.com/v1/ticker/deeponion/')
    .then(response => response.json())
    .then(data => data)
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
  'getDeepOnionCurrentPrice': function () {
    this.emit('GetCurrentPrice');
  },
  'GetCurrentPrice': function () {
    getDeepOnionDataFromApi().then(data => {
      const currentPrice = `${Math.round(data[0].price_usd * 100) / 100} dollars`;
      const speechOutput = this.t('GET_PRICE_MESSAGE') + currentPrice;

      this.emit(':tellWithCard', speechOutput, this.t('SKILL_NAME'), currentPrice);
    });
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
