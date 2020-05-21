import React, { Component } from 'react';


const CONVERTER_SERVICE = 'https://api.frankfurter.app/latest';
const ALL_CURRENCY_OPTIONS = ["USD", "CAD", "GBP", "EUR"];

class Converter extends Component {

  constructor() {
    super();
    this.state = {
      amount: 0,
      fromCurrency: 'USD',
      toCurrency: 'CAD',
      error: ''
    };
  }

  handleAmountChange = (event) => {
    this.setState({amount: event.target.value, error: ''}, () => {
        this.convertAmount(this.state.fromCurrency, this.state.toCurrency, this.state.amount);
    });
  }

  handleCurrencyChange = (event) => {
      this.setState({[event.target.id]: event.target.value, error: ''}, () => {
          this.convertAmount(this.state.fromCurrency, this.state.toCurrency, this.state.amount);
      });
   }

  convertAmount = (fromCurrency, toCurrency, amount) => {
        if (amount <= 0){
            this.setState({converted: 0})
            return;
        }
        const params = {
            amount,
            to: toCurrency,
            from: fromCurrency
        };
        const url = new URL(CONVERTER_SERVICE)
        url.search = new URLSearchParams(params).toString();


        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                this.setState({converted: data.rates[toCurrency]});
            }).catch(error => {
                this.setState({error: 'Error converting currencies'});
                console.error(error);
            })
  }

  render() {
    const {toCurrency, fromCurrency, error, converted} = this.state;
    console.log(this.state);
    const availableFromOptions = ALL_CURRENCY_OPTIONS.filter(opt => opt !== toCurrency);
    console.log(availableFromOptions);
    const availableToOptions = ALL_CURRENCY_OPTIONS.filter(opt => opt !== fromCurrency);
    console.log(availableToOptions);
    return (
      <div>
        <div style={{float: "left"}}>
            <div>AMOUNT: </div>
            <input name="amount" type="number" onChange={this.handleAmountChange}/>
            <div>FROM: </div>
            <select id="fromCurrency" name="fromCurrency" onChange={this.handleCurrencyChange}>
                {availableFromOptions.map((currency, i) => <option key={i} value={currency}>{currency}</option>)}
             </select>
             <div>TO: </div>
             <select id="toCurrency" name="toCurrency" onChange={this.handleCurrencyChange}>
                 {availableToOptions.map((currency, i) => <option key={i} value={currency}>{currency}</option>)}
             </select>
         </div>
         <div style={{float: "right"}}>
            <div>CONVERTED: </div>
            <input value={converted || 0} readOnly/>
        </div>
        {error &&
            <div style={{color: "red"}}>{error}</div>
        }
      </div>
    );
  }
}

export default Converter;