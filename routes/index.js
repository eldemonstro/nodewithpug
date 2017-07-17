const express = require('express');
var router = express.Router();

// Article model
let Article = require('../models/article');

/* GET home page. */
router.get('/', function(req, res, next) {
  Article.find({}, (err, articles) => {
    if (err) {
      console.error(err);
      res.send(err);
      return;
    }
    res.render('index', {
      title: 'Knowledgebase',
      articles: articles,
      errors: null
    });
  });
});

module.exports = router;
