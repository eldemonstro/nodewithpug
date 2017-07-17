const express = require('express');
const mongoose = require('mongoose');
const util = require('util');

let router = express.Router();
let Article = require('../models/article');

/* GET add article page. */
router.get('/add', function(req, res, next) {
  res.render('articles/add', {
    title: 'Add Article',
    errors: null
  });
});

/* POST add article */
router.post('/add', function(req, res, next) {
  // Validating
  req.assert('title', 'Title is required').notEmpty();
  req.assert('author', 'Author is required').notEmpty();
  req.assert('body', 'Body is required').notEmpty();

  req.getValidationResult().then(function(result) {
    if (!result.isEmpty()) {
      errors = result.array();
      res.render('articles/add', {
        title: 'Add Article',
        errors: errors
      });
      return;
    }

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
        req.flash('success', "Article Added");
        res.redirect('/');
      }
    });
  });
});

// Get single article
router.get('/:id', function(req, res) {
  Article.findById(req.params.id, (err, article) => {
    res.render('articles/article', {
      article: article,
      errors: null
    });
  });
});

// Get single article
router.get('/edit/:id', function(req, res) {
  Article.findById(req.params.id, (err, article) => {
    res.render('articles/edit', {
      title: 'Edit a article',
      article: article,
      errors: null
    });
  });
});

// Update submit
router.post('/edit/:id', function(req, res, next) {
  // Validating
  req.assert('title', 'Title is required').notEmpty();
  req.assert('author', 'Author is required').notEmpty();
  req.assert('body', 'Body is required').notEmpty();

  req.getValidationResult().then(function(result) {
    if (!result.isEmpty()) {
      errors = result.array();
      res.render('articles/add', {
        title: 'Add Article',
        errors: errors
      });
      return;
    }


    let article = {
      title: req.body.title,
      author: req.body.author,
      body: req.body.body
    };

    let query = {
      _id: req.params.id
    };

    Article.update(query, article, (err) => {
      if (err) {
        console.error(err);
        return;
      } else {
        req.flash('success', "Article Edited");
        res.redirect('/');
      }
    });
  });
});

router.post('/delete/:id', function(req, res, next) {
  let query = {
    _id: req.params.id
  };
  Article.remove(query, function(err) {
    if (err) {
      console.error(err);
      return;
    } else {
      req.flash('danger', "Article Removed");
      res.redirect('/');
    }
  });
});

module.exports = router;
