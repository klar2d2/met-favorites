//Todo: This will be a controller for searching for specific artwork.
const express = require('express');
const router = express.Router();
process.binding('http_parser').HTTPParser = require('http-parser-js').HTTPParser;
// const fetch = require('node-fetch')
const axios = require('axios')
const async = require('async')



router.get('/', (req, res) => {
  console.log('here')
  res.render('search/index')
})
// To get the object ID's passed to the artwork API for images etc.
router.get('/results', (req, res) => {
  //get query details from the form
  axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/search?isHighlight=${req.query.highlight}&isOnView=${req.query.view}&q=${req.query.keyname}&perPage=20`)
  .then(response => {
      let result = {}
      // Get objectID's from call one
      async.forEach(response.data.objectIDs, function(work, cb) { //work is an ID
        //Taking the ID's and indiviually going to get information for the second API call in Parallel
        axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${work}`)
        .then(response2 => {
          //storing the info from the ID key (work) response so we can have it later.
          result[work] = response2.data
          cb()
        })
        .catch((err) => {
          console.log("error in async foreach call", err)
          cb()
        })
      }, () => { //argument 3 for the async foreach
        console.log('All done', result)
        res.render('search/results', {result})
      }); // END OF FOREACH

    }).catch((err) => {
      console.log("err", err)
      res.render('404')
    })

})




router.get('/results/:id', (req, res) => {
  console.log(req.params.id)
  res.send('stub')
})

router.post('/router', (req, res) => {
  // TODO allow the user to add a work to their collection. Flash an update and return to the ID page
})

module.exports = router
