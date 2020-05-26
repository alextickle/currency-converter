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
                this.setState({converted: data.rates[toCurrency]});
            }).catch(error => {
                this.setState({error: 'Error converting currencies'});
                console.error(error);
            })
    }

    render() {
        const {toCurrency, fromCurrency, error, converted} = this.state;
        const availableFromOptions = ALL_CURRENCY_OPTIONS.filter(opt => opt !== toCurrency);
        const availableToOptions = ALL_CURRENCY_OPTIONS.filter(opt => opt !== fromCurrency);

        return (
          <div>
            <div className="row">
                <div className="col-sm-3">
                    <div>AMOUNT: </div>
                    <input name="amount" type="number" onChange={this.handleAmountChange}/>
                </div>
                <div className="col-sm-3 offset-sm-1">
                    <div>FROM: </div>
                    <select id="fromCurrency" name="fromCurrency" onChange={this.handleCurrencyChange}>
                        {availableFromOptions.map((currency, i) => <option key={i} value={currency}>{currency}</option>)}
                     </select>
                     <div>TO: </div>
                     <select id="toCurrency" name="toCurrency" onChange={this.handleCurrencyChange}>
                         {availableToOptions.map((currency, i) => <option key={i} value={currency}>{currency}</option>)}
                     </select>
                 </div>
                 <div className="col-sm-3 offset-sm-1">
                     <div>CONVERTED: </div>
                     <input value={converted || 0} readOnly/>
                     {error &&
                         <div style={{color: "red"}}>{error}</div>
                     }
                 </div>
             </div>

          </div>
        );
    }
}

export default Converter;