var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TransactionSchema   = new Schema({
	name: String,
	hash: String,
	block_number: Number,
	block_time: Date,
	from: String,
	to: String,
	value: Number,
	data: String

});

module.exports = mongoose.model('Transaction', TransactionSchema);