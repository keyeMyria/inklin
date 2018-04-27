from pymongo import MongoClient
import json

import pymongo
import os
from bson.objectid import ObjectId

client = MongoClient("mongodb://localhost:27017")


db = client.visualise_ethereum

transactions = db.transactions
contracts = db.contracts


bs = transactions.find({"data": {'$regex':'^0xa9059cbb'}})
for b in bs:
    print(b["block_number"])
    b["type"] = "token"
    transactions.save(b)
