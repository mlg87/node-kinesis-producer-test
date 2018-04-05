const app = require('express')()
const port = process.env.PORT || 3000
const bodyParser = require('body-parser')

const { streams } = require('./routes')

app.use(bodyParser.json({ type: 'application/json' }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.text())

app.use('/streams', streams)

app.listen(port, () => {
  console.log(`app up and running on port ${port}`)
})

app.get('/', (req, res) => {
  res.status(200).json({ error: null, message: 'sup?' })
})

// if we test, we need it exported
module.exports = app
