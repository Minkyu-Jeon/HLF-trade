'use strict';

// Utility class for ledger state
const State = require('./../ledger-api/state.js');

// Enumerate used thing state values
const utState = {
  REGISTERED: 1,
  BUY_REQUESTED: 2,
  SENT: 3,
  RECEIVED: 4,
  CONFIRMED: 5
};

/**
 * UsedThing class extends State class
 * Class will be used by application and smart contract to define a paper
 */
class UsedThing extends State {

  constructor(obj) {
    super(UsedThing.getClass(), [obj.SerialNumber, obj.ProductName]);
    Object.assign(this, obj);
    this.likeList = new Set([])
  }

  /**
   * Basic getters and setters
  */

  getSeller() {
    return this.Seller
  }

  setSeller(seller) {
    this.Seller = seller
  }

  getSellerMSPID() {
    return this.SellerMSPID
  }

  setSellerMSPID(mspID) {
    this.SellerMSPID = mspID 
  }

  getBuyer() {
    return this.Buyer
  }

  setBuyer(buyer) {
    this.Buyer = buyer
  }

  getBuyerSPID() {
    return this.BuyerMSPID
  }

  getLikes() {
    return this.likeList
  }

  setBuyerMSPID(mspID) {
    this.BuyerMSPID = mspID 
  }

  setAddress(encryptedAddress) {
    this.Address = encryptedAddress
  }

  getAddress(decryptor, private_key) {
    return decryptor.decrypt(this.Address, private_key)
  }

  setRegistered() {
    this.currentState = utState.REGISTERED
  }

  setBuyRequested() {
    this.currentState = utState.BUY_REQUESTED
  }

  setSent() {
    this.currentState = utState.SENT
  }

  setReceived() {
    this.currentState = utState.RECEIVED
  }

  setConfirmed() {
    this.currentState = utState.CONFIRMED
  }

  isRegistered() {
    return this.currentState === utState.REGISTERED;
  }

  isBuyRequested() {
    return this.currentState === utState.BUY_REQUESTED;
  }

  isSent() {
    return this.currentState === utState.SENT;
  }

  isReceived() {
    return this.currentState === utState.RECEIVED;
  }

  isConfirmed() {
    return this.currentState === utState.CONFIRMED;
  }

  like(user) {
    let result = false

    if ( this.likeListEmpty() ) {
      this.likeList = new Set([])
    }

    if ( !this.alreadyLiked(user) ) {
      this.likeList.add(user)
      result = true
    }

    return result
  }

  dislike(user) {
    let result = false

    if ( this.likeListEmpty() ) {
      return result
    }

    if ( this.alreadyLiked(user) ) {
      this.likeList.delete(user)
    }

    return result
  }

  likeListEmpty() {
    return this.likeList === undefined || this.likeList.length == 0
  }

  alreadyLiked(user) {
    return this.likeList.has(user)
  }

  static fromBuffer(buffer) {
    return UsedThing.deserialize(buffer);
  }

  toBuffer() {
    return Buffer.from(JSON.stringify(this));
  }

  /**
   * Deserialize a state data to used thing
   * @param {Buffer} data to form back into the object
   */
  static deserialize(data) {
    return State.deserializeClass(data, UsedThing);
  }

  /**
   * Factory method to create a used thing object
   */
  static createInstance(SerialNumber, Title, ProductName, Category, ImageUrl, Description, Price) {
    return new UsedThing({ SerialNumber, Title, ProductName, Category, ImageUrl, Description, Price });
  }

  static getClass() {
    return 'org.example.used_thing';
  }
}

module.exports = UsedThing;
