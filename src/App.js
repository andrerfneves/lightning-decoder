import React, { PureComponent } from 'react';
import LightningPayReq from './lib/bolt11';
import './app.css';

const INPUT_PLACEHOLDER = 'Enter Lightning Invoice Here';

class App extends PureComponent {
  state = {
    text: '',
    decodedInvoice: {},
  };

  handleChange = (event) => {
    const { target: { value: text } } = event;
    this.setState(() => ({ text }));
  }

  handleKeyPress = (event) => {
    const { text } = this.state;

    if (event.key === 'Enter') {
      this.setState(() => ({
        decodedInvoice: LightningPayReq.decode(text),
      }));
    }
  }

  renderDecodedInvoice = () => {
    const { decodedInvoice } = this.state;

    return (
      <div className='invoice-details'>
        {Object.keys(decodedInvoice).map((key) => {
          if (typeof decodedInvoice[key] === 'array') {
            return null
          }

          return (
            <div>{key}: {decodedInvoice[key]}</div>
          );
        })}
      </div>
    );
  }

  renderInput = () => {
    const { text } = this.state;

    return (
      <input
        value={text}
        onChange={this.handleChange}
        placeholder={INPUT_PLACEHOLDER}
        onKeyPress={this.handleKeyPress}
      />
    );
  }

  render() {
    return (
      <div className='app'>
        {this.renderInput()}
        {this.renderDecodedInvoice()}
      </div>
    );
  }
}

export default App;
