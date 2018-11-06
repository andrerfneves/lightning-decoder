// Core Libs & Utils
import React, { PureComponent } from 'react';
import cx from 'classnames';
import LightningPayReq from './lib/bolt11';
import { formatDetailsKey } from './utils/keys';
import { formatTimestamp } from './utils/timestamp';

// Styles
import './assets/styles/main.scss';

// Assets
import arrowImage from './assets/images/arrow.svg';
import closeImage from './assets/images/close.svg';
import boltImage from './assets/images/bolt.png';

// Constants
import {
  APP_NAME,
  APP_TAGLINE,
  APP_INPUT_PLACEHOLDER,
} from './constants/app';
import {
  TAGS_KEY,
  TIMESTAMP_KEY,
  WORDS_TEMP_KEY,
  TIMESTAMP_STRING_KEY,
} from './constants/keys';

const INITIAL_STATE = {
  decodedInvoice: {},
  error: {},
  hasError: false,
  isInvoiceLoaded: false,
  text: '',
};

class App extends PureComponent {
  state = INITIAL_STATE;

  clearInvoiceDetails = () => this.setState(() => ({
    ...INITIAL_STATE,
  }));

  getInvoiceDetails = (text) => this.setState(() => {
    try {
      const decodedInvoice = LightningPayReq.decode(text);

      return {
        decodedInvoice,
        isInvoiceLoaded: true,
        hasError: false,
        error: {},
      };
    } catch (error) {
      return {
        isInvoiceLoaded: false,
        hasError: true,
        error,
      };
    }
  });

  handleChange = (event) => {
    const { target: { value: text } } = event;
    this.setState(() => ({ text }));
  }

  handleKeyPress = (event) => {
    const { text } = this.state;
    if (event.key === 'Enter') this.getInvoiceDetails(text);
  }

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
        <div
          className='error__clear'
          onClick={this.clearInvoiceDetails}
        >
          <img
            alt='Clear'
            src={closeImage}
            className='error__clear-asset'
          />
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
        />
      </div>
    );
  }

  renderInvoiceDetails = () => {
    const { decodedInvoice, isInvoiceLoaded } = this.state;
    const invoiceContainerClassnames = cx({
      'invoice': true,
      'invoice--opened': isInvoiceLoaded,
    });

    const invoiceDetails = Object.keys(decodedInvoice)
      .map((key) => {
        switch (key) {
          case WORDS_TEMP_KEY:
          case TIMESTAMP_KEY:
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

    return (
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

    const renderNestedTag = (tag) => (
      <div className='invoice__item invoice__item--nested'>
        <div className='invoice__item-title'>
          {formatDetailsKey(tag.tagName)}
        </div>
        <div className='invoice__item-value invoice__item-value--nested'>
          {Object.keys(tag.data).map((key) => (
            <div
              key={key}
              className='invoice__nested-item'
            >
              <div className='invoice__nested-title'>
                {formatDetailsKey(key)}
              </div>
              <div className='invoice__nested-value'>
                {`${tag.data[key]}`}
              </div>
            </div>
          ))}
        </div>
      </div>
    );

    const renderNormalTag = (tag) => (
      <div className='invoice__item'>
        <div className='invoice__item-title'>
          {formatDetailsKey(tag.tagName)}
        </div>
        <div className='invoice__item-value'>
          {`${tag.data}`}
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
      value = `${formatTimestamp(decodedInvoice[key])}`;
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
      </div>
    </div>
  );

  renderSubmit = () => {
    const { isInvoiceLoaded, text } = this.state;
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
        className='submit'
      >
        <img
          alt='Submit'
          src={isInvoiceLoaded ? closeImage : arrowImage}
          className='submit__asset'
        />
      </div>
    );
  }

  render() {
    return (
      <div className='app'>
        {this.renderLogo()}
        <div className='app__row'>
          {this.renderInput()}
          {this.renderSubmit()}
        </div>
        {this.renderInvoiceDetails()}
        {this.renderErrorDetails()}
      </div>
    );
  }
}

export { App };
