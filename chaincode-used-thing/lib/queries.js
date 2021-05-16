/*
SPDX-License-Identifier: Apache-2.0
*/
'use strict';
const State = require('../ledger-api/state.js');
const UsedThing = require('./UsedThing.js');

/**
 * Query Class for query functions such as history etc
 *
 */
class QueryUtils {

  constructor(ctx, listName) {
    this.ctx = ctx;
    this.name = listName;
  }

  // =========================================================================================
  // getAssetHistory takes the composite key as arg, gets returns results as JSON to 'main contract'
  // =========================================================================================
  /**
  * Get Asset History for a commercial paper
  * @param {String} issuer the CP issuer
  * @param {String} paperNumber commercial paper number
  */
  async getAssetHistory(SerialNumber, ProductName) {
    let key = await this.ctx.stub.createCompositeKey(this.name, [SerialNumber, ProductName]);

    const resultsIterator = await this.ctx.stub.getHistoryForKey(key);
    
    let results = await this.getAllResults(resultsIterator, true);

    return results;
  }

  // ===========================================================================================
  // queryKeyByPartial performs a partial query based on the namespace and  asset key prefix provided

  // Read-only function results are not typically submitted to ordering. If the read-only
  // results are submitted to ordering, or if the query is used in an update transaction
  // and submitted to ordering, then the committing peers will re-execute to guarantee that
  // result sets are stable between endorsement time and commit time. The transaction is
  // invalidated by the committing peers if the result set has changed between endorsement
  // time and commit time.
  // 
  // ===========================================================================================
  /**
  * queryOwner commercial paper
  * @param {String} assetspace the asset space (eg MagnetoCorp's assets)
  */
  async queryKeyByPartial(assetspace) {

    if (arguments.length < 1) {
      throw new Error('Incorrect number of arguments. Expecting 1');
    }
    // ie namespace + prefix to assets etc eg 
    // "Key":"org.papernet.paperMagnetoCorp0001"   (0002, etc)
    // "Partial":'org.papernet.paperlistMagnetoCorp"'  (using partial key, find keys "0001", "0002" etc)
    const resultsIterator = await this.ctx.stub.getStateByPartialCompositeKey(this.name, [assetspace]);
    let method = this.getAllResults;
    let results = await method(resultsIterator, false);

    return results;
  }


  /**
  * queryKeyBySeller used thing
  * @param {String} seller used thing owner
  */
  async queryKeyBySeller(seller) {
    //  
    let self = this;
    if (arguments.length < 1) {
      throw new Error('Incorrect number of arguments. Expecting seller name.');
    }
    let queryString = {};
    queryString.selector = {};
    //  queryString.selector.docType = 'indexOwnerDoc';
    queryString.selector.Seller = seller;
    // set to (eg)  '{selector:{owner:MagnetoCorp}}'
    let method = self.getQueryResultForQueryString;
    let queryResults = await method(this.ctx, self, JSON.stringify(queryString));
    return queryResults;
  }

  async queryKeyByBuyer(buyer) {
    //  
    let self = this;
    if (arguments.length < 1) {
      throw new Error('Incorrect number of arguments. Expecting buyer name.');
    }
    let queryString = {};
    queryString.selector = {};
    //  queryString.selector.docType = 'indexOwnerDoc';
    queryString.selector.Buyer = buyer;
    // set to (eg)  '{selector:{owner:MagnetoCorp}}'
    let method = self.getQueryResultForQueryString;
    let queryResults = await method(this.ctx, self, JSON.stringify(queryString));
    return queryResults;
  }

  // ===== Example: Ad hoc rich query ========================================================
  // queryAdhoc uses a query string to perform a query for marbles..
  // Query string matching state database syntax is passed in and executed as is.
  // Supports ad hoc queries that can be defined at runtime by the client.
  // If this is not desired, follow the queryKeyByOwner example for parameterized queries.
  // Only available on state databases that support rich query (e.g. CouchDB)
  // example passed using VS Code ext: ["{\"selector\": {\"owner\": \"MagnetoCorp\"}}"]
  // =========================================================================================
  /**
  * query By AdHoc string (commercial paper)
  * @param {String} queryString actual MangoDB query string (escaped)
  */
  async queryByAdhoc(queryString) {

    if (arguments.length < 1) {
      throw new Error('Incorrect number of arguments. Expecting ad-hoc string, which gets stringified for mango query');
    }
    let self = this;

    if (!queryString) {
      throw new Error('queryString must not be empty');
    }
    let method = self.getQueryResultForQueryString;
    let queryResults = await method(this.ctx, self, JSON.stringify(queryString));
    return queryResults;
  }

  // WORKER functions are below this line: these are called by the above functions, where iterator is passed in

  // =========================================================================================
  // getQueryResultForQueryString woerk function executes the passed-in query string.
  // Result set is built and returned as a byte array containing the JSON results.
  // =========================================================================================
  /**
   * Function getQueryResultForQueryString
   * @param {Context} ctx the transaction context
   * @param {any}  self within scope passed in
   * @param {String} the query string created prior to calling this fn
  */
  async getQueryResultForQueryString(ctx, self, queryString) {

    const resultsIterator = await ctx.stub.getQueryResult(queryString);
    let results = await self.getAllResults(resultsIterator, false);

    return results;

  }

  /**
   * Function getAllResults
   * @param {resultsIterator} iterator within scope passed in
   * @param {Boolean} isHistory query string created prior to calling this fn
  */
  async getAllResults(iterator, isHistory) {
    let allResults = [];
    let res = { done: false, value: null };

    while (true) {
      res = await iterator.next();
      let jsonRes = {};
      if (res.value && res.value.value.toString()) {
        if (isHistory && isHistory === true) {
          //jsonRes.TxId = res.value.tx_id;
          jsonRes.TxId = res.value.txId;
          jsonRes.Timestamp = res.value.timestamp;
          jsonRes.Timestamp = new Date((res.value.timestamp.seconds.low * 1000));
          let ms = res.value.timestamp.nanos / 1000000;
          jsonRes.Timestamp.setMilliseconds(ms);
          if (res.value.is_delete) {
            jsonRes.IsDelete = res.value.is_delete.toString();
          } else {
            try {
              jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
              // report the commercial paper states during the asset lifecycle, just for asset history reporting
              switch (jsonRes.Value.currentState) {
                case 1:
                  jsonRes.Value.currentState = 'REGISTERED';
                  break;
                case 2:
                  jsonRes.Value.currentState = 'BUY_REQUESTED';
                  break;
                case 3:
                  jsonRes.Value.currentState = 'SENT';
                  break;
                case 4:
                  jsonRes.Value.currentState = 'RECEIVED';
                  break;
                case 5:
                  jsonRes.Value.currentState = 'CONFIRMED';
                  break;
                default: // else, unknown named query
                  jsonRes.Value.currentState = 'UNKNOWN';
              }

            } catch (err) {
              console.log(err);
              jsonRes.Value = res.value.value.toString('utf8');
            }
          }
        } else { // non history query ..
          jsonRes.Key = res.value.key;
          try {
            jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
          } catch (err) {
            console.log(err);
            jsonRes.Record = res.value.value.toString('utf8');
          }
        }
        allResults.push(jsonRes);
      }
      // check to see if we have reached the end
      if (res.done) {
        // explicitly close the iterator 
        console.log('iterator is done');
        await iterator.close();
        return allResults;
      }

    }  // while true
  }

  async getCalculatedDelta(iterator) {
    let likeList = new Set([])
    
    let res = { done: false, value: null };
    let original = {}

    while (true) {
      res = await iterator.next();
      if (res.value && res.value.value.toString()) {
        let {objectType, attributes} = this.ctx.stub.splitCompositeKey(res.value.key)
        if ( attributes.length == 2 ) {
          console.log(res.value.value.toString())
          original = State.deserializeClass(res.value.value, UsedThing);
          if ( original.likeList != undefined && original.likeList.length != 0 ) {
            likeList = new Set(original.likeList)
          }
        }

        let SerialNumber = attributes[0];
        let ProductName = attributes[1];
        let attr = attributes[2];
        let operation = attributes[3];
        let value = attributes[4];
        let ts = attributes[5];
        let tx = attributes[6];

        switch (attr) {
          case "likeList":
            switch (operation) {
              case "add":
                likeList.add(value)
                break;
              case "sub":
                likeList.delete(value)
                break;
            }
            break;
        }
      }
      if (res.done) {
        await iterator.close();
        original.likeList = Array.from(likeList)
        break;
      }

    }  // while true

    console.log(original)


    return original
  }
}
module.exports = QueryUtils;