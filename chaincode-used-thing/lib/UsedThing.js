'use strict';

// Utility class for ledger state
const State = require('./../ledger-api/state.js');

// Enumerate used thing state values
const utState = {
  REGISTERED: 1,
  BUY_REQUESTED: 2,
  PACKAGED: 3,
  SENT: 4,
  ARRIVED: 5,
  FINISHED: 6
};

/**
 * UsedThing class extends State class
 * Class will be used by application and smart contract to define a paper
 */
class UsedThing extends State {

  constructor(obj) {
    super(UsedThing.getClass(), [obj.issuer, obj.paperNumber]);
    Object.assign(this, obj);
  }

  /**
   * Basic getters and setters
  */
  

  isRegistered() {
    return this.currentState === utState.REGISTERED;
  }

  isBuyRequested() {
    return this.currentState === utState.BUY_REQUESTED;
  }

  isPackaged() {
    return this.currentState === utState.PACKAGED;
  }

  isSent() {
    return this.currentState === utState.SENT;
  }

  isArrived() {
    return this.currentState === utState.ARRIVED;
  }

  isFinished() {
    return this.currentState === utState.FINISHED;
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
  static createInstance(issuer, paperNumber, issueDateTime, maturityDateTime, faceValue) {
    return new UsedThing({ issuer, paperNumber, issueDateTime, maturityDateTime, faceValue });
  }

  static getClass() {
    return 'org.example.used_thing';
  }
}

module.exports = UsedThing;
