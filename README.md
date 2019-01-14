# Lightning Decoder

> [https://lightningdecoder.com](https://lightningdecoder.com)

![Image of Lightning Decoder](https://i.imgur.com/tZKaU9P.png)

Lightning Decoder is a utility app that helps with understanding the individual parts of a Lightning Network Invoice/Payment Request (BOLT 11). It aims to be a tool for  developers building applications on top of the LN network.

## Installing & Developing

To run this application locally, simply clone the repo and run `yarn` or `npm install` to install all dependencies. You should then be able to run `yarn start` or `npm start` to spin up a local development server.

## Building for Production

To build the assets for production, use script `yarn build` or `npm run build`. A `/build` top-level folder will be created, hosting all of the necessary files and assets bundled for serving in production.

## Deployment

This application uses Now to handle deployment. You should modify the configuration in `now.json` to match your needs, and then run `now`. Now will pick up

## Analytics Configuration

You will note that there's a missing `ga.js` file inside of `/constants` folder. In order to bundle the application correctly, you need to create your own Google Analytics `GA_CODE` variable in a file called `ga.js`.

```js
// Google Analytics Constants
export const GA_CODE = 'UA-XXXXXXX-X';
```

## Contributions

I'm always aiming to introduce new features and improvements to the application. If you see a need and would like to contribute, please send a PR with detailed descriptions and I'll evaluate as early as I can.

MIT Licensed 2019
