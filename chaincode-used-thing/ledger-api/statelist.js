/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

'use strict';
const State = require('./state.js');
const UsedThing = require('../lib/UsedThing.js')

/**
 * StateList provides a named virtual container for a set of ledger states.
 * Each state has a unique key which associates it with the container, rather
 * than the container containing a link to the state. This minimizes collisions
 * for parallel transactions on different states.
 */
class StateList {

  /**
   * Store Fabric context for subsequent API access, and name of list
   */
  constructor(ctx, listName) {
    this.ctx = ctx;
    this.name = listName;
    this.supportedClasses = {};
  }

  /**
   * Add a state to the list. Creates a new state in worldstate with
   * appropriate composite key.  Note that state defines its own key.
   * State object is serialized before writing.
   */
  async addState(state) {
    let key = this.ctx.stub.createCompositeKey(this.name, state.getSplitKey());
    let data = State.serialize(state);
    await this.ctx.stub.putState(key, data);
  }

  /**
   * Get a state from the list using supplied keys. Form composite
   * keys to retrieve state from world state. State data is deserialized
   * into JSON object before being returned.
   */
  async getState(key) {
    let ledgerKey = this.ctx.stub.createCompositeKey(this.name, State.splitKey(key));
    let data = await this.ctx.stub.getState(ledgerKey);
    if (data && data.toString('utf8')) {
      let state = State.deserialize(data, this.supportedClasses);
      return state;
    } else {
      return null;
    }
  }

  /**
   * Update a state in the list. Puts the new state in world state with
   * appropriate composite key.  Note that state defines its own key.
   * A state is serialized before writing. Logic is very similar to
   * addState() but kept separate becuase it is semantically distinct.
   */
  async updateState(state) {
    let key = this.ctx.stub.createCompositeKey(this.name, state.getSplitKey());
    let data = State.serialize(state);
    await this.ctx.stub.putState(key, data);
  }

  async addStateDelta(serialNumber, productName, attr, op, value) {
    let txID = this.ctx.stub.getTxID()
    let strings = [serialNumber, productName, attr, op, value, txID]
    let key = this.ctx.stub.createCompositeKey(this.name, strings);
    await this.ctx.stub.putState(key, Buffer.from('\0'))
  }

  async pruneDelta(serialNumber, productName) {
    let iterator = await this.ctx.stub.getStateByPartialCompositeKey(this.name, [serialNumber, productName]);
    let likeList = new Set([])

    let res = { done: false, value: null };
    let original = null

    while (true) {
      res = await iterator.next();
      if (res.value && res.value.value.toString()) {
        let {objectType, attributes} = this.ctx.stub.splitCompositeKey(res.value.key)
        if ( attributes.length == 2 ) {
          original = State.deserializeClass(res.value.value, UsedThing);
          if ( !original.likeListEmpty() ) {           
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

        let key = this.ctx.stub.createCompositeKey(this.name, attributes);
        await this.ctx.stub.deleteState(key);
      }
      if (res.done) {
        await iterator.close();
        original.likeList = Array.from(likeList)
        break;
      }
    }  // while true

    let key = this.ctx.stub.createCompositeKey(this.name, [serialNumber, productName]);
    let data = State.serialize(original);
    await this.ctx.stub.putState(key, data);
  }

  async deleteState(state) {
    let key = this.ctx.stub.createCompositeKey(this.name, state.getSplitKey());
    await this.ctx.stub.deleteState(key);
  }

  /** Stores the class for future deserialization */
  use(stateClass) {
    this.supportedClasses[stateClass.getClass()] = stateClass;
  }

}

module.exports = StateList;
