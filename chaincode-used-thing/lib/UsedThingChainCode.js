'use strict';

const { Contract, Context } = require('fabric-contract-api');

const UsedThing = require('./UsedThing')
const ThingList = require('./UsedThingList')
const QueryUtils = require('./queries')

class UsedThingContext extends Context {
  constructor() {
    super()
    this.thingList = new ThingList(this)
  }
}

class UsedThingChainCode extends Contract {

  constructor() {
    super('org.example.used_thing')
  }

  async InitLedger(ctx) {
    // empty
  }

  createContext() {
    return new UsedThingContext()
  }

  async CreateAsset(ctx, serialNumber, category, title, product_name, image_url, description, price, seller) {
    const asset = UsedThing.createInstance(serialNumber, title, product_name, category, image_url, description, price);

    asset.setRegistered()
    
    let mspid = ctx.clientIdentity.getMSPID()

    asset.setSellerMSPID(mspid)

    asset.setSeller(seller)

    await ctx.thingList.addThing(asset)

    return asset;
  }

  async Show(ctx, SerialNumber, ProductName) {
    let assetKey = UsedThing.makeKey([SerialNumber, ProductName]);

    let asset = await ctx.thingList.getThing(assetKey);

    return asset
  }

  async BuyRequestAsset(ctx, SerialNumber, ProductName) {
    let assetKey = UsedThing.makeKey([SerialNumber, ProductName]);

    let asset = await ctx.thingList.getThing(assetKey);

    const buyer = ctx.clientIdentity.getAttributeValue('hf.EnrollmentID')
    
    if ( !asset.isRegistered() ) {
      throw new Error(`currentState must be registered`)
    }

    if ( asset.getSeller() == buyer ) {
      throw new Error(`seller can't buy their own used_thing`)
    }

    asset.setBuyRequested();
    
    asset.setBuyer(buyer)

    let mspid = ctx.clientIdentity.getMSPID()

    asset.setBuyerMSPID(mspid)

    await ctx.thingList.updateThing(asset)

    return asset
  }

  async SendAsset(ctx, SerialNumber, ProductName) {
    let assetKey = UsedThing.makeKey([SerialNumber, ProductName]);

    let asset = await ctx.thingList.getThing(assetKey);

    const buyer = ctx.clientIdentity.getAttributeValue('hf.EnrollmentID')

    if ( !asset.isBuyRequested() ) {
      throw new Error(`currentState must be buy_requested`)
    }

    if ( asset.getSeller() != buyer ) {
      throw new Error(`only seller invoke this contract`)
    }

    asset.setSent();

    await ctx.thingList.updateThing(asset)

    return asset
  }
  
  async ReceiveAsset(ctx, SerialNumber, ProductName) {
    let assetKey = UsedThing.makeKey([SerialNumber, ProductName]);

    let asset = await ctx.thingList.getThing(assetKey);

    const buyer = ctx.clientIdentity.getAttributeValue('hf.EnrollmentID')

    if ( !asset.isSent() ) {
      throw new Error(`currentState must be sent`)
    }

    if ( asset.getBuyer() != buyer ) {
      throw new Error(`only buyer invoke this contract`)
    }

    asset.setReceived()

    await ctx.thingList.updateThing(asset)
    
    return asset
  }

  async ConfirmAsset(ctx, SerialNumber, ProductName) {
    let assetKey = UsedThing.makeKey([SerialNumber, ProductName]);

    let asset = await ctx.thingList.getThing(assetKey);

    const buyer = ctx.clientIdentity.getAttributeValue('hf.EnrollmentID')

    if ( !asset.isReceived() ) {
      throw new Error(`currentState must be received`)
    }

    if ( asset.getBuyer() != buyer ) {
      throw new Error(`only buyer invoke this contract`)
    }

    await ctx.thingList.updateThing(asset)
    
    return asset
  }

  async queryHistory(ctx, SerialNumber, ProductName) {
    let query = this.getQueryUtils(ctx)
    let result = await query.getAssetHistory(SerialNumber, ProductName)
    return result
  }

  async GetAllAssetsByState(ctx, state) {
    let query = this.getQueryUtils(ctx)
    let queryResult = await query.queryByAdhoc({selector: { currentState: parseInt(state) }})
    return queryResult
  }

  async GetAllSellingAssets(ctx, seller) {
    let query = this.getQueryUtils(ctx)
    let queryResult = await query.queryKeyBySeller(seller)
    return queryResult
  }

  async GetAllBuyingAssets(ctx, buyer) {
    let query = this.getQueryUtils(ctx)
    let queryResult = await query.queryKeyByBuyer(buyer)
    return queryResult
  }

  getQueryUtils(ctx) {
    return new QueryUtils(ctx, 'org.example.thing')
  }
}

module.exports = UsedThingChainCode;
