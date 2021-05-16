'use strict';

const { Contract, Context } = require('fabric-contract-api');

const UsedThing = require('./UsedThing')
const ThingList = require('./UsedThingList')
const QueryUtils = require('./queries')
const seeds = require('./seed.json')

class UsedThingContext extends Context {
  constructor() {
    super()
    this.thingList = new ThingList(this)
  }
}

class UsedThingChainCode extends Contract {

  constructor() {
    super('org.example.used_thing')
    this.ts = new Date()
  }

  async InitLedger(ctx) {
    // empty
  }

  createContext() {
    return new UsedThingContext()
  }

  async SeedingLedger(ctx) {
    for ( let item of seeds ) {
      let { SerialNumber, Title, ProductName, Category, ImageUrl, Description, Price, Seller, MSPID } = item
      
      const asset = UsedThing.createInstance(SerialNumber, Title, ProductName, Category, ImageUrl, Description, Price);

      asset.setRegistered()

      asset.setSellerMSPID(MSPID)

      asset.setSeller(Seller)

      await ctx.thingList.addThing(asset)
    }
  }

  async ClearLedger(ctx) {
    for ( let state of [1,2,3,4,5] ) {
      const results = await this.GetAllAssetsByState(ctx, state)

      for ( let record of results ) {
        console.log(`${record.Record.SerialNumber} ${record.Record.ProductName}`)
        await this.DeleteAsset(ctx, record.Record.SerialNumber, record.Record.ProductName)
      }
    }
    return true
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

  async ShowOriginal(ctx, SerialNumber, ProductName) {
    let assetKey = UsedThing.makeKey([SerialNumber, ProductName]);

    let asset = await ctx.thingList.getThing(assetKey);

    return asset
  }
  
  async Show(ctx, SerialNumber, ProductName) {
    let deltaResultItorator = await ctx.stub.getStateByPartialCompositeKey(ctx.thingList.name, [SerialNumber, ProductName]);
    
    let query = this.getQueryUtils(ctx)

    let asset = query.getCalculatedDelta(deltaResultItorator)
    
    return asset
  }

  async PruneAsset(ctx, SerialNumber, ProductName) {
    await ctx.thingList.pruneThing(SerialNumber, ProductName)

    return true
  }

  async LikeAsset(ctx, SerialNumber, ProductName) {
    const buyer = ctx.clientIdentity.getAttributeValue('hf.EnrollmentID')

    await ctx.thingList.addThingDelta(SerialNumber, ProductName, "likeList", "add", buyer)

    return true
  }

  async DislikeAsset(ctx, SerialNumber, ProductName) {
    const buyer = ctx.clientIdentity.getAttributeValue('hf.EnrollmentID')

    await ctx.thingList.addThingDelta(SerialNumber, ProductName, "likeList", "sub", buyer)

    return true
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
    
    asset.setConfirmed()

    await ctx.thingList.updateThing(asset)
    
    return asset
  }

  async DeleteAsset(ctx, SerialNumber, ProductName) {
    let key = ctx.stub.createCompositeKey('org.example.thing', [SerialNumber, ProductName]);
    
    await ctx.stub.deleteState(key);

    return true
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
