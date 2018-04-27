# Used to export Blocks from a Web3 compatible endpoint
# I use:
# geth --rpc --rpccorsdomain http://localhost:8080 --fast

require 'web3/eth'
require 'mongoid'


# Lazy initialise the Block class

class Contract
    include Mongoid::Document
    include Mongoid::Attributes::Dynamic
end

Mongoid.load!("./mongoid.yml", :development)


web3 = Web3::Eth::Rpc.new

last_block = web3.eth.blockNumber

all_transactions = []


tokenInterface = '[{"type": "function","name": "name","constant": true,"inputs": [],"outputs": [{"name": "","type": "string"}]},{"type": "function","name": "decimals","constant": true,"inputs": [],"outputs": [{"name": "","type": "uint8"}]},{"type": "function","name": "balanceOf","constant": true,"inputs": [{"name": "","type": "address"}],"outputs": [{"name": "","type": "uint256"}]},{"type": "function","name": "symbol","constant": true,"inputs": [],"outputs": [{"name": "","type": "string"}]},{"type": "function","name": "transfer","constant": false,"inputs": [{"name": "_to","type": "address"},{"name": "_value","type": "uint256"}],"outputs": []},{"type": "constructor","inputs": [{"name": "_supply","type": "uint256"},{"name": "_name","type": "string"},{"name": "_decimals","type": "uint8"},{"name": "_symbol","type": "string"}]},{"name": "Transfer","type": "event","anonymous": false,"inputs": [{"indexed": true,"name": "from","type": "address"},{"indexed": true,"name": "to","type": "address"},{"indexed": false,"name": "value","type": "uint256"}]}]'
TokenContract = web3.eth.contract(tokenInterface)


until last_block < 0
    block = web3.eth.getBlockByNumber(last_block)
    transactions = []
    for tx in block.transactions

        contractAddr = web3.eth.getTransactionReceipt(tx.hash).contractAddress

        unless contractAddr.nil?
            tokenInstance = TokenContract.at(contractAddr)
            #puts(tokenInstance)
            token = tokenInstance.symbol()
            unless token.nil?
                puts(contractAddr)
                puts(tokenInstance.symbol())
                puts(tokenInstance.name())
                puts(tokenInstance.decimals())
                Contract.create({:address => contractAddr, :name => tokenInstance.name(), :symbol => tokenInstance.symbol(), :decimals => tokenInstance.decimals()})    

            end
        end

    end

    last_block-=1
end
