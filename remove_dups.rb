# Used to export Blocks from a Web3 compatible endpoint
# I use:
# geth --rpc --rpccorsdomain http://localhost:8080 --fast

require 'web3/eth'
require 'mongoid'


# Lazy initialise the Block class

class Transaction
    include Mongoid::Document
    include Mongoid::Attributes::Dynamic
end

Mongoid.load!("./mongoid.yml", :development)

# Upto 2572603
txs = Transaction.where(:block_number.lte => 3846492 and :block_number.gte => 2572603)

for tx in txs
    dups = Transaction.where(:hash => tx["hash"]).count()
    if (dups == 2)
        puts("Deleting #{tx.block_number}")
        tx.destroy
    end
    #puts(tx["hash"])
end