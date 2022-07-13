// Core Libs & Utils
import React, { PureComponent } from 'react';
import QrReader from 'react-qr-reader';
import cx from 'classnames';

// Assets
import boltImage from './assets/images/bolt.png';
import arrowImage from './assets/images/arrow.svg';
import closeImage from './assets/images/close.svg';
import qrcodeImage from './assets/images/qrcode.png';
import githubImage from './assets/images/github.svg';

// Utils
import { formatDetailsKey } from './utils/keys';
import { parseInvoice } from './utils/invoices';

// Constants
import {
  APP_NAME,
  APP_GITHUB,
  APP_TAGLINE,
  APP_SUBTAGLINE,
  APP_INPUT_PLACEHOLDER,
} from './constants/app';
import {
  TAGS_KEY,
  COMPLETE_KEY,
  LNURL_METADATA_KEY,
  TIMESTAMP_STRING_KEY,
  CALLBACK_KEY,
  LNURL_TAG_KEY,
} from './constants/keys';

// Styles
import './assets/styles/main.scss';

const INITIAL_STATE = {
  text: '',
  error: {},
  hasError: false,
  decodedInvoice: {},
  isLNAddress: false,
  isQRCodeOpened: false,
  isInvoiceLoaded: false,
  isBitcoinAddrOpened: false,
};

export class App extends PureComponent {
  state = INITIAL_STATE;

  componentDidMount() {
    const invoiceOnURLParam = window.location.pathname;

    // Remove first `/` from pathname
    const cleanInvoice = invoiceOnURLParam.split('/')[1];
    if (cleanInvoice && cleanInvoice !== '') {
      this.setState(() => ({ text: cleanInvoice }));
      this.getInvoiceDetails(cleanInvoice);
    }
  }

  clearInvoiceDetails = () => {
    // Reset URL address
    const currentOrigin = window.location.origin;
    window.history.pushState({}, null, `${currentOrigin}`);

    this.setState(() => ({
      ...INITIAL_STATE,
    }));
  };

  getInvoiceDetails = async (text) => {
    // If this returns null is because there is no invoice to parse
    if (!text) {
      return this.setState(() => ({
        hasError: true,
        decodedInvoice: {},
        isInvoiceLoaded: false,
        error: { message: 'Please enter a valid request or address and try again.'},
      }));
    }

    try {
      let response;
      const parsedInvoiceResponse = await parseInvoice(text);

      // If this returns null is because there is no invoice to parse
      if (!parsedInvoiceResponse) {
        return this.setState(() => ({
          hasError: true,
          decodedInvoice: {},
          isInvoiceLoaded: false,
          error: { message: 'Please enter a valid request or address and try again.'},
        }));
      }

      const { isLNURL, data, error, isLNAddress } = parsedInvoiceResponse;

      // If an error comes back from a nested operation in parsing it must
      // propagate back to the end user
      if (error && error.length > 0) {
        return this.setState(() => ({
          hasError: true,
          decodedInvoice: {},
          isInvoiceLoaded: false,
          error: { message: error },
        }));
      }

      // If data is null it means the parser could not understand the invoice
      if (!data) {
        return this.setState(() => ({
          hasError: true,
          decodedInvoice: {},
          isInvoiceLoaded: false,
          error: { message: 'Could not parse/understand this invoice or request. Please try again.'},
        }));
      }

      // Handle LNURLs differently
      if (isLNURL) {
        // If this is a Lightning Address, the contents have already been fetched
        if (isLNAddress) {
          response = data;
        } else {
          // Otherwise this is an LNURL ready to be fetched
          response = await data;
        }
      } else {
        // Handle normal invoices
        response = data;
      }

      if (response) {
        // On successful response, set the request content on the addressbar
        // if there isn't one already in there from before (user-entered)
        const currentUrl = window.location;
        const currentOrigin = window.location.origin;
        const currentPathname = window.location.pathname;
        const hasPathnameAlready = currentPathname && currentPathname !== '';

        // If there's a pathname already, we can just remove it and let the
        // new pathname be entered
        if (hasPathnameAlready) {
          window.history.pushState({}, null, `${currentOrigin}`);
        }

        window.history.pushState({}, null, `${currentUrl}${text}`);

        this.setState(() => ({
          isLNURL,
          error: {},
          isLNAddress,
          hasError: false,
          isInvoiceLoaded: true,
          decodedInvoice: response,
        }));
      }
    } catch(error) {
      this.setState(() => ({
        error: error,
        hasError: true,
        decodedInvoice: {},
        isInvoiceLoaded: false,
      }));
    }
  }

  handleChange = (event) => {
    const { target: { value: text } } = event;

    this.setState(() => ({
      text,
      error: {},
      hasError: false,
    }));
  }

  handleKeyPress = (event) => {
    const { text } = this.state;

    if (event.key === 'Enter') {
      this.getInvoiceDetails(text);
    }
  }

  handleQRCode = () => this.setState(prevState => ({
    isQRCodeOpened: !prevState.isQRCodeOpened
  }))

  renderErrorDetails = () => {
    const { hasError, error } = this.state;

    if (!hasError) return null;

    return (
      <div className='error'>
        <div className='error__container'>
          <div className='error__message'>
            {error.message}
          </div>
        </div>
      </div>
    );
  }

  renderInput = () => {
    const { text } = this.state;

    return (
      <div className='input'>
        <img
          alt='Lightning'
          src={boltImage}
          className='input__asset'
        />
        <input
          value={text}
          className='input__text'
          onChange={this.handleChange}
          onKeyPress={this.handleKeyPress}
          placeholder={APP_INPUT_PLACEHOLDER}
          autoFocus
        />
      </div>
    );
  }

  renderInvoiceDetails = () => {
    const { decodedInvoice, isInvoiceLoaded } = this.state;
    const invoiceContainerClassnames = cx(
      'invoice',
      { 'invoice--opened': isInvoiceLoaded },
    );

    const invoiceDetails = Object.keys(decodedInvoice)
      .map((key) => {
        switch (key) {
          case COMPLETE_KEY:
            return null;
          case TAGS_KEY:
            return this.renderInvoiceInnerItem(key);
          case TIMESTAMP_STRING_KEY:
            return this.renderInvoiceItem(
              key,
              TIMESTAMP_STRING_KEY,
            );
          default:
            return this.renderInvoiceItem(key);
        }
      });

    return !isInvoiceLoaded ? null : (
      <div className={invoiceContainerClassnames}>
        {invoiceDetails}
      </div>
    );
  }

  renderInvoiceInnerItem = (key) => {
    const { decodedInvoice } = this.state;
    const tags = decodedInvoice[key];

    const renderTag = (tag) => (
      typeof tag.data !== 'string' &&
      typeof tag.data !== 'number'
    ) ? renderNestedTag(tag) : renderNormalTag(tag);

    const renderNestedItem = (label, value) => (
      <div
        key={label}
        className='invoice__nested-item'
      >
        <div className='invoice__nested-title'>
          {formatDetailsKey(label)}
        </div>
        <div className='invoice__nested-value'>
          {value}
        </div>
      </div>
    );

    const renderNestedTag = (tag) => (
      <div key={tag.tagName} className='invoice__item invoice__item--nested'>
        <div className='invoice__item-title'>
          {formatDetailsKey(tag.tagName)}
        </div>
        <div className='invoice__item-value invoice__item-value--nested'>
          {/* Strings */}
          {typeof tag.data === 'string' && (
            <div className='invoice__nested-value'>
              {tag.data}
            </div>
          )}
          {/* Array of Objects */}
          {Array.isArray(tag.data) && tag.data.map((item) => (
            <>
              {Object.keys(item).map((label) => renderNestedItem(label, item[label]))}
            </>
          ))}
          {/* Objects */}
          {(
            !Array.isArray(tag.data) && (
              (typeof tag.data !== 'string') || (typeof tag.data !== 'number'))
            ) && (
            <>
              {Object.keys(tag.data).map((label) => renderNestedItem(label, tag.data[label]))}
            </>
          )}
        </div>
      </div>
    );

    const renderNormalTag = (tag) => (
      <div key={tag.tagName} className='invoice__item'>
        <div className='invoice__item-title'>
          {formatDetailsKey(tag.tagName)}
        </div>
        <div className='invoice__item-value'>
          {`${tag.data || '--'}`}
        </div>
      </div>
    )

    return tags.map((tag) => renderTag(tag));
  }

  renderInvoiceItem = (key, valuePropFormat) => {
    const { decodedInvoice } = this.state;

    let value = `${decodedInvoice[key]}`;
    if (
      valuePropFormat &&
      valuePropFormat === TIMESTAMP_STRING_KEY
    ) {
      // TODO: this breaks
      // value = `${formatTimestamp(decodedInvoice[key])}`;
    }

    return (
      <div
        key={key}
        className='invoice__item'
      >
        <div className='invoice__item-title'>
          {formatDetailsKey(key)}
        </div>
        <div className='invoice__item-value'>
          {value}
        </div>
      </div>
    );
  }

  renderLogo = () => (
    <div className='logo'>
      <div className='logo__title'>
        {APP_NAME}
      </div>
      <div className='logo__subtitle'>
        {APP_TAGLINE}
        <span className="logo__subtitle-small">{APP_SUBTAGLINE}</span>
      </div>
    </div>
  );

  renderLNURLDetails = () => {
    const { decodedInvoice, isInvoiceLoaded } = this.state;
    const invoiceContainerClassnames = cx(
      'invoice',
      { 'invoice--opened': isInvoiceLoaded },
    );

    let requestContents = decodedInvoice;

    return !isInvoiceLoaded ? null : (
      <div className={invoiceContainerClassnames}>
        {Object.keys(requestContents).map((key) => {
          let text = decodedInvoice[key];

          if (key === 'status') {
            return <></>
          }

          if (key === 'payerData') {
            return <></>
          }

          if (key === LNURL_TAG_KEY) {
            switch (key) {
              case 'payRequest':
                text = 'LNURL Pay (payRequest)'
                break;
              case 'withdrawRequest':
                text = 'LNURL Withdraw (withdrawRequest)'
                break;
              default:
                break;
            }

            return (
              <div key={`${key}-${Math.random()}`} className='invoice__item'>
                <div className='invoice__item-title'>
                  {formatDetailsKey(key)}
                </div>
                <div className='invoice__item-value'>
                  <a href={decodedInvoice[key]}>
                    {text}
                  </a>
                </div>
              </div>
            )
          }

          if (key === CALLBACK_KEY) {
            return (
              <>
              <div key={`${key}-${Math.random()}`} className='invoice__item'>
                <div className='invoice__item-title'>
                  {formatDetailsKey(key)}
                </div>
                <div className='invoice__item-value'>
                  <a href={decodedInvoice[key]}>
                    {decodedInvoice[key]}
                  </a>
                </div>
              </div>

              {decodedInvoice[`minSendable`] ? <div key={`${key}-${Math.random()}`} className='invoice__item'>
                <div className='invoice__item-title'>
                  Sample Invoice
                </div>
                <div className='invoice__item-value'>
                  <a href={`${decodedInvoice[key]}?amount=${decodedInvoice[`minSendable`]}`}>
                    {decodedInvoice[key]}?amount={decodedInvoice[`minSendable`]}
                  </a>
                </div>
              </div> : null}

              </>
            )
          }

          if (key === LNURL_METADATA_KEY) {
            const splitMetadata = JSON.parse(decodedInvoice[key]);

            // eslint-disable-next-line array-callback-return
            const toRender = splitMetadata.map((arrOfData) => {
              if (arrOfData[0] === 'text/plain') {
                return (
                  <div key={`${key}-${Math.random()}`} className='invoice__item'>
                    <div className='invoice__item-title'>
                      Description
                    </div>
                    <div className='invoice__item-value'>
                      {arrOfData[1]}
                    </div>
                  </div>
                )
              }

              if (arrOfData[0] === 'text/identifier') {
                return (
                  <div key={`${key}-${Math.random()}`} className='invoice__item'>
                    <div className='invoice__item-title'>
                      Lightning Address
                    </div>
                    <div className='invoice__item-value'>
                      {arrOfData[1]}
                    </div>
                  </div>
                )
              }

              if (arrOfData[0] === 'image/png;base64') {
                return (
                  <div key={`${key}-${Math.random()}`} className='invoice__item'>
                    <div className='invoice__item-title'>
                      Image
                    </div>
                    <div className='invoice__item-value'>
                      <img
                        alt='Imager'
                        style={{ maxWidth: '200px' }}
                        src={`data:image/png;base64,${arrOfData[1]}`}
                      />
                    </div>
                  </div>
                );
              }
            });

            return toRender;
          }

          return (
            <div key={`${key}-${Math.random()}`} className='invoice__item'>
              <div className='invoice__item-title'>
                {formatDetailsKey(key)}
              </div>
              <div className='invoice__item-value'>
                {decodedInvoice[key]}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  renderSubmit = () => {
    const { isInvoiceLoaded, text } = this.state;
    const submitClassnames = cx(
      'submit',
      { 'submit__close': isInvoiceLoaded },
    );

    const onClick = () => {
      if (isInvoiceLoaded) {
        this.clearInvoiceDetails();
      } else {
        this.getInvoiceDetails(text);
      }
    }

    return (
      <div
        onClick={onClick}
        className={submitClassnames}
      >
        <img
          alt='Submit'
          src={isInvoiceLoaded ? closeImage : arrowImage}
          className='submit__asset'
        />
      </div>
    );
  }

  renderOptions = () => {
    const { isInvoiceLoaded } = this.state;
    const optionsClassnames = cx(
      'options',
      { 'options--hide': isInvoiceLoaded },
    );

    return (
      <div className={optionsClassnames}>
        <div className='options__wrapper'>
          <a
            href={APP_GITHUB}
            className='options__github'
            target='_blank'
            rel='noopener noreferrer'
          >
            <img
              className='options__github-icon'
              src={githubImage}
              alt='GitHub'
            />
          </a>
        </div>
      </div>
    );
  }

  renderCamera = () => {
    const { isQRCodeOpened, isInvoiceLoaded } = this.state;

    const styleQRWrapper = cx({
      'qrcode' : true,
      'qrcode--opened': isQRCodeOpened,
    });
    const styleQRContainer = cx(
      'qrcode__container',
      { 'qrcode__container--opened': isQRCodeOpened },
    );
    const styleImgQR = cx(
      'qrcode__img',
      { 'qrcode__img--opened': isQRCodeOpened },
    );

    const qrReaderStyles = {
      width: '100%',
      border: '2pt solid #000000',
    };

    const srcImage = isQRCodeOpened ? closeImage : qrcodeImage;

    const handleScan = (value) => {
      if (Object.is(value, null)) return;

      let text = value;
      if (value.includes('lightning')) {
        text = value.split('lightning:')[1];
      }

      this.getInvoiceDetails(text);
      this.setState(() => ({
        isQRCodeOpened: false,
        text,
      }));
    }

    const handleError = (error) => this.setState(() => ({
      isInvoiceLoaded: false,
      hasError: true,
      error,
      isQRCodeOpened: false
    }));

    return isInvoiceLoaded ? null : (
      <div className={styleQRWrapper}>
        {isQRCodeOpened && (
          <div className='qrcode__modal' />
        )}
        <div className={styleQRContainer}>
          <img
            className={styleImgQR}
            src={srcImage}
            alt='QRCode'
            onClick={this.handleQRCode}
          />
          {!isQRCodeOpened ? null : (
            <QrReader
              delay={300}
              onError={handleError}
              onScan={handleScan}
              style={qrReaderStyles}
            />
          )}
        </div>
      </div>
    );
  }

  render() {
    const { isLNURL, isInvoiceLoaded, hasError } = this.state;

    const appClasses = cx(
      'app',
      { 'app--opened': isInvoiceLoaded },
    );
    const appColumnClasses = cx(
      'app__column',
      {
        'app__column--invoice-loaded': isInvoiceLoaded,
        'app__column--error': hasError,
      },
    );
    const appSubmitClasses = cx(
      'app__submit',
      { 'app__submit--invoice-loaded': isInvoiceLoaded },
    );

    return (
      <div className={appClasses}>
        {this.renderOptions()}
        {this.renderLogo()}
        <div className='app__row'>
          {this.renderInput()}
          <div className={appSubmitClasses}>
            {this.renderSubmit()}
            {this.renderCamera()}
          </div>
        </div>
        <div className={appColumnClasses}>
          {isLNURL ? this.renderLNURLDetails() : this.renderInvoiceDetails()}
          {this.renderErrorDetails()}
        </div>
      </div>
    );
  }
}
