var mongoose = require('mongoose');
var contentsschema = require('../schemas/contents');


module.exports = mongoose.model('Content', contentsschema);