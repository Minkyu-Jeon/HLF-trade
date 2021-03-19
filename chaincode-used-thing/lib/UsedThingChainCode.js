'use strict';

const { Contract } = require('fabric-contract-api');
const UsedThing = require('./UsedThing')

class UsedThingChainCode extends Contract {

  async InitLedger(ctx) {
    // empty
  }

  async CreateAsset(ctx, id, category, title, product_name, image_url, description, price, seller) {
    const asset = UsedThing.createInstance(
      seller,
      title,
      product_name,
      category,
      image_url,
      description,
      price,
    );

    ctx.stub.putState(id, asset.toBuffer());

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

  async BuyRequestAsset(ctx, id) {
    const asset = this.Get(ctx, id)
    asset.setBuyRequested();
    
    return ctx.stub.putState(id, asset.toBuffer());
  }

  async SendAsset(ctx, id) {
    const asset = this.Get(ctx, id)
    asset.setSent();
    
    return ctx.stub.putState(id, asset.toBuffer());
  }
  
  async ReceiveAsset(ctx, id) {
    const asset = this.Get(ctx, id)
    asset.setReceived()
    
    return ctx.stub.putState(id, asset.toBuffer());
  }

  async ConfirmAsset(ctx, id) {
    const asset = this.Get(ctx, id)
    asset.setConfirmed()
    
    return ctx.stub.putState(id, asset.toBuffer());
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
      allResults.push( Object.assign({ id: result.value.key }, record) );
      result = await iterator.next();
    }
    return JSON.stringify(allResults);
  }
}

module.exports = UsedThingChainCode;
