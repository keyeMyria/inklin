var mongoose     = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

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


TransactionSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Transaction', TransactionSchema);