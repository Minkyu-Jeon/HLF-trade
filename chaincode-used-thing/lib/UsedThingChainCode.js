'use strict';

const { Contract } = require('fabric-contract-api');
const UsedThing = require('./UsedThing')

class UsedThingChainCode extends Contract {

  async InitLedger(ctx) {
    // empty
  }

  async CreateAsset(ctx, id, category, title, product_name, image_url, description, price, seller) {
    const asset = new UsedThing({
      docType: 'used_thing',
      Title: title,
      ProductName: product_name,
      Category: category,
      ImageUrl: image_url,
      Description: description,
      Price: price,
      Seller: seller,
      SellingState: 'registered'
    });
    ctx.stub.putState(id, Buffer.from(JSON.stringify(asset)));

    return JSON.stringify(asset);
  }

  async Show(ctx, id) {
    const assetJSON = await ctx.stub.getState(id); 
    if (!assetJSON || assetJSON.length === 0) {
      throw new Error(`The asset ${id} does not exist`);
    }
    return assetJSON.toString();
  }

  async assetExists(ctx, id) {
    const assetJSON = await ctx.stub.getState(id);
    return assetJSON && assetJSON.length > 0;
  }

  async BuyRequestAsset(ctx, id, user_id, address) {
    const asset = JSON.parse(this.Show(ctx, id))
    asset.SettingState = 'buy_requested'
    
    return ctx.stub.putState(id, Buffer.from(JSON.stringify(asset)));
  }

  async GetAllAssets(ctx) {
    const allResults = [];
    // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
    const iterator = await ctx.stub.getStateByRange('', '');
    let result = await iterator.next();
    while (!result.done) {
      const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
      let record;
      try {
        record = JSON.parse(strValue);
      } catch (err) {
        console.log(err);
        record = strValue;
      }
      allResults.push({ Key: result.value.key, Record: record });
      result = await iterator.next();
    }
    return JSON.stringify(allResults);
  }
}

module.exports = UsedThingChainCode;
