# Visualising the Ethereum Blockchain

## Frontend

React frontend using Force Directed Graph to visualise Ethereum transactions

## Importer

Talks to a Web3 compatible API (Parity or Geth have been tested) to import all Transactions into a Mongo Database (MongoDB hosted in Kubernetes and CosmosDB tested).  The API is relatively slim, reading blocks backwards from the latest imported block backwards.  The bulk import used 50 threads to push data to the DB - for CosmosDB you will need to make sure you partition the data correctly on a key (the importer does a modulus of the block number % 20), as well as setting the RU/s high enough otherwise you will hit import errors.

## API

Node.js/Express API that talks to the MongoDB for queries and searches on the Blockchain

## Ethereum node setup

I found Parity to have quite a few problems with missing data, so reverted to using Geth for the Ethereum node.  The command I use to set it up (in Kubernetes) is:

```console
geth --rpc --fast --rpccorsdomain * --rpcaddr 0.0.0.0 --rpcvhosts *
```

## Kubernetes

Directory containing Kube pod, service, and PV definitions for all components