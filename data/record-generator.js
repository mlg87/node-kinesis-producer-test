const casual = require('casual')

const symbols = ['ABC', 'AMZN', 'APPL', 'MSFT', 'XYZ']
const types = ['one', 'two']

class Record {
  generate() {
    return {
      type: types[Math.floor(Math.random() * 2)],
      tickerSymbol: symbols[Math.floor(Math.random() * 5)],
      price: casual.integer(0, 350),
      quantity: casual.integer(0, 1000),
      id: casual.uuid
    }
  }
}

module.exports = Record
