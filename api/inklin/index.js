
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
		}).limit(10);
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


	Transaction.paginate({ "type": "token", "block_time": { "$gte": from, "$lte": to } }, { from: 1, to: 1, block_time: 1, data: 1, limit: 1000 }, function (err, results) {
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


app.get('/api/inklin/txaddress/:address', function (req, res) {

	Transaction.paginate({ "$or": [{ "from": req.params.address.toLowerCase() }, { "to": req.params.address.toLowerCase() }] }, { from: 1, to: 1, block_time: 1, data: 1, limit: 1000 }, function (err, results) {
		if (err)
			res.send(err);

		const tmp_nodes = []
		const tokens = []
		const nodes = []
		const links = []
		const histogram = []

		for (t in results.docs) {
			const from = results.docs[t]["from"];
			const block_number = results.docs[t]["block_number"];
			//const value = data[y]["value"];
			let to = results.docs[t]["to"];
			let from_exists = false;
			let to_exists = false;
			let contract_exists = false;

			if (from != null && to != null) {

				if (!histogram.includes(block_number)) {
					histogram[block_number] = 0
				}
				

				if (results.docs[t]["data"].startsWith("0xa9059")) {
					if (!tokens.includes(to)) {
						tokens.push(to)
					}

					if (!tmp_nodes.includes(from)) {
						tmp_nodes.push(from)
					}

					links.push({ source: from, target: to, color: "#2aaee2" })
					final_to = "0x" + results.docs[t]["data"].slice(34, 74);

					if (!tmp_nodes.includes(final_to)) {
						tmp_nodes.push(final_to)
					}

					links.push({ source: to, target: final_to, color: "yellow" })
				
				} else {
					if (!tmp_nodes.includes(to)) {
						tmp_nodes.push(to)
					}

					// Only add the node if it doesn't exist
					if (!tmp_nodes.includes(from)) {
						tmp_nodes.push(from)
					}

					links.push({ source: from, target: to, color: "#2aaee2" })
				}
			}

		}

		for (i in tmp_nodes) {
			nodes.push({ id: tmp_nodes[i], color: "white" })
		}

		for (i in tokens) {
			nodes.push({ id: tokens[i], color: "#2aaee2" })
		}

		results.docs = { nodes, links }
		//results["histogram"] = histogram
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
