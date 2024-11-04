var express = require('express');
var router = express.Router();
const generator = require('generate-password');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.status(200).json({ message: "api path verification"});
});

module.exports = router;
