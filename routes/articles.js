const express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/add', function(req, res, next) {
  res.render('articles/add', {
    title: 'Add Article'
  });
});

module.exports = router;
