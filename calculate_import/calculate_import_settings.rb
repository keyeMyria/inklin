require 'mongoid'

# Lazy initialise the Transaction class

class Transaction
    include Mongoid::Document
    include Mongoid::Attributes::Dynamic
end

Mongoid.load!("./mongoid.yml", :production)

session = Mongoid.session('default')

transaction = '{ "_id" : ObjectId("5b0294fe4d81305030118142"), "type" : "token", "partition" : 1, "hash" : "0x35cad025bd635f20afc21a09c62cb258ac70cfa6719c87410bb34b3b99de31c5", "block_number" : 5478241, "block_time" : ISODate("2018-04-21T05:23:49Z"), "from" : "0xecc2d1ebb9474116102bc74e50a724b55a1571d0", "to" : "0x70a72833d6bf7f508c8224ce59ea1ef3d0ea3a38", "value" : 0, "data" : "0xa9059cbb000000000000000000000000e27f5df99870b69c91b6ee261e5ba1fa41a4df0e000000000000000000000000000000000000000000000037ded68c72c3c44000" }'

Transaction.collection.insert(transaction)  

run = session.command({"getLastRequestStatistics": 1})

puts(run)

