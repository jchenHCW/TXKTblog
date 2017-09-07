var mongoose = require('mongoose');
var categoriesschema = require('../schemas/categories');


module.exports = mongoose.model('Category', categoriesschema);