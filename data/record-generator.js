const casual = require('casual')

const symbols = ['ABC', 'AMZN', 'APPL', 'MSFT', 'XYZ']
const types = ['BUY', 'SELL']

class Record {
  generate() {
    return {
      tickerSymbol: symbols[Math.floor(Math.random() * 5)],
      tradeType: types[Math.floor(Math.random() * 2)],
      price: casual.integer(0, 350),
      quantity: casual.integer(0, 1000),
      id: casual.uuid
    }
  }
}

module.exports = Record
