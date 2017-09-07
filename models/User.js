var mongoose = require('mongoose');
var usersschema = require('../schemas/users');


module.exports = mongoose.model('User', usersschema);