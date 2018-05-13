#!/usr/local/bin/ruby

# Used to export Blocks from a Web3 compatible endpoint
# I use:
# geth --rpc --rpccorsdomain http://localhost:8080 --fast

# Need to add a unique index for tx 
# db.transactions.createIndex({"hash":1},{unique:1})
# Last imported block:
#
# db.transactions.find().sort({"block_number": 1}).limit(1)

require 'web3/eth'
require 'mongoid'

force_sync = ARGV[0]
multithreaded = ARGV[1]

# Lazy initialise the Transaction class

class Transaction
    include Mongoid::Document
    include Mongoid::Attributes::Dynamic
end

Mongoid.load!("./mongoid.yml", :development)


web3 = Web3::Eth::Rpc.new #host: 'geth'

begin
    syncing = web3.eth.syncing
    last_block = syncing["currentBlock"].to_i(16)
rescue => exception
    last_block = web3.eth.blockNumber
end

last_block = 1283916

puts(last_block)
number_of_threads = 10

def push_block(txs, working_block)
    begin
        Transaction.collection.insert_many(txs)  
        puts("Saving Block #{working_block}: #{txs.length} txs")  
    rescue => exception
        puts exception
    end
end

all_transactions = []

until last_block == 5205690

    block = web3.eth.getBlockByNumber(last_block, true)
    transactions = []
    for tx in block.transactions

        # Is this a token contract?
        if tx.input.match(/^0xa9059cbb/) 
            type = "token"
        else
            type = ""
        end

        transactions << {:type => type, :partition => last_block % 20, :hash => tx.hash, :block_number => last_block, :block_time => block.timestamp_time, :from => tx.from, :to => tx.to, :value => tx.value_eth, :data => tx.input}
    end

    #puts transactions.length

    if transactions.length == 0
        last_block+=1            
        next
    end

    txs = transactions

    
    if multithreaded.nil?
        push_block(txs, last_block)
    else
        th1 = Thread.new{push_block(txs, last_block)}
    end
    
    last_block+=1            

    if !multithreaded.nil?
        if Thread.list.length == 50
            sleep(1)
        end 
    end
end
