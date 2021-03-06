const express = require('express')
const app = express()
const bodyParser = require('body-parser')

var db

app.listen(10010, () => {
  console.log('listening on 10010')
})

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('index.ejs')
})

app.post('/quotes', (req, res) => {
  db.collection('quotes').save(req.body, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

app.put('/quotes', (req, res) => {
  db.collection('quotes')
    .findOneAndUpdate({ name: 'Yoda' }, {
      $set: {
        name: req.body.name,
        quote: req.body.quote
      }
    }, {
      sort: { _id: -1 },
      upsert: true
    }, (err, result) => {
      if (err) return res.send(err)
      res.send(result)
    })
})

app.delete('/quotes', (req, res) => {
  db.collection('quotes').findOneAndDelete({ name: req.body.name }, (err, result) => {
    if (err) return res.send(500, err)
    res.send('A darth vadar quote got deleted')
  })
})
