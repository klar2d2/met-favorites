//Todo: This will be a controller for searching for specific artwork.
const express = require('express');
const router = express.Router();
process.binding('http_parser').HTTPParser = require('http-parser-js').HTTPParser;
const axios = require('axios')
const async = require('async')
const db = require('../models')
const isLoggedIn = require('../middleware/isLoggedIn')




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
        res.render('search/results', {result})
      }); // END OF FOREACH

    }).catch((err) => {
      console.log("err", err)
      res.render('404')
    })
})

router.get('/results/:id', (req, res) => {
  axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${req.params.id}`)
  .then(response => {
    db.collection.findAll({
      where:{userId:req.user.id},
    })
    .then(collections => {
      let isUserLoggedIn = req.user?true:false
      let goodCollections = collections.map(item => {
        return item.dataValues
      })
      console.log(goodCollections)

      res.render('search/showOne', { artwork: response.data, goodCollections, isUserLoggedIn})

    })
  }).catch((err) => {
    console.log("err", err)
    res.render('404')
  })
})

router.post('/results', isLoggedIn, (req, res) => {
  // TODO allow the user to add a work to their collection. Flash an update and return to the ID page
  db.collection.findOne({where:{id: req.body.userCollections}})
    .then((collection) => {
      db.artwork.findOrCreate({
        where: {objectID: req.body.objectID},
        defaults: {
        objectID: req.body.objectID,
        image: req.body.image,
        title: req.body.title,
        artist: req.body.artist,
        date: req.body.date
      }
      })
      .spread((artwork, wasCreated) => {
        console.log('spread')
        collection.addArtwork(artwork)
        .catch(err => {
          console.log("errart", err)
        })
      })
      .catch(err => {
        console.log('Err', err)
      })
    .then((artwork) => {
      res.redirect(`/search/results/${req.body.objectID}`)
    }).catch((err) =>  {
      console.log('err', err)
      res.render('404')
    })
  })
})

module.exports = router
