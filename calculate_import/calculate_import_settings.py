import pymongo

client = pymongo.MongoClient("mongodb://inklin:EsgG40AL0aCdIzD087RhzG9IdKBnb6bP2e4iEnPY2vYrxRloWVhH3SqorPphndPdBHEfWAiwLH79D64WaiQ5fg==@inklin.documents.azure.com:10255/?ssl=true&replicaSet=globaldb")
db = client.visualise_ethereum
stats = db.command("dbstats") # prints database stats for "test_db"
print(stats)


result = db.transactions.insert_one({ "type" : "token", "partition" : 1, "hash" : "0x35cad025bd635f20afc21a09c62cb258ac70cfa6719c87410bb34b3b99de31c5", "block_number" : 5478241, "block_time" : "2018-04-21T05:23:49Z", "from" : "0xecc2d1ebb9474116102bc74e50a724b55a1571d0", "to" : "0x70a72833d6bf7f508c8224ce59ea1ef3d0ea3a38", "value" : 0, "data" : "0xa9059cbb000000000000000000000000e27f5df99870b69c91b6ee261e5ba1fa41a4df0e000000000000000000000000000000000000000000000037ded68c72c3c44000" })


latency = db.command({"getLastRequestStatistics": 1})

print(latency)


txs = db.transactions.find()

txlatency = db.command({"getLastRequestStatistics": 1})

print(latency)

#db.command("collstats", "test_collection") # prints collection-level stats
