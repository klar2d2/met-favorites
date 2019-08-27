//Todo: This will be a controller for searching for specific artwork.
const express = require('express');
const router = express.Router();
process.binding('http_parser').HTTPParser = require('http-parser-js').HTTPParser;
// const fetch = require('node-fetch')
const axios = require('axios')



router.get('/', (req, res) => {
  console.log('here')
  res.render('search/index')
})

router.get('/results', (req, res) => {
  axios.get('https://collectionapi.metmuseum.org/public/collection/v1/search')
  .then(response => {
      let data = response.data
      console.log(data)
    }).catch((err) => {
      console.log("err", err)
    })
})




router.get('/results/:id', (req, res) => {
  res.send('This is a stub for when the User wants specific information on a result')
})

router.post('/router', (req, res) => {
  // TODO allow the user to add a work to their collection. Flash an update and return to the ID page
})

module.exports = router
