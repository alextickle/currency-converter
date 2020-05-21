import React, { Component } from 'react';


const CONVERTER_SERVICE = 'https://api.frankfurter.app/latest';

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
                this.setState({error: 'Error converting currencies, please check inputs'});
                console.error(error);
            })
  }

  render() {
    return (
      <div>
        <div style={{float: "left"}}>
            <div>AMOUNT: </div>
            <input name="amount" type="number" onChange={this.handleAmountChange}/>
            <div>FROM: </div>
            <select id="fromCurrency" name="fromCurrency" onChange={this.handleCurrencyChange}>
                <option value="USD">USD</option>
                <option value="CAD">CAD</option>
                <option value="EUR">EUR</option>
                <option value="JPY">JPY</option>
             </select>
             <div>TO: </div>
             <select id="toCurrency" name="toCurrency" onChange={this.handleCurrencyChange}>
                 <option value="CAD">CAD</option>
                 <option value="USD">USD</option>
                 <option value="EUR">EUR</option>
                 <option value="JPY">JPY</option>
             </select>
         </div>
         <div style={{float: "right"}}>
            <div>CONVERTED: </div>
            <input value={this.state.converted || 0} readOnly/>
        </div>
        {this.state.error &&
            <div style={{color: "red"}}>{this.state.error}</div>
        }
      </div>
    );
  }
}

export default Converter;