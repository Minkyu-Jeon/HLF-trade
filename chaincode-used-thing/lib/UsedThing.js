'use strict';

// Utility class for ledger state
const State = require('./../ledger-api/state.js');

// Enumerate used thing state values
const utState = {
  REGISTERED: 1,
  BUY_REQUESTED: 2,
  SENT: 3,
  ARRIVED: 4,
  CONFIRMED: 5
};

/**
 * UsedThing class extends State class
 * Class will be used by application and smart contract to define a paper
 */
class UsedThing extends State {

  constructor(obj) {
    super(UsedThing.getClass(), [obj.Seller, obj.ProductName]);
    this.currentState = this.currentState || utState.REGISTERED
    Object.assign(this, obj);
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

  getBuyer() {
    return this.Buyer
  }

  setBuyer(buyer) {
    this.Buyer = buyer
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

  setArrived() {
    this.currentState = utState.ARRIVED
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

  isArrived() {
    return this.currentState === utState.ARRIVED;
  }

  isConfirmed() {
    return this.currentState === utState.CONFIRMED;
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
  static createInstance(Seller, Title, ProductName, Category, ImageUrl, Description, Price) {
    return new UsedThing({ Seller, Title, ProductName, Category, ImageUrl, Description, Price });
  }

  static getClass() {
    return 'org.example.used_thing';
  }
}

module.exports = UsedThing;
