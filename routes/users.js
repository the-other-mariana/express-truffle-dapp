var express = require('express');
var router = express.Router();

/* GET users listing. */
// goes here if we type localhost:8000/users/
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// goes here if we type localhost:8000/users/detail
router.get('/detail', function(req, res, next) {
  res.send('detail');
});



module.exports = router;
