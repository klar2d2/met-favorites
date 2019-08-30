const express = require('express');
const router = express.Router();
process.binding('http_parser').HTTPParser = require('http-parser-js').HTTPParser;
const axios = require('axios')
const async = require('async')
const db = require('../models')
const isLoggedIn = require('../middleware/isLoggedIn')

router.get('/', isLoggedIn, (req, res) => {
  db.collection.findAll({
    where: {userId:req.user.id}
  })
  .then((collection) => {
    let isUserLoggedIn = req.user?true:false
    let goodCollections = collection.map(item => {
      return item.dataValues
    })
    res.render('collections/index', {isUserLoggedIn, goodCollections})
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
  db.collection.findOne({
    where: {id:req.params.id},
    include: [db.artwork]
  })
  .then(collection => {
  res.render('collections/showOne', {collection})
  })
  .catch((error) => {
    console.log(error)
    res.status(400).render('404')
  })
})

router.delete('/artwork/:id', isLoggedIn, (req, res) => {
  db.collectionsArtworks.destroy({where:{
    collectionId: req.body.collectionId,
    artworkId: req.body.artworkId
  }}).then(object => {
    res.redirect('/collection/:id')
  })
  .catch((error) => {
    console.log(error)
    res.status(400).render('404')
  })
})

router.get('/delete/:id', (req, res) => {
  db.collection.findByPk( req.params.id )
  .then(collection => {
    res.render('collections/delete', {collection})
  })
  .catch((error) => {
    console.log(error)
    res.status(400).render('404')
  })
})

router.delete('/delete/:id', (req, res) => {
  db.collectionsArtworks.destroy({where: {
    collectionId: req.body.collectionId
  }})
  .then(object => {
    db.collection.destroy({where: {
      id: req.body.collectionId
    }})
  })
  .then(collection => {
    res.redirect('/collection')
  })
  .catch((error) => {
    console.log(error)
    res.status(400).render('404')
  })
})

router.get('/edit/:id', isLoggedIn, (req, res) => {
  db.collection.findByPk( req.params.id )
  .then(collection => {
    res.render('collections/editCol', {collection})
  })
  .catch((error) => {
    console.log(error)
    res.status(400).render('404')
  })
})

router.put('/edit/:id', isLoggedIn, (req, res) => {
  console.log(req.params.id)
  db.collection.findByPk( req.params.id )
  .then(collection => {
    collection.update({
      name: req.body.name,
      description: req.body.description,
      image: req.body.image
    })
  })
  .then(updatedCol => {
    res.redirect('/collection/'+req.params.id)
  })
  .catch((error) => {
    console.log(error)
    res.status(400).render('404')
  })
})



module.exports = router
