const express = require('express');
const router = express.Router();
process.binding('http_parser').HTTPParser = require('http-parser-js').HTTPParser;
const axios = require('axios')
const async = require('async')
const db = require('../models')
const isLoggedIn = require('../middleware/isLoggedIn')

router.get('/', isLoggedIn, (req, res) => {
  db.user.findAll({
    include: [db.collection]
  })
  .then((collection) => {
    res.render('collections/index', {collection: collection})
  })
  .catch((err) => {
    console.log(err)
    res.render('404')
  })
})

router.post('/', isLoggedIn, (req, res) => {
  console.log(req.body)
  db.collection.create({
    name: req.body.name,
    image: req.body.image,
    userId: req.user.id,
    description: req.body.description
  })
  .then((post) => {
    res.redirect(`/search/results/${req.body.objectId}`)
  })
  .catch((error) => {
    console.log(error)
    res.status(400).render('404')
  })
})

router.get('/:id', isLoggedIn, (req, res) => {
  res.send('get one collection')
})

router.delete('/:id', isLoggedIn, (req, res) => {
  res.send('stubby for delete')
})

router.put('/edit/:id', isLoggedIn, (req, res) => {
  res.send('stubby for edits')
})



module.exports = router
