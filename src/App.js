import React from 'react';
import './App.css';

class App extends React.Component {
  state = {
    Currency: [],
    rate: [],
    FromCurrency: 'USD',
    ToCurrency: 'CNY',
    input: "",
    result: "",
    display: false
  }
  componentDidMount () {
    fetch(`https://gist.githubusercontent.com/mddenton/062fa4caf150bdf845994fc7a3533f74/raw/27beff3509eff0d2690e593336179d4ccda530c2/Common-Currency.json`)
    .then(res=> res.json())
    .then(data => {
      for(let index in data) {
        this.setState({
          Currency: [...this.state.Currency, data[index]]
        })
      }
    }).catch(
      error => console.log("Currency not Found")
      );
    let input = this.state.FromCurrency;
    fetch(`https://api.exchangeratesapi.io/latest?base=${input}`)
    .then(res => res.json())
    .then(data => {
      this.setState({
        rate: data.rates
      })
      console.log(this.state.rate)
    })
  }
  Sum = (number) => {
    return number+1
  }
  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value,
      display: false
    })
  }
  displaySymbol = () => {
    for(let item of this.state.Currency) {
      if(item.code === this.state.FromCurrency) {
        return (
          <span>{item.symbol}</span>
        )
      }
    }
  }
  displaySymbolTo = () => {
    for(let item of this.state.Currency) {
      if(item.code === this.state.ToCurrency) {
        return (
          <span>{item.symbol}</span>
        )
      }
    }
  }
  removeDecimal = (value = "") => {
    return value.toString().replace(/(-(?!\d))|[^0-9|-]/g, "") || "";
  };
  addFrontZeros = number => {
    const targetLength = 3;
    const actualLength = number.length;
    if (actualLength >= targetLength) {
      return number;
    }
    const Add = targetLength - actualLength;
    const FrontZeros = "0".repeat(Add);
    return FrontZeros + number;
  };
  removeZeros = number => number.replace(/^0+([0-9]+)/, "$1");
  AddDecimal = (number) => {
    const centsPosition = number.length - 2;
    const dollars = this.removeZeros(
      number.substring(0, centsPosition)
    );
    const cents = number.substring(centsPosition);
    return `${dollars}.${cents}`;
  }
  handleInputChange = e => {
    const number = this.addFrontZeros(this.removeDecimal(e.target.value));
    this.setState({
      input: this.AddDecimal(number)
    })
  }
  getResult = () => {
    let targetCurrency = this.state.ToCurrency
    console.log(targetCurrency)
    let currentRate = this.state.rate[targetCurrency];
    let message = "";
    if(typeof(currentRate) === 'undefined') {
      message = "Current rate not found";
      this.setState({
        result: message,
        display: true
      })
      console.log(this.state.result)
      return;
    }
    let result =  (this.state.input*currentRate).toFixed(2) + this.state.ToCurrency ;
    this.setState({
      result: result,
      display: true
    })
  }
  render () {
    return (
      <div className="container">
        <h1>Currency Converter</h1>
        <div className="inside">
          {this.displaySymbol()}
          <input step="0.01" placeholder="0.00" type="number"
          value={this.state.input} onChange={this.handleInputChange} />
          <select onChange={this.handleChange} id="FromCurrency" value={this.state.FromCurrency}>
            {this.state.Currency.map((item, index) => {
              return(
                <option key={index} value={item.code}>{item.code}</option>
              )
            })}
          </select>
          To
          <select id="ToCurrency" onChange={this.handleChange} value={this.state.ToCurrency}>
            {this.state.Currency.map((item, index) => {
              return(
                <option key={index} value={item.code}>{item.code}</option>
              )
            })}
          </select>
          <button onClick={this.getResult}>Convert</button>
        </div>
        <div>
          <h3>{this.displaySymbol()}{this.state.input}{this.state.FromCurrency} = {this.state.display && this.displaySymbolTo()} 
          <span> </span>
          {this.state.display ? (this.state.result) : null}
          </h3>
        </div>
      </div>
    )
  }
}
export default App;