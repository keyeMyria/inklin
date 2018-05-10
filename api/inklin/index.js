
const createAzureFunctionHandler = require("azure-function-express").createAzureFunctionHandler;
const express = require("express");


// DATABASE SETUP
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

if ("MONGODB" in process.env) {
	mongoose.connect(process.env["MONGODB"]);
} else {
	mongoose.connect('mongodb://localhost:27017/visualise_ethereum');
}

// Handle the connection event
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {
	console.log("DB connection alive");
});

var Transaction = require('./app/models/Transaction');
var Contract = require('./app/models/Contract');



// Create express app as usual
const app = express();


// CORS
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});





app.get('/api/inklin/transactions/:block', function (req, res) {

	//console.log(req)
	Transaction.find({ "value": { "$gt": 0 }, "block_number": { "$gt": req.params.block } }, function (err, transactions) {
		if (err)
			res.send(err);

		Transaction.find({ "value": { "$gt": 0 }, "block_number": transactions[0]["block_number"] }, function (err, tx) {
			res.json(tx);
		});
	}).limit(1).sort({ "block_number": 1 });
});





app.get('/api/inklin/live/:lastblock', function (req, res) {

	if (req.params.lastblock > 0) {
		Transaction.find({ "value": { "$gt": 0 }, "block_number": { "$gt": req.params.lastblock } }, function (err, transactions) {
			res.json(transactions);
		});
	} else {
		Transaction.find({ "value": { "$gt": 0 }, }, function (err, transactions) {
			if (err)
				res.send(err);

			Transaction.find({ "value": { "$gt": 0 }, "block_number": transactions[0]["block_number"] }, function (err, tx) {
				res.json(tx);
			});
		}).limit(1).sort({ "block_number": -1 });

	}
});




//db.transactions.find({ "block_time" : { "$gte" : new Date("2017-12-04T00:00:00Z"), "$lte": new Date("2017-12-04T23:59:00Z")}}).count()
app.get('/api/inklin/transactions/:from/:to', function (req, res) {

	from = new Date(req.params.from)
	to = new Date(req.params.to)


	Transaction.paginate({ "type": "token", "block_time": { "$gte": from, "$lte": to } }, { from: 1, to: 1, block_time: 1, data: 1, limit: 4000 }, function (err, results) {
		if (err)
			res.send(err);



		for (t in results.docs) {
			results.docs[t]["to"] = "0x" + results.docs[t]["data"].slice(34, 74);
			// 	//transactions[t]["value"] = parseInt(transactions[t]["data"].slice(121),16)
			// 	//console.log(transactions[t]["value"]/1000000)
		}

		res.json(results);

	});
});




app.get('/api/inklin/contracts/:block/:contract', function (req, res) {
	Transaction.find({ "type": "token", "block_number": { "$gt": req.params.block }, "to": req.params.contract.toLowerCase() }, function (err, transactions) {
		if (err)
			console.log(err)
		//res.send(err);

		console.log({ "type": "token", "block_number": transactions[0]["block_number"], "to": req.params.contract.toLowerCase() })
		Transaction.find({ "type": "token", "block_number": transactions[0]["block_number"], "to": req.params.contract.toLowerCase() }, function (err, tx) {
			for (t in tx) {
				tx[t]["to"] = "0x" + tx[t]["data"].slice(34, 74);
			}
			res.json(tx);
		});
	}).limit(1).sort({ "block_number": 1 });
});




app.get('/api/inklin/search/:term', function (req, res) {

	Contract.find({ $or: [{ name: { '$regex': req.params.term, '$options': 'i' } }, { address: { '$regex': req.params.term, '$options': 'i' } }, { symbol: { '$regex': req.params.term, '$options': 'i' } }] }, function (err, results) {
		if (err)
			console.log(err);
		//	res.send(err);

		console.log(results);

		res.json(results);
	});
});


module.exports = createAzureFunctionHandler(app);
