'use strict';

const { Contract } = require('fabric-contract-api');
const UsedThing = require('./UsedThing')
const State = require('../ledger-api/state')

class UsedThingChainCode extends Contract {

  async InitLedger(ctx) {
    // empty
  }

  async CreateAsset(ctx, category, title, product_name, image_url, description, price, seller) {
    const asset = UsedThing.createInstance(
      seller,
      title,
      product_name,
      category,
      image_url,
      description,
      price,
    );

    const txID = ctx.stub.getTxID()

    const key = ctx.stub.createCompositeKey(UsedThing.getClass(), [txID])

    await ctx.stub.putState(key, State.serialize(asset));

    return asset;
  }

  async Get(ctx, id) {
    const assetJSON = await ctx.stub.getState(id); 
    if (!assetJSON || assetJSON.length === 0) {
      throw new Error(`The asset ${id} does not exist`);
    }
    const asset = UsedThing.fromBuffer(assetJSON)
    return asset;
  }

  async Show(ctx, id) {
    const asset = this.Get(ctx, id)
    return asset.toBuffer();
  }

  async assetExists(ctx, id) {
    const assetJSON = await ctx.stub.getState(id);
    return assetJSON && assetJSON.length > 0;
  }

  async BuyRequestAsset(ctx, id, buyer) {
    const key = ctx.stub.createCompositeKey(UsedThing.getClass(), [id])
    const asset = await this.Get(ctx, key)
    
    if ( !asset.isRegistered() ) {
      throw new Error(`currentState must be registered`)
    }

    if ( asset.getSeller() == buyer ) {
      throw new Error(`seller can't buy their own used_thing`)
    }

    asset.setBuyRequested();
    
    asset.setBuyer(buyer)
    
    return await ctx.stub.putState(key, State.serialize(asset));
  }

  async SendAsset(ctx, id) {
    const key = ctx.stub.createCompositeKey(UsedThing.getClass(), [id])
    const asset = await this.Get(ctx, key)
    const currentUser = ctx.clidentIdentity.getID()

    if ( !asset.isBuyRequested() ) {
      throw new Error(`currentState must be buy_requested`)
    }

    if ( asset.getSeller() != currentUser ) {
      throw new Error(`only seller invoke this contract`)
    }

    asset.setSent();
    
    return await ctx.stub.putState(key, State.serialize(asset));
  }
  
  async ReceiveAsset(ctx, id) {
    const key = ctx.stub.createCompositeKey(UsedThing.getClass(), [id])
    const asset = await this.Get(ctx, key)
    const currentUser = ctx.clidentIdentity.getID()

    if ( !asset.isSent() ) {
      throw new Error(`currentState must be sent`)
    }

    if ( asset.getBuyer() != currentUser ) {
      throw new Error(`only buyer invoke this contract`)
    }

    asset.setReceived()
    
    return await ctx.stub.putState(key, State.serialize(asset));
  }

  async ConfirmAsset(ctx, id) {
    const key = ctx.stub.createCompositeKey(UsedThing.getClass(), [id])
    const asset = await this.Get(ctx, key)
    const currentUser = ctx.clidentIdentity.getID()

    if ( !asset.isReceived() ) {
      throw new Error(`currentState must be received`)
    }

    if ( asset.getBuyer() != currentUser ) {
      throw new Error(`only buyer invoke this contract`)
    }

    asset.setConfirmed()
    
    return await ctx.stub.putState(key, State.serialize(asset));
  }

  async GetAllAssetsByState(ctx, state) {
    let queryString = {}
    queryString.selector = {}
    queryString.selector.currentState = parseInt(state)
    const resultsItorator = await ctx.stub.getQueryResult(JSON.stringify(queryString))
    let queryResult = await this.getAllResults(resultsItorator, false)
    return queryResult
  }

  async GetAllSellingAssets(ctx, seller) {
    let queryString = {}
    queryString.selector = {}
    queryString.selector.Seller = seller
    const resultsItorator = await ctx.stub.getQueryResult(JSON.stringify(queryString))
    let queryResult = await this.getAllResults(resultsItorator, false)
    return queryResult
  }

  async GetAllBuyingAssets(ctx, buyer) {
    let queryString = {}
    queryString.selector = {}
    queryString.selector.Buyer = buyer
    const resultsItorator = await ctx.stub.getQueryResult(JSON.stringify(queryString))
    let queryResult = await this.getAllResults(resultsItorator, false)
    return queryResult
  }

  async getAllResults(iterator, isHistory) {
    let allResults = [];
    let res = { done: false, value: null };

    while (true) {
      res = await iterator.next();
      let jsonRes = {};
      if (res.value && res.value.value.toString()) {
        if (isHistory && isHistory === true) {
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
}

module.exports = UsedThingChainCode;
