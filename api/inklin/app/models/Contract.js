var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ContractSchema   = new Schema({

	symbol: String,
	address: String,
	name: String

});

module.exports = mongoose.model('Contract', ContractSchema);