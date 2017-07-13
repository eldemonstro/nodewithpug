const express = require('express');
const mongoose = require('mongoose');
let router = express.Router();
let Article = require('../models/article');

/* GET add article page. */
router.get('/add', function(req, res, next) {
  res.render('articles/add', {
    title: 'Add Article'
  });
});

/* POST add article */
router.post('/add', function(req, res, next) {
  let article = new Article({
    title: req.body.title,
    author: req.body.author,
    body: req.body.body
  });

  article.save((err) => {
    if (err) {
      console.error(err);
      return;
    } else {
      res.redirect('/');
    }
  });
});

// Get single article
router.get('/:id', function(req, res) {
  Article.findById(req.params.id, (err, article) => {
    res.render('articles/article', {
      article: article
    });
  });
});

module.exports = router;
